// Mirrors the backend event enums for use on the frontend

export const SpiritEvents = {
  DIALOGUE: 'spirit:dialogue',
  EMOTION: 'spirit:emotion',
  INTERACTION: 'spirit:interaction',
  STATE_UPDATE: 'spirit:state_update',
  /** §1 Batch mode: request a fresh cache of idle lines from the server. */
  BATCH_REQUEST: 'spirit:batch_request',
  /** §1 Batch mode: server delivers pre-generated idle lines. */
  BATCH_RESPONSE: 'spirit:batch_response',
} as const;

export const WorldEvents = {
  JOIN: 'world:join',
  STATE: 'world:state',
  SECTION_VISIBLE: 'world:section_visible',
  IDLE_TICK: 'world:idle_tick',
} as const;

export const ThemeEvents = {
  CHANGE_REQUEST: 'theme:change_request',
  CHANGED: 'theme:changed',
  COMBINATION: 'theme:combination',
} as const;
