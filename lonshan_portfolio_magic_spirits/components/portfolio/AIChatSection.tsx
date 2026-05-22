'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { EXPERIENCES, PERSONAL_INFO, PROJECTS, SKILLS } from '../../data/portfolio_data';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const QUICK_PROMPTS = [
  'Summarize your top projects',
  'What is your latest work experience?',
  'What skills do you use most?',
  'How can I contact you?',
];

function buildAssistantReply(input: string): string {
  const q = input.toLowerCase();

  if (q.includes('email') || q.includes('contact')) {
    return `You can reach ${PERSONAL_INFO.name} at ${PERSONAL_INFO.email} or via LinkedIn: ${PERSONAL_INFO.linkedin}`;
  }

  if (q.includes('phone')) {
    return `Phone: ${PERSONAL_INFO.phone}`;
  }

  if (q.includes('experience') || q.includes('work history')) {
    const latest = EXPERIENCES[0];
    return `${PERSONAL_INFO.name} has 3+ years of experience. Most recent role: ${latest.role} at ${latest.company} (${latest.period}).`;
  }

  if (q.includes('skill') || q.includes('stack') || q.includes('tech')) {
    const top = SKILLS.map((g) => `${g.label}: ${g.skills.slice(0, 3).map((s) => s.name).join(', ')}`).join(' | ');
    return `Core stack: ${top}`;
  }

  if (q.includes('project')) {
    const p = PROJECTS.slice(0, 3).map((x) => x.title).join(', ');
    return `Featured projects include ${p}. Ask for a specific project and I can summarize it.`;
  }

  if (q.includes('location') || q.includes('based')) {
    return `${PERSONAL_INFO.name} is based in ${PERSONAL_INFO.location}.`;
  }

  return `${PERSONAL_INFO.name} is a ${PERSONAL_INFO.title} with 3+ years in mobile and full-stack delivery. Ask me about projects, experience, skills, or contact details.`;
}

export function AIChatSection() {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `System online. Ask about ${PERSONAL_INFO.displayName}'s projects, skills, work history, or contact info.`,
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const sendMessage = async (text: string) => {
    if (!text) return;
    setInput('');
    setIsSending(true);

    const history = [...messages];
    setMessages((prev) => [...prev, { role: 'user', text }]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      if (!res.ok) throw new Error(`Chat request failed with ${res.status}`);
      const data = (await res.json()) as { reply?: string };
      const reply = (data.reply ?? '').trim() || buildAssistantReply(text);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: buildAssistantReply(text) }]);
    } finally {
      setIsSending(false);
    }
  };

  const send = async () => {
    await sendMessage(input.trim());
  };

  return (
    <section id="astral-terminal" className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden" aria-label="AI assistant">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.28em] sm:tracking-[0.5em] uppercase mb-3" style={{ color: config?.accentColor }}>
            AI Interface
          </p>
          <h2 className="text-3xl sm:text-4xl font-black" style={{ color: config?.textColor }}>
            Portfolio Assistant
          </h2>

          <p className="mt-3 text-sm" style={{ color: config?.subtextColor, opacity: 0.9 }}>
            Ask anything about projects, skills, work history, or contact details.
          </p>
        </motion.div>

        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              disabled={isSending}
              className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                borderColor: `${config?.primaryColor}55`,
                color: config?.primaryColor,
                background: `${config?.primaryColor}14`,
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div
          className="rounded-2xl border p-3 sm:p-4 md:p-6 overflow-hidden"
          style={{ background: config?.cardBg, borderColor: config?.cardBorder }}
        >
          <div className="h-72 sm:h-80 overflow-y-auto pr-1 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex min-w-0 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[92%] sm:max-w-[85%] min-w-0 rounded-xl px-3 py-2 text-sm leading-relaxed break-words"
                  style={{
                    background: m.role === 'user' ? `${config?.primaryColor}22` : `${config?.accentColor}1A`,
                    color: config?.textColor,
                    border: `1px solid ${m.role === 'user' ? `${config?.primaryColor}44` : `${config?.accentColor}33`}`,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              placeholder="Ask about projects, skills, or contact..."
              className="flex-1 rounded-lg px-3 py-2 text-sm bg-black/20 border outline-none"
              style={{ borderColor: config?.cardBorder, color: config?.textColor }}
              disabled={isSending}
            />
            <button
              onClick={send}
              disabled={!canSend}
              className="rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-50 w-full sm:w-auto"
              style={{
                background: `linear-gradient(135deg, ${config?.primaryColor}, ${config?.accentColor})`,
                color: '#000',
              }}
            >
              {isSending ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
