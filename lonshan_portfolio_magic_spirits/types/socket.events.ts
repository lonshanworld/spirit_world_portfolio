// Mirrors the backend event enums for use on the frontend

export const SpiritEvents = {
  DIALOGUE: 'spirit:dialogue',
  EMOTION: 'spirit:emotion',
  INTERACTION: 'spirit:interaction',
  STATE_UPDATE: 'spirit:state_update',
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
