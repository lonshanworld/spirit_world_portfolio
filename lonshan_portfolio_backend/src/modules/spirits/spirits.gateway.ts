import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SpiritsService } from './spirits.service';
import { DialogueService } from '../dialogue/dialogue.service';
import { EmotionService } from '../emotion/emotion.service';
import { WorldContextService } from '../world/world-context.service';
import { SpiritInteractDto, SectionVisibleDto, ThemeChangeRequestDto } from './dto/spirit.dto';
import { IDialogueLine, ElementType } from './interfaces/spirit.interface';
import { WorldEvents, ThemeEvents, SpiritEvents } from '../events/world.events';

// Recruiter check interval — every 45s, check if visitor qualifies
const RECRUITER_CHECK_INTERVAL_MS = 45_000;
// Idle tick range: 25-45 seconds
const IDLE_MIN_MS = 25_000;
const IDLE_MAX_MS = 45_000;

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/world',
})
export class SpiritsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(SpiritsGateway.name);
  private idleTimer: NodeJS.Timeout | null = null;
  private recruiterTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly spiritsService: SpiritsService,
    private readonly dialogueService: DialogueService,
    private readonly emotionService: EmotionService,
    private readonly worldContextService: WorldContextService,
  ) {}

  afterInit(): void {
    this.logger.log('SpiritsGateway initialized — AI dialogue system active');
    this.scheduleIdleTick();
    this.scheduleRecruiterCheck();
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    this.worldContextService.resetSession();

    // Send current world state to new client
    client.emit(WorldEvents.STATE, {
      spirits: this.spiritsService.getAllStates(),
    });

    // AI-generated greeting after a short delay
    setTimeout(async () => {
      await this.dialogueService.generateGreeting((line) =>
        this.emitDialogueLine(line),
      );
    }, 2500);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ── Client → Server handlers ───────────────────────────────────

  /** Spirit orb was tapped/clicked by the visitor */
  @SubscribeMessage(SpiritEvents.INTERACTION)
  async handleSpiritInteract(
    @MessageBody() data: SpiritInteractDto,
    @ConnectedSocket() _client: Socket,
  ): Promise<void> {
    await this.dialogueService.generateSpiritClickResponse(
      data.spiritId,
      (line) => this.emitDialogueLine(line),
    );

    // Emit updated emotion state to all clients
    this.emitEmotionUpdate(data.spiritId);
  }

  /** A portfolio section scrolled into view */
  @SubscribeMessage(WorldEvents.SECTION_VISIBLE)
  async handleSectionVisible(
    @MessageBody() data: SectionVisibleDto,
    @ConnectedSocket() _client: Socket,
  ): Promise<void> {
    await this.dialogueService.generateSectionDialogue(
      data.section,
      (line) => this.emitDialogueLine(line),
    );
  }

  /** Two spirits were combined by the visitor */
  @SubscribeMessage(ThemeEvents.COMBINATION)
  async handleCombination(
    @MessageBody() data: { hybridId: string; elementA: ElementType; elementB: ElementType },
    @ConnectedSocket() _client: Socket,
  ): Promise<void> {
    const elementA = data.elementA ?? 'fire';
    const elementB = data.elementB ?? 'water';
    await this.dialogueService.generateCombinationResponse(
      elementA,
      elementB,
      data.hybridId,
      (line) => this.emitDialogueLine(line),
    );
    this.emitEmotionUpdate(elementA);
    this.emitEmotionUpdate(elementB);
  }

  /** Theme changed (spirit click) */
  @SubscribeMessage(ThemeEvents.CHANGE_REQUEST)
  async handleThemeChange(
    @MessageBody() data: ThemeChangeRequestDto,
    @ConnectedSocket() _client: Socket,
  ): Promise<void> {
    await this.dialogueService.generateThemeChangeReaction(
      data.elementId,
      (line) => this.emitDialogueLine(line),
    );
    this.emitEmotionUpdate(data.elementId);
  }

  // ── Internal helpers ───────────────────────────────────────────

  private emitDialogueLine(line: IDialogueLine): void {
    this.spiritsService.setSpeaking(line.spiritId, true);
    if (line.emotion) {
      this.spiritsService.setEmotion(line.spiritId, line.emotion);
    }
    this.server.emit(SpiritEvents.DIALOGUE, line);

    // Auto-clear speaking flag after estimated reading time
    const readMs = line.text.length * 60 + 1500;
    setTimeout(
      () => this.spiritsService.setSpeaking(line.spiritId, false),
      readMs,
    );
  }

  /** Broadcast updated emotion for a spirit to all clients */
  private emitEmotionUpdate(spiritId: ElementType): void {
    const emotion = this.emotionService.get(spiritId);
    this.server.emit(SpiritEvents.EMOTION, { spiritId, emotion });
  }

  /** Idle tick — AI conversation between two random spirits */
  private scheduleIdleTick(): void {
    const interval = IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS);
    this.idleTimer = setTimeout(async () => {
      if ((this.server?.sockets?.sockets?.size ?? 0) > 0) {
        await this.dialogueService.generateIdleConversation((line) =>
          this.emitDialogueLine(line),
        );
      }
      this.scheduleIdleTick();
    }, interval);
  }

  /** Recruiter mode check — fires if visitor is deeply exploring */
  private scheduleRecruiterCheck(): void {
    this.recruiterTimer = setInterval(async () => {
      if ((this.server?.sockets?.sockets?.size ?? 0) === 0) return;
      // WorldContextService determines isRecruiterLikely internally
      const ctx = this.worldContextService.buildContext({
        trigger: 'recruiter_mode',
        nearbySpirits: [],
        recentHistory: [],
      });
      if (ctx.isRecruiterLikely) {
        await this.dialogueService.generateRecruiterDialogue((line) =>
          this.emitDialogueLine(line),
        );
      }
    }, RECRUITER_CHECK_INTERVAL_MS);
  }
}
