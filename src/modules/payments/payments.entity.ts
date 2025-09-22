import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  PAYPAL = 'PayPal',
  BANK_TRANSFER = 'Bank Transfer',
  STRIPE = 'Stripe',
}

export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
  CANCELLED = 'Cancelled',
}

export enum RefundStatus {
  NOT_REFUNDED = 'Not Refunded',
  REFUNDED = 'Refunded',
  PARTIALLY_REFUNDED = 'Partially Refunded',
}

@Table
export class Payment extends Model<Payment> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  project_id: number;

  @BelongsTo(() => Project)
  project: Project;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  payer_id: number;

  @BelongsTo(() => User)
  payer: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  payee_id: number;

  @BelongsTo(() => User)
  payee: User;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: false,
  })
  payment_method: PaymentMethod;

  @Default(PaymentStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    allowNull: false,
  })
  payment_status: PaymentStatus;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  payment_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  payment_due_date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  stripe_transaction_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  stripe_payment_method_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  invoice_id: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  commission_fee: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  platform_fee: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  net_amount: number;

  @Default('USD')
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  payment_notes: string;

  @Default(RefundStatus.NOT_REFUNDED)
  @Column({
    type: DataType.ENUM(...Object.values(RefundStatus)),
    allowNull: false,
  })
  refund_status: RefundStatus;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  refund_amount: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_test_mode: boolean;
}
