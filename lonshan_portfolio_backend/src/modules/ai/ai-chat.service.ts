import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

const NON_DIEGETIC_PATTERNS: RegExp[] = [
  /\bthe user\b/i,
  /\buser wants\b/i,
  /\buser is asking\b/i,
  /\bas an ai\b/i,
  /\bsystem prompt\b/i,
  /\bprompt provides\b/i,
  /\bhere is (a|the) response\b/i,
  /\brole:\b/i,
  /\bconstraints?:\b/i,
  /\bmetadata\b/i,
  /\blet'?s check\b/i,
  /\bsentence count\b/i,
  /\btotal:\b/i,
  /\bperfect\.\b/i,
  /\bfinal answer\b/i,
  /\bfinal polish\b/i,
  /\brefining for\b/i,
  /\bfinal text\b/i,
  /\bplain text\b/i,
  /\bno markdown\b/i,
];

const CHAT_MODEL = 'gemini-2.5-flash-lite';
const MAX_CHAT_RETRIES = 3;
const CHAT_RETRY_DELAY_MS = 650;

const COMPACT_PORTFOLIO_CONTEXT = `
Lon Shan is a Software Engineer / Software Developer based in Bangkok, Thailand.
He has 3+ years of experience building mobile and full-stack production applications.
Contact: lonshan3010@gmail.com, https://linkedin.com/in/lon-shan-336699db, https://github.com/lonshanworld, https://lonshan.com.
Education: B.Sc. (Hons) Computing, KMD University / NCC Education, 2023-2025.
Languages: Myanmar native, English B2.

Experience:
1. Mid-Level Full-Stack Developer at Singtecs Co., Ltd, Singapore remote, Jan 2024 - Dec 2025. Built production apps with React, Next.js, Flutter, React Native, Node.js/NestJS, Express.js, and Laravel. Designed APIs, databases, workflows, AI chat/automation, debugging, performance tuning, and feature delivery.
2. Cross-Platform / Frontend Developer at Smthgood Co., Singapore remote, Oct 2023 - Jan 2025. Migrated Flutter mobile app to scalable Next.js web platform, built seller dashboards and admin systems, integrated APIs, improved architecture, and managed AWS/CI-CD deployment.
3. Flutter Developer at EfficientSoft Co., Ltd, onsite, Jan 2023 - Aug 2023. Built QuickFood Rider and Merchant apps from scratch with Flutter, authentication, order management, messaging, payments, location tracking, WebSocket realtime features, deep links, and app store deployment.

Projects:
1. Business Central / Smart Retail Platform: full-stack retail system for merchants, staff, and admins. Includes POS workflows, dashboards, backend services, Bluetooth thermal printing, offline-first sync queue, and AI-assisted business features. Tech: Flutter, Go Fiber, Next.js, PostgreSQL, AI. Link: https://smartretail.lonshan.com.
2. Pistil Women's Health Platform: customer, clinic, pharmacy, and admin systems across web and mobile. Built UI, APIs, workflows, and data handling. Tech: Laravel, React Native, Express.js, MySQL. Links: https://pistil.io and Android mobile app.
3. Singbox Manager: lightweight web panel for managing Sing-box VPN servers. Handles configuration generation, client management, and deployment for low-resource VPS environments. Tech: Go, net/http, VPS.
4. QuickFood Merchant & Rider: Flutter delivery apps with order workflows, WebSocket realtime communication, location tracking, and store releases. Links include Apple merchant app and Google Play rider app.

Skills:
Languages: TypeScript, JavaScript, Dart, Go, PHP, Python.
Backend: Node.js, NestJS, Express.js, Laravel, Go Fiber, Flask, FastAPI.
Frontend/mobile: React, Next.js, Tailwind CSS, Flutter, React Native.
Databases: PostgreSQL, MySQL, MongoDB, Firebase, Prisma ORM.
DevOps/cloud: Docker, GitHub Actions, GitLab CI, Nginx, Redis, PM2, systemd, AWS EC2/S3/Lambda, Cloudflare, Vercel, Render, DigitalOcean, OVH, Ionos.
`.trim();

