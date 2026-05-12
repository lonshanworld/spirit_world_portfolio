# Architecture Reference — Magic Portfolio Fullstack System

## Module Dependency Map

```
lonshan_portfolio_backend/src/modules/
  spirits/          ← Spirit entity management, AI personality, movement
  dialogue/         ← Dialogue generation, conversation state
  magic/            ← Magic system, spell definitions, effect triggers
  combat/           ← Combat orchestration, damage, cooldowns
  world/            ← World state, environment, scene management
  themes/           ← Dynamic theme transitions, color palette systems
  events/           ← Global event bus, cross-module event definitions
  ai/               ← LLM integration, reasoning engine, prompt management
  realtime/         ← Socket.IO gateway coordination, room management
  memory/           ← Context memory, relationship graphs, history
```

## AI System Pattern

```
AI Module
  AiService         → wraps LLM calls, prompt construction
  PersonalityService → manages trait definitions, emotion state machines
  MemoryService     → stores conversation context, relationship scores
  
Spirit Module
  SpiritService     → orchestrates personality + memory + AI
  SpiritGateway     → emits spirit events to frontend via WebSocket
```

## WebSocket Event Catalogue Template

Define all events in `/src/modules/events/<domain>.events.ts`:

```typescript
export enum SpiritEvents {
  MOVED         = 'spirit:moved',
  DIALOGUE      = 'spirit:dialogue',
  EMOTION       = 'spirit:emotion-changed',
  RELATIONSHIP  = 'spirit:relationship-updated',
}

export enum WorldEvents {
  EVENT_TRIGGERED = 'world:event-triggered',
  THEME_CHANGED   = 'world:theme-changed',
  SCENE_LOADED    = 'world:scene-loaded',
}

export enum CombatEvents {
  ATTACK  = 'combat:attack',
  DEFEND  = 'combat:defend',
  RESULT  = 'combat:result',
}

export enum MagicEvents {
  CAST    = 'magic:cast',
  IMPACT  = 'magic:impact',
  FIZZLE  = 'magic:fizzle',
}
```

## Performance Optimization Checklist

### Frontend
- [ ] 3D components use `<Suspense>` + `lazy()` for code-splitting
- [ ] R3F scenes use `useFrame` throttling (skip frames on low FPS)
- [ ] Particle systems use instanced meshes (`InstancedMesh`)
- [ ] Framer Motion variants defined outside components (stable references)
- [ ] Zustand selectors use shallow equality (`useShallow`)
- [ ] WebSocket listeners cleaned up on component unmount
- [ ] Images use `next/image` with proper sizing

### Backend
- [ ] WebSocket emissions throttled (never emit on synchronous loops)
- [ ] AI calls debounced — prevent concurrent LLM requests per spirit
- [ ] Memory/context stored in Redis or persistent store (not in-memory only)
- [ ] Event handlers are async-safe (no blocking in gateway handlers)
- [ ] DTOs validated at every entry point (`ValidationPipe` globally registered)

## Frontend ↔ Backend Communication Patterns

### REST (one-time data fetch)
```typescript
// Frontend hook
const useSpirit = (id: string) => {
  return useQuery(['spirit', id], () => fetch(`/api/spirits/${id}`).then(r => r.json()))
}
```

### WebSocket (realtime stream)
```typescript
// Frontend hook
const useSpiritRealtime = () => {
  const socket = useSocket() // shared socket instance from Zustand or context
  useEffect(() => {
    socket.on('spirit:emotion-changed', handler)
    return () => socket.off('spirit:emotion-changed', handler)
  }, [socket])
}
```

### NestJS Gateway pattern
```typescript
@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL } })
export class SpiritGateway {
  @WebSocketServer() server: Server

  emitEmotionChange(spiritId: string, emotion: EmotionState) {
    this.server.emit('spirit:emotion-changed', { spiritId, emotion })
  }

  @SubscribeMessage('spirit:interact')
  async handleInteract(@MessageBody() data: InteractDto, @ConnectedSocket() client: Socket) {
    // delegate to service — never put logic here
    return this.spiritService.handleInteraction(data)
  }
}
```
