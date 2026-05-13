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

  constructor(
    private readonly spiritsService: SpiritsService,
    private readonly dialogueService: DialogueService,
    private readonly emotionService: EmotionService,
    private readonly worldContextService: WorldContextService,
  ) {}

  afterInit(): void {
    this.logger.log('SpiritsGateway initialized — batch dialogue mode active');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    this.worldContextService.resetSession();

    client.emit(WorldEvents.STATE, {
      spirits: this.spiritsService.getAllStates(),
    });

    // §1 Batch mode: greeting + pre-generated idle cache — sent to this client only
    this.initClientDialogue(client).catch((err) =>
      this.logger.error('initClientDialogue error', err),
    );
  }

  /** §1 Send greeting then a batch of cached idle lines to the newly connected client. */
  private async initClientDialogue(client: Socket): Promise<void> {
    await new Promise<void>((r) => setTimeout(r, 2500));
    if (!client.connected) return;
    await this.dialogueService.generateGreeting((line) => this.emitDialogueLine(line));
    const batch = await this.dialogueService.generateBatch(10);
    if (client.connected) client.emit(SpiritEvents.BATCH_RESPONSE, batch);
  }

  /** §1 Client requests a fresh batch when its local cache runs low. */
  @SubscribeMessage(SpiritEvents.BATCH_REQUEST)
  async handleBatchRequest(@ConnectedSocket() client: Socket): Promise<void> {
    const lines = await this.dialogueService.generateBatch(8);
    client.emit(SpiritEvents.BATCH_RESPONSE, lines);
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

    // Auto-clear speaking flag using word-count duration (matches frontend queue)
    const words = line.text.trim().split(/\s+/).filter(Boolean).length;
    const readMs = Math.max(1000, words * 800) + 600;
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
}
