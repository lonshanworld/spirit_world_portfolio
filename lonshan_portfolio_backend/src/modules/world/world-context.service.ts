/**
 * world-context.service.ts
 * Tracks live world state: active theme, section, session, viewed projects.
 * This context is assembled before every AI generation call.
 */
import { Injectable } from '@nestjs/common';
import { WorldContext, TriggerType } from './world-context.interface';
import { SpiritContextEntry, RecentHistoryLine } from './world-context.interface';

const RECRUITER_SESSION_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes
const RECRUITER_PROJECTS_THRESHOLD = 2;

@Injectable()
export class WorldContextService {
  private activeTheme = 'void';
  private activeSection = 'hero';
  private sessionStart = Date.now();
  private viewedProjects: string[] = [];

  // ── Setters called by the gateway ───────────────────────────────

  setTheme(theme: string): void {
    this.activeTheme = theme;
  }

  setSection(section: string): void {
    this.activeSection = section;
    if (section === 'projects') {
      this.addViewedProject('projects');
    }
  }

  addViewedProject(project: string): void {
    if (!this.viewedProjects.includes(project)) {
      this.viewedProjects.push(project);
    }
  }

  resetSession(): void {
    this.sessionStart = Date.now();
    this.viewedProjects = [];
  }

  // ── Context snapshot ─────────────────────────────────────────────

  buildContext(params: {
    trigger: TriggerType;
    nearbySpirits: SpiritContextEntry[];
    recentHistory: RecentHistoryLine[];
    triggerDetail?: string;
    hybridId?: string;
  }): WorldContext {
    const sessionSeconds = Math.floor((Date.now() - this.sessionStart) / 1000);
    const isRecruiterLikely =
      sessionSeconds * 1000 >= RECRUITER_SESSION_THRESHOLD_MS &&
      this.viewedProjects.length >= RECRUITER_PROJECTS_THRESHOLD;

    return {
      activeTheme: this.activeTheme,
      activeSection: this.activeSection,
      nearbySpirits: params.nearbySpirits,
      recentHistory: params.recentHistory,
      sessionSeconds,
      isRecruiterLikely,
      viewedProjects: [...this.viewedProjects],
      trigger: params.trigger,
      triggerDetail: params.triggerDetail,
      hybridId: params.hybridId,
    };
  }
}
