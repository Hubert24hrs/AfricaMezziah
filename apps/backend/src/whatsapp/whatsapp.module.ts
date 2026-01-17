import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { AiModule } from '../ai/ai.module';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [AiModule, ProductsModule],
    controllers: [WhatsappController],
})
export class WhatsappModule { }
