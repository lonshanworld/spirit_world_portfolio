export enum SpiritEvents {
  DIALOGUE = 'spirit:dialogue',
  EMOTION = 'spirit:emotion',
  INTERACTION = 'spirit:interaction',
  STATE_UPDATE = 'spirit:state_update',
}

export enum WorldEvents {
  JOIN = 'world:join',
  STATE = 'world:state',
  SECTION_VISIBLE = 'world:section_visible',
  IDLE_TICK = 'world:idle_tick',
}

export enum ThemeEvents {
  CHANGE_REQUEST = 'theme:change_request',
  CHANGED = 'theme:changed',
  COMBINATION = 'theme:combination',
}

export enum DialogueEvents {
  TRIGGER = 'dialogue:trigger',
  LINE = 'dialogue:line',
  SEQUENCE_END = 'dialogue:sequence_end',
}
