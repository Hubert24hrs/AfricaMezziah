import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable()
export class AiService {
  private openai: OpenAI;
  private systemPrompt: string;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey:
        this.configService.get<string>('OPENAI_API_KEY') || 'placeholder-key',
    });

    this.systemPrompt = `You are a helpful fashion assistant for Africa Mezziah, a premium African-inspired women's clothing brand.

Your role is to:
1. Help customers find the perfect outfit based on their preferences, occasion, and style
2. Answer questions about products, sizing, materials, and care instructions
3. Provide styling tips and outfit recommendations
4. Assist with placing orders by guiding customers to add items to their cart
5. Handle inquiries about shipping, returns, and policies

Brand values:
- African identity and heritage
- Elegance and modern femininity
- Premium quality and craftsmanship
- Global appeal

Available categories: Dresses, Tops, Traditional Wear, Accessories

Be warm, professional, and knowledgeable. Use occasional African fashion terminology when relevant.
Always maintain the luxury brand tone while being approachable.`;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: this.systemPrompt }, ...messages],
        max_tokens: 500,
        temperature: 0.7,
      });

      return (
        response.choices[0]?.message?.content ||
        "I apologize, I couldn't process that request. Please try again."
      );
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback response when API is unavailable
      return this.getFallbackResponse(
        messages[messages.length - 1]?.content || '',
      );
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('dress') || lowerMessage.includes('gown')) {
      return 'We have a beautiful collection of dresses and gowns! Our Ankara Elegance collection features stunning maxi dresses starting at ₦45,000. Would you like me to show you our bestsellers?';
    }

    if (lowerMessage.includes('size') || lowerMessage.includes('sizing')) {
      return 'We offer sizes from XS to XL. Our sizing guide is available on each product page. For the best fit, I recommend measuring yourself and comparing with our size chart. Would you like help with a specific item?';
    }

    if (lowerMessage.includes('ship') || lowerMessage.includes('delivery')) {
      return 'We offer nationwide delivery within Nigeria (2-5 business days) and international shipping worldwide. Shipping costs are calculated at checkout. Orders over ₦50,000 qualify for free shipping within Lagos!';
    }

    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return 'We accept returns within 7 days of delivery for unworn items in original packaging. Refunds are processed within 5-7 business days. Would you like to initiate a return?';
    }

    if (
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hi') ||
      lowerMessage.includes('hey')
    ) {
      return "Hello and welcome to Africa Mezziah! 🌍✨ I'm here to help you discover beautiful African-inspired fashion. What are you looking for today - a stunning dress, elegant accessories, or perhaps something for a special occasion?";
    }

    return "Thank you for your message! I'm here to help you find the perfect African-inspired fashion pieces. You can browse our Dresses, Tops, Traditional Wear, or Accessories. How may I assist you today?";
  }

  async parseProductFromWhatsApp(
    message: string,
    imageUrl?: string,
  ): Promise<any> {
    // This would integrate with WhatsApp Business API
    // Parse incoming messages to extract product details
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a product data extractor. Extract product information from the following message and return a JSON object with these fields:
            - name: string (product name)
            - description: string (product description)
            - price: number (price in Naira, extract just the number)
            - sizes: string[] (available sizes)
            - colors: string[] (available colors)
            - category: string (one of: Dresses, Tops, Traditional, Accessories)
            - tags: string[] (relevant tags)
            
            If any field cannot be determined, use reasonable defaults or null.
            Return ONLY valid JSON, no additional text.`,
          },
          {
            role: 'user',
            content: `Extract product details from: ${message}${imageUrl ? ` (Image: ${imageUrl})` : ''}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content || '{}';
      return JSON.parse(content);
    } catch (error) {
      console.error('Product parsing error:', error);
      return null;
    }
  }
}
