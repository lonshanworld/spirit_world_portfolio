/**
 * memory.service.ts
 * Conversation history backed by PostgreSQL only.
 *
 * If DATABASE_URL is unavailable or DB queries fail, history persistence
 * is skipped gracefully and empty history is returned.
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

  constructor(private readonly db: DatabaseService) {}

  // ── Write ────────────────────────────────────────────────────────

  async addLine(spiritId: ElementType, speakerName: string, text: string): Promise<void> {
    if (this.db.isReady) {
      const inserted = await this.db.query(
        `INSERT INTO dialogue_history (spirit_id, speaker_name, text)
         VALUES ($1, $2, $3)`,
        [spiritId, speakerName, text],
      );
      if (!inserted) {
        return;
      }

      // Prune global ring: keep only the last GLOBAL_MAX rows
      const pruned = await this.db.query(
        `DELETE FROM dialogue_history
         WHERE id NOT IN (
           SELECT id FROM dialogue_history ORDER BY id DESC LIMIT $1
         )`,
        [GLOBAL_MAX],
      );
      if (!pruned) return;
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
    return [];
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
    return [];
  }

  /** Called on new session — clears DB history for this visitor's session */
  async clear(): Promise<void> {
    if (this.db.isReady) {
      await this.db.query(`DELETE FROM dialogue_history`);
    }
  }
}

