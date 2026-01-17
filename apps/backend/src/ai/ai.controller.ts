import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

interface ChatMessageDto {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatRequestDto {
    messages: ChatMessageDto[];
}

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('chat')
    async chat(@Body() body: ChatRequestDto) {
        const response = await this.aiService.chat(body.messages);
        return { response };
    }

    @Post('parse-product')
    async parseProduct(@Body() body: { message: string; imageUrl?: string }) {
        const product = await this.aiService.parseProductFromWhatsApp(body.message, body.imageUrl);
        return { product };
    }
}
