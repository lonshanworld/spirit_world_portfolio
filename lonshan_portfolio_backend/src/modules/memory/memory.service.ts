/**
 * memory.service.ts
 * Persistent conversation history backed by PostgreSQL.
 *
 * When DATABASE_URL is configured: all lines are written to the
 * dialogue_history table (created automatically on startup).
 * Rows beyond the ring-buffer limits are pruned after each insert
 * so the table never grows unboundedly.
 *
 * When DATABASE_URL is NOT configured: falls back to a tiny in-memory
 * ring buffer so the system still works during local development without
 * a database.
 *
 * RAM cost when using PostgreSQL: essentially zero — no JS arrays kept in RAM.
 */
import { Injectable, Logger } from '@nestjs/common';
import { ElementType } from '../spirits/interfaces/spirit.interface';
import { RecentHistoryLine } from '../world/world-context.interface';
import { DatabaseService } from '../database/database.service';

// Ring-buffer limits kept in the DB
const GLOBAL_MAX = 20;
const PER_SPIRIT_MAX = 5;

@Injectable()
export class MemoryService {
  private readonly logger = new Logger(MemoryService.name);

  // Tiny in-memory fallback used only when DB is unavailable
  private fallbackGlobal: RecentHistoryLine[] = [];
  private fallbackSpirit = new Map<ElementType, string[]>();

  constructor(private readonly db: DatabaseService) {}

  // ── Write ────────────────────────────────────────────────────────

  async addLine(spiritId: ElementType, speakerName: string, text: string): Promise<void> {
    if (this.db.isReady) {
      await this.db.query(
        `INSERT INTO dialogue_history (spirit_id, speaker_name, text)
         VALUES ($1, $2, $3)`,
        [spiritId, speakerName, text],
      );

      // Prune global ring: keep only the last GLOBAL_MAX rows
      await this.db.query(
        `DELETE FROM dialogue_history
         WHERE id NOT IN (
           SELECT id FROM dialogue_history ORDER BY id DESC LIMIT $1
         )`,
        [GLOBAL_MAX],
      );
    } else {
      // Fallback: plain in-memory ring
      this.fallbackGlobal.push({ speakerName, text });
      if (this.fallbackGlobal.length > GLOBAL_MAX) this.fallbackGlobal.shift();

      const perSpirit = this.fallbackSpirit.get(spiritId) ?? [];
      perSpirit.push(text);
      if (perSpirit.length > PER_SPIRIT_MAX) perSpirit.shift();
      this.fallbackSpirit.set(spiritId, perSpirit);
    }
  }

  // ── Read ─────────────────────────────────────────────────────────

  /** Last N global lines for overall conversation context */
  async getGlobalHistory(n = 8): Promise<RecentHistoryLine[]> {
    if (this.db.isReady) {
      const result = await this.db.query<{ speaker_name: string; text: string }>(
        `SELECT speaker_name, text
         FROM dialogue_history
         ORDER BY id DESC
         LIMIT $1`,
        [n],
      );
      if (!result) return [];
      // Reverse so oldest comes first (chronological order for Gemini prompt)
      return result.rows.reverse().map((r) => ({
        speakerName: r.speaker_name,
        text: r.text,
      }));
    }
    return this.fallbackGlobal.slice(-n);
  }

  /** Last lines spoken by a specific spirit (for de-duplication) */
  async getSpiritHistory(spiritId: ElementType): Promise<string[]> {
    if (this.db.isReady) {
      const result = await this.db.query<{ text: string }>(
        `SELECT text
         FROM dialogue_history
         WHERE spirit_id = $1
         ORDER BY id DESC
         LIMIT $2`,
        [spiritId, PER_SPIRIT_MAX],
      );
      if (!result) return [];
      return result.rows.map((r) => r.text);
    }
    return this.fallbackSpirit.get(spiritId) ?? [];
  }

  /** Called on new session — clears DB history for this visitor's session */
  async clear(): Promise<void> {
    if (this.db.isReady) {
      await this.db.query(`DELETE FROM dialogue_history`);
    } else {
      this.fallbackGlobal = [];
      this.fallbackSpirit.clear();
    }
  }
}