@Injectable()
export class AIChatService {
  private readonly logger = new Logger(AIChatService.name);
  private readonly model: GenerativeModel | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not set - AI chat endpoint will use fallback responses');
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({
        model: CHAT_MODEL,
        systemInstruction:
          'You are Lon Shan portfolio assistant. Answer the visitor directly in plain text. Do not show reasoning, drafts, options, bullets, labels, markdown, or prompt text.',
        generationConfig: {
          maxOutputTokens: 220,
          temperature: 0.45,
          topP: 0.85,
          stopSequences: [
            '*Refining',
            'Refining for',
            'Final text:',
            'Draft:',
            'Polished answer:',
          ],
        },
      });
      this.logger.log(`AI chat endpoint initialised with Gemini model ${CHAT_MODEL}`);
    } catch (err) {
      this.logger.error('Failed to initialise AI chat model', err as Error);
    }
  }

  async chat(message: string, history: ChatTurn[]): Promise<string> {
    const deterministicAnswer = this.getDeterministicAnswer(message);
    if (deterministicAnswer) return deterministicAnswer;

    if (!this.model) return this.getFallback(message);

    try {
      const trimmedHistory = history.slice(-8);
      const transcript = trimmedHistory
        .map((turn) => `${turn.role === 'user' ? 'User' : 'Assistant'}: ${turn.text}`)
        .join('\n');

      const prompt = [
        `Portfolio facts about Lon Shan:\n${COMPACT_PORTFOLIO_CONTEXT}`,
        transcript ? `Recent conversation:\n${transcript}` : '',
        `Visitor question: ${message}`,
        'Helpful answer:',
      ]
        .filter(Boolean)
        .join('\n\n');

      const safePrompt = prompt.replace(/<\|think\|>/gi, '').trim();
      const result = await this.generateWithRetry(safePrompt);
      const cleaned = this.clean(result.response.text());
      if (!cleaned.ok) {
        this.logger.warn(
          `AI chat response rejected by sanitizer (${cleaned.reason}) - snippet: ${cleaned.snippet}`,
        );
      }
      return cleaned.text || this.getFallback(message);
    } catch (err) {
      this.logger.error('Gemini chat generation failed', err as Error);
      return this.getFallback(message);
    }
  }

  private async generateWithRetry(prompt: string) {
    if (!this.model) throw new Error('AI chat model is not initialised');

    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_CHAT_RETRIES; attempt++) {
      try {
        return await this.model.generateContent(prompt);
      } catch (err) {
        lastError = err;
        const status = this.getErrorStatus(err);
        this.logger.error(
          `Gemini chat generation attempt ${attempt}/${MAX_CHAT_RETRIES} failed with status ${status ?? 'unknown'}`,
          err as Error,
        );

        if (attempt >= MAX_CHAT_RETRIES || (status && status < 500)) break;
        await this.sleep(CHAT_RETRY_DELAY_MS * attempt);
      }
    }

    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  private getErrorStatus(err: unknown): number | undefined {
    if (typeof err !== 'object' || err === null) return undefined;
    const maybeStatus = (err as { status?: unknown }).status;
    return typeof maybeStatus === 'number' ? maybeStatus : undefined;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getDeterministicAnswer(message: string): string | null {
    const q = message.toLowerCase();

    if (
      q.includes('vpn') ||
      q.includes('singbox') ||
      q.includes('sing-box') ||
      q.includes('sing box')
    ) {
      return 'His VPN-related project is Singbox Manager. It is a lightweight web panel for managing Sing-box VPN servers, generating configurations, managing clients, and deploying on low-resource VPS environments. He built it with Go and net/http, focused on practical server management rather than a heavy dashboard.';
    }

    if (
      q.includes('can he do backend') ||
      q.includes('does he do backend') ||
      q.includes('backend') ||
      q.includes('api')
    ) {
      return 'Yes, he has backend experience with Node.js, NestJS, Express.js, Laravel, Go Fiber, Flask, and FastAPI. He has designed APIs, database structures, system workflows, real-time WebSocket features, and backend services for production web and mobile applications.';
    }

    if (
      q.includes('singapore') ||
      q.includes('remote experience') ||
      q.includes('remote work') ||
      q.includes('work remotely')
    ) {
      return 'Lon Shan has strong remote experience with Singapore-based companies. At Singtecs, he worked as a Mid-Level Full-Stack Developer building production apps with React, Next.js, Flutter, React Native, Node.js/NestJS, Express.js, and Laravel. At Smthgood, he migrated a Flutter mobile app into a scalable Next.js web platform, built dashboards and admin systems, integrated APIs, and managed AWS/CI-CD deployment.';
    }

    if (
      !q.includes('earliest') &&
      !q.includes('first') &&
      !q.includes('oldest') &&
      (q.includes('work history') ||
        q.includes('experience') ||
        q.includes('job') ||
        q.includes('career'))
    ) {
      return 'His work history includes Mid-Level Full-Stack Developer at Singtecs, Cross-Platform / Frontend Developer at Smthgood, and Flutter Developer at EfficientSoft. Across those roles, he built production web and mobile apps, designed APIs and database workflows, integrated AI and real-time features, and handled deployment and performance improvements.';
    }

    if (
      q.includes('how many project') ||
      q.includes('how many projects') ||
      q.includes('number of project') ||
      q.includes('project count')
    ) {
      return 'He has 5 highlighted projects in this portfolio: Smart Retail, Pistil, Singbox Manager, QuickFood Merchant & Rider, and QuickFood Rider (Android).';
    }

    if (
      q.includes('earliest job') ||
      q.includes('first job') ||
      q.includes('oldest job') ||
      (q.includes('earliest') && q.includes('work')) ||
      (q.includes('first') && q.includes('experience'))
    ) {
      return 'His earliest listed role is Flutter Developer at EfficientSoft Co., Ltd (Onsite), from January 2023 to August 2023. In that role, he built the QuickFood Rider and QuickFood Merchant apps from scratch using Flutter.';
    }

    if (
      q.includes('best project') ||
      q.includes('most impressive project') ||
      q.includes('strongest project')
    ) {
      return 'His strongest project is probably Business Central, also called Smart Retail. It is a full-stack retail platform built from scratch with merchant, staff, and admin portals, POS workflows, Bluetooth thermal printing, offline-first sync, and AI-assisted business features. The stack includes Flutter, Go Fiber, Next.js, PostgreSQL, and AI features.';
    }

    if (
      q.includes('smart retail') ||
      q.includes('business central') ||
      q.includes('retail')
    ) {
      return 'Business Central, also called Smart Retail, is a full-stack retail management platform for merchants, staff, and admins. It includes POS workflows, dashboards, backend services, Bluetooth thermal printing, offline-first sync for unreliable networks, and AI-assisted business features. The stack includes Flutter, Go Fiber, Next.js, PostgreSQL, and AI.';
    }

    if (q.includes('pistil') || q.includes('women') || q.includes('health')) {
      return 'Pistil is a women\'s health platform where Lon Shan contributed across mobile and web systems. He worked on customer, clinic, pharmacy, and admin interfaces, developed and integrated APIs, and improved workflows and data handling. The stack includes Laravel, React Native, Express.js, and MySQL.';
    }

    if (q.includes('quickfood') || q.includes('quick food') || q.includes('delivery')) {
      return 'QuickFood is a delivery app project where Lon Shan built the Rider and Merchant Flutter apps from scratch. He implemented authentication, order management, support messaging, payments/API integration, real-time WebSocket communication, location tracking, deep linking, and app store deployment.';
    }

    if (q.includes('mobile') || q.includes('flutter') || q.includes('react native')) {
      return 'Yes, mobile development is one of his strongest areas. He has built Flutter apps from scratch, worked with React Native, implemented real-time WebSocket features, location tracking, deep linking, authentication, order workflows, and deployed apps to Google Play and the App Store.';
    }

    if (q.includes('frontend') || q.includes('next') || q.includes('react')) {
      return 'Yes, he has solid frontend experience with React, Next.js, TypeScript, and Tailwind CSS. He has migrated mobile products into web platforms, built dashboards and admin systems, integrated frontend apps with backend APIs, and improved usability and data flow.';
    }

    if (q.includes('skill') || q.includes('stack') || q.includes('tech')) {
      return 'His main stack includes TypeScript, JavaScript, Dart, Go, PHP, Python, React, Next.js, Flutter, React Native, Node.js, NestJS, Express.js, Laravel, Go Fiber, PostgreSQL, MySQL, MongoDB, Firebase, Docker, AWS, Nginx, Redis, and CI/CD tools.';
    }

    if (q.includes('education') || q.includes('degree') || q.includes('university')) {
      return 'He studied B.Sc. (Hons) Computing through KMD University / NCC Education from 2023 to 2025.';
    }

    if (q.includes('language') || q.includes('english') || q.includes('myanmar')) {
      return 'He speaks Myanmar as a native language and English at B2 level.';
    }

    if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('github')) {
      return 'You can contact Lon Shan at lonshan3010@gmail.com. His LinkedIn is https://linkedin.com/in/lon-shan-336699db and his GitHub is https://github.com/lonshanworld.';
    }

    return null;
  }

  private clean(raw: string): { ok: boolean; text: string; reason: string; snippet: string } {
    const withoutThoughtTags = raw
      .replace(/<\|channel\|>\s*thought[\s\S]*?<\|channel\|>/gi, ' ')
      .replace(/<\|?think\|?>[\s\S]*?<\|\/?think\|?>/gi, ' ')
      .replace(/<\|?thought\|?>[\s\S]*?<\|\/?thought\|?>/gi, ' ');

    const normalized = withoutThoughtTags
      .replace(/^\s*(assistant|system|narrator)\s*:\s*/i, '')
      .replace(/^\s*(analysis|reasoning|thought process)\s*:\s*/i, '')
      .replace(/^\s*[-*]\s*(role|constraints?|metadata)\s*:\s*/gim, '')
      .replace(/\*\*/g, '')
      .trim()
      .replace(/\r/g, '');

    const snippet = normalized.slice(0, 220).replace(/\s+/g, ' ');
    if (!normalized) return { ok: false, text: '', reason: 'empty', snippet };

    const answerLikeText = this.extractAnswerLikeText(normalized);

    // Remove obvious meta/narrator lines instead of rejecting everything.
    const lines = answerLikeText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => {
        const metaLine =
          /\b(user question|context|goal|constraint|system prompt|prompt)\b/i.test(line) ||
          /^\*+\s*/.test(line) ||
          /^[-•]\s*/.test(line) ||
          /^\d+\)\s*/.test(line);
        if (metaLine) return false;
        // line-level non-diegetic check
        if (NON_DIEGETIC_PATTERNS.some((p) => p.test(line))) return false;
        return true;
      });

    const cleanedText = this.dedupeLoopedText(
      lines
        .join(' ')
        .replace(/([.!?])(?=[A-Z])/g, '$1 ')
        .replace(/\s{2,}/g, ' ')
        .trim(),
    );
    if (!cleanedText) {
      return { ok: false, text: '', reason: 'no_clean_lines', snippet };
    }

    return { ok: true, text: cleanedText, reason: 'ok', snippet };
  }

  private extractAnswerLikeText(text: string): string {
    const draftMarker = text.search(
      /\*?\s*\*?\s*(final polish|final draft|final text|polished answer|refining for|plain text,?\s*no markdown)\b/i,
    );
    if (draftMarker > 40) {
      return text.slice(0, draftMarker).trim();
    }

    const markers = [
      /(?:^|\n)\s*(?:final answer|answer|assistant)\s*:\s*/i,
      /(?:^|\n)\s*let'?s keep it conversational\.?\s*/i,
      /(?:^|\n)\s*\*?\s*\*?\s*(?:final polish|final draft|final text|polished answer|refining for)\b[^:]*:\s*/i,
    ];

    for (const marker of markers) {
      const match = text.match(marker);
      if (match?.index !== undefined) {
        return text.slice(match.index + match[0].length).trim();
      }
    }

    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    const firstCleanSentence = sentences.findIndex(
      (sentence) => !NON_DIEGETIC_PATTERNS.some((p) => p.test(sentence)) && !/^\s*[-*]/.test(sentence),
    );

    return firstCleanSentence >= 0 ? sentences.slice(firstCleanSentence).join(' ') : text;
  }

  private dedupeLoopedText(text: string): string {
    if (!text) return text;

    // Remove repeated assistant self-label if model echoes role.
    const withoutRoleEcho = text
      .replace(/^\s*lonshan'?s portfolio assistant\.?\s*/i, '')
      .replace(/([.!?])(?=[A-Z])/g, '$1 ')
      .trim();

    // De-duplicate repeated sentences while preserving order.
    const sentences = withoutRoleEcho
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const seen = new Set<string>();
    const unique: string[] = [];
    for (const s of sentences) {
      const key = s.toLowerCase().replace(/\s+/g, ' ');
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(s);
    }

    const joined = unique.join(' ').trim();
    return this.trimRepeatedOpening(joined);
  }

  private trimRepeatedOpening(text: string): string {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length < 16) return text;

    const opening = words.slice(0, 8).join(' ').toLowerCase();
    const rest = words.slice(8).join(' ');
    const repeatedAt = rest.toLowerCase().indexOf(opening);
    if (repeatedAt === -1) return text;

    const firstPass = words.slice(0, 8).join(' ') + ' ' + rest.slice(0, repeatedAt).trim();
    return firstPass.trim();
  }

  private getFallback(message: string): string {
    const deterministicAnswer = this.getDeterministicAnswer(message);
    if (deterministicAnswer) return deterministicAnswer;

    const q = message.toLowerCase();
    if (
      q.includes('how many project') ||
      q.includes('how many projects') ||
      q.includes('number of project') ||
      q.includes('project count')
    ) {
      return 'He has 5 highlighted projects in this portfolio: Smart Retail, Pistil, Singbox Manager, QuickFood Merchant & Rider, and QuickFood Rider (Android).';
    }
    if (
      q.includes('earliest job') ||
      q.includes('first job') ||
      q.includes('oldest job') ||
      (q.includes('earliest') && q.includes('work')) ||
      (q.includes('first') && q.includes('experience'))
    ) {
      return 'His earliest listed role is Flutter Developer at EfficientSoft Co., Ltd (Onsite), from January 2023 to August 2023.';
    }
    if (
      q.includes('tell me about him') ||
      q.includes('about him') ||
      q.includes('who is lon') ||
      q.includes('who is he')
    ) {
      return 'Lon Shan is a software engineer with 3+ years in mobile and full-stack development. He builds production-ready systems with Flutter, Next.js, Node.js/NestJS, and Go, and has delivered projects like Smart Retail, Pistil, and QuickFood.';
    }
    if (q.includes('project')) {
      return 'Featured projects include Smart Retail, Pistil, Singbox Manager, and QuickFood Merchant & Rider.';
    }
    if (q.includes('skill') || q.includes('stack') || q.includes('tech')) {
      return 'Core stack includes Flutter, React/Next.js, Node.js/NestJS, Go, Laravel, PostgreSQL/MySQL, and AWS/CI-CD tooling.';
    }
    if (q.includes('contact') || q.includes('email')) {
      return 'You can contact Lon Shan at lonshan3010@gmail.com or via LinkedIn: https://linkedin.com/in/lon-shan-336699db';
    }
    return 'Ask me about Lon Shan\'s projects, skills, work history, or contact info.';
  }

}
