import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ProductsService } from '../products/products.service';

@Controller('webhook/whatsapp')
export class WhatsappController {
  constructor(
    private readonly aiService: AiService,
    private readonly productsService: ProductsService,
  ) {}

  // WhatsApp webhook verification (required by Meta)
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const VERIFY_TOKEN =
      process.env.WHATSAPP_VERIFY_TOKEN || 'africa-mezziah-verify';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WhatsApp webhook verified');
      return challenge;
    }
    return 'Verification failed';
  }

  // Handle incoming WhatsApp messages
  @Post()
  async handleMessage(@Body() body: any) {
    try {
      // Extract message from WhatsApp webhook payload
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (!message) {
        return { status: 'no message' };
      }

      const messageText = message.text?.body || '';
      const imageUrl = message.image?.url || undefined;
      const senderPhone = message.from;

      console.log(
        `Received WhatsApp message from ${senderPhone}: ${messageText}`,
      );

      // Use AI to parse product details from message
      const productData = await this.aiService.parseProductFromWhatsApp(
        messageText,
        imageUrl,
      );

      if (productData) {
        // Create product in database
        const newProduct = await this.productsService.create({
          name: productData.name || 'Unnamed Product',
          description: productData.description || '',
          price: productData.price || 0,
          images: imageUrl ? [imageUrl] : [],
          tags: productData.tags || [],
          inventory: 10, // Default stock
        });

        console.log('Product created:', newProduct);

        // TODO: Send confirmation back to WhatsApp
        // This would require WhatsApp Business API integration
        return {
          status: 'success',
          message: 'Product created',
          productId: newProduct.id,
        };
      }

      return { status: 'parsed', data: productData };
    } catch (error) {
      console.error('WhatsApp webhook error:', error);
      return { status: 'error', message: error.message };
    }
  }
}
