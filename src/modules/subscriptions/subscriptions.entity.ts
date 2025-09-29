import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Prices } from '../prices/prices.entity';

export enum SubscriptionStatus {
  TRIALING = 'trialing',
  ACTIVE = 'active',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  PAUSED = 'paused',
}

export enum PlanType {
  BASIC = 'basic',
  PRO = 'pro',
}

@Table
export class Subscriptions extends Model<Subscriptions> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  providerSubscriptionId: string; // Stripe subscription ID

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.ENUM(...Object.values(PlanType)),
    allowNull: false,
  })
  planType: PlanType;

  @Column({
    type: DataType.ENUM(...Object.values(SubscriptionStatus)),
    allowNull: true,
  })
  status: SubscriptionStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  quantity: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  priceId: string;

  @ForeignKey(() => Prices)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;
  @BelongsTo(() => Prices)
  prices: Prices;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  cancelAtPeriodEnd: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  currentPeriodStart: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  currentPeriodEnd: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  cancelAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  canceledAt: Date;
}
