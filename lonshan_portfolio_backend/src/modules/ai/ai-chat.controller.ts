import { Body, Controller, Post } from '@nestjs/common';
import { AIChatService, ChatTurn } from './ai-chat.service';

interface ChatRequestBody {
  message?: string;
  history?: ChatTurn[];
}

@Controller('api/ai')
export class AIChatController {
  constructor(private readonly aiChatService: AIChatService) {}

  @Post('chat')
  async chat(@Body() body: ChatRequestBody) {
    const message = (body?.message ?? '').trim();
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return { reply: 'Please type a message first.' };
    }

    const safeHistory = history
      .filter((t) => t && (t.role === 'user' || t.role === 'assistant') && typeof t.text === 'string')
      .map((t) => ({ role: t.role, text: t.text.slice(0, 600) }));

    const reply = await this.aiChatService.chat(message.slice(0, 800), safeHistory);
    return { reply };
  }
}
