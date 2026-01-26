import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column({ name: '3d_model_url', nullable: true })
  modelUrl: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ default: 0 })
  inventory: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
