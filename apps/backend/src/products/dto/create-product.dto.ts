export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  images: string[];
  modelUrl?: string;
  tags: string[];
  inventory: number;
}
