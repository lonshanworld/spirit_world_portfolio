/**
 * database.service.ts
 * Thin wrapper around a pg Pool.
 * Exposes a typed query() helper and creates required tables on startup.
 *
 * RAM footprint: pg Pool keeps at most `max` idle connections open.
 * With max=2 the driver uses ~2 MB — far less than an in-memory JS array
 * growing without bound.
 */
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  async onModuleInit(): Promise<void> {
    const url = process.env.DATABASE_URL;
    if (!url || url.includes('user:password')) {
      this.logger.warn(
        'DATABASE_URL not configured — dialogue history will be lost on restart.',
      );
      return;
    }

    // Strip sslmode from the URL so pg doesn't interpret it as verify-full
    // (newer pg versions treat sslmode=require as an alias for verify-full).
    // We pass ssl: { rejectUnauthorized: false } explicitly instead, which is
    // correct for Aiven's self-signed certificate chain.
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.delete('sslmode');
    const cleanUrl = parsedUrl.toString();

    this.pool = new Pool({
      connectionString: cleanUrl,
      max: 2,            // keep only 2 idle connections — minimal RAM
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: { rejectUnauthorized: false },
    });

    this.pool.on('error', (err) => {
      this.logger.error('Unexpected pg Pool error', err);
    });

    await this.ensureSchema();
    this.logger.log('PostgreSQL connected — dialogue history enabled');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) await this.pool.end();
  }

  // ── Public query helper ──────────────────────────────────────────

  /** Returns null if the DB is not configured (graceful degradation). */
  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: unknown[],
  ): Promise<QueryResult<T> | null> {
    if (!this.pool) return null;
    try {
      return await this.pool.query<T>(sql, params);
    } catch (err) {
      this.logger.error(`DB query error: ${sql}`, err);
      return null;
    }
  }

  get isReady(): boolean {
    return !!this.pool;
  }

  // ── Schema bootstrap ─────────────────────────────────────────────

  private async ensureSchema(): Promise<void> {
    // ── dialogue_history ───────────────────────────────────────────
    // Stores every line spoken (by spirit or visitor). Ring-buffered to
    // GLOBAL_MAX rows by MemoryService after each insert.
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS dialogue_history (
        id           BIGSERIAL    PRIMARY KEY,
        spirit_id    TEXT         NOT NULL,
        speaker_name TEXT         NOT NULL,
        text         TEXT         NOT NULL,
        created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_dh_spirit_id  ON dialogue_history (spirit_id);
      CREATE INDEX IF NOT EXISTS idx_dh_created_at ON dialogue_history (created_at DESC);
    `);

    // ── visitor_sessions ───────────────────────────────────────────
    // One row per browser session.  session_id is a UUID generated
    // client-side and sent on the first socket connection.
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS visitor_sessions (
        id           BIGSERIAL    PRIMARY KEY,
        session_id   TEXT         NOT NULL UNIQUE,
        started_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        last_seen_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        page_views   INT          NOT NULL DEFAULT 1
      );
      CREATE INDEX IF NOT EXISTS idx_vs_session_id ON visitor_sessions (session_id);
    `);

    // ── spirit_interactions ────────────────────────────────────────
    // Every tap / hover / combination click a visitor makes.
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS spirit_interactions (
        id           BIGSERIAL    PRIMARY KEY,
        session_id   TEXT         NOT NULL,
        spirit_id    TEXT         NOT NULL,
        action       TEXT         NOT NULL,  -- 'tap' | 'hover' | 'combination'
        partner_id   TEXT,                   -- second spirit for combinations
        hybrid_id    TEXT,                   -- resulting hybrid theme
        created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_si_spirit_id  ON spirit_interactions (spirit_id);
      CREATE INDEX IF NOT EXISTS idx_si_session_id ON spirit_interactions (session_id);
      CREATE INDEX IF NOT EXISTS idx_si_created_at ON spirit_interactions (created_at DESC);
    `);

    // ── emotion_log ────────────────────────────────────────────────
    // Tracks every emotion transition — useful for analytics and
    // replaying "how lively was the session" in future features.
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS emotion_log (
        id           BIGSERIAL    PRIMARY KEY,
        spirit_id    TEXT         NOT NULL,
        emotion      TEXT         NOT NULL,
        trigger      TEXT,                   -- 'speaking' | 'tap' | 'idle' | 'proximity'
        created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_el_spirit_id  ON emotion_log (spirit_id);
      CREATE INDEX IF NOT EXISTS idx_el_created_at ON emotion_log (created_at DESC);
    `);

    // ── theme_history ──────────────────────────────────────────────
    // Records every theme change — which element/hybrid was activated
    // and by which session (for analytics).
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS theme_history (
        id           BIGSERIAL    PRIMARY KEY,
        session_id   TEXT,
        theme        TEXT         NOT NULL,
        triggered_by TEXT,                   -- 'tap' | 'combination' | 'auto'
        created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_th_theme      ON theme_history (theme);
      CREATE INDEX IF NOT EXISTS idx_th_created_at ON theme_history (created_at DESC);
    `);

    this.logger.log('Schema ready (5 tables verified / created)');
  }

  // ── Connection probe ─────────────────────────────────────────────

  /** Returns basic DB info for the /api/health endpoint. */
  async probe(): Promise<{ ok: boolean; serverVersion?: string; tablesReady?: string[] }> {
    if (!this.pool) return { ok: false };
    try {
      const ver = await this.pool.query<{ version: string }>('SELECT version()');
      const tbls = await this.pool.query<{ tablename: string }>(
        `SELECT tablename FROM pg_tables
         WHERE schemaname = 'public'
         ORDER BY tablename`,
      );
      return {
        ok: true,
        serverVersion: ver.rows[0]?.version?.split(' ').slice(0, 2).join(' '),
        tablesReady: tbls.rows.map((r) => r.tablename),
      };
    } catch (err) {
      this.logger.error('DB probe failed', err);
      return { ok: false };
    }
  }
}
