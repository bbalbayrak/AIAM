import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Products } from '../products/products.entity';

export enum PricingType {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
}

export enum PricingPlanInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum PlanType {
  BASIC = 'basic',
  PRO = 'pro',
}

@Table
export class Prices extends Model<Prices> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  priceId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @ForeignKey(() => Products)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product: number;

  @BelongsTo(() => Products)
  products: Products;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  unitAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.ENUM(...Object.values(PricingType)),
    allowNull: false,
  })
  pricingType: PricingType;

  @Column({
    type: DataType.ENUM(...Object.values(PricingPlanInterval)),
    allowNull: true,
  })
  pricingPlanInterval: PricingPlanInterval;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  intervalCount: number;

  @Column({
    type: DataType.ENUM(...Object.values(PlanType)),
    allowNull: false,
  })
  type: PlanType;

  //   @HasMany(() => Subscription)
  //   subscriptions: Subscription[];
}
