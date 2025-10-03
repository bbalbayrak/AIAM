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
import { Subscriptions } from '../subscriptions/subscriptions.entity';

export enum InvoiceStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PAID = 'paid',
  UNCOLLECTIBLE = 'uncollectible',
  VOID = 'void',
}

@Table
export class Invoices extends Model<Invoices> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  invoiceId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Subscriptions)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  subscriptionId: number;

  @BelongsTo(() => Subscriptions)
  subscription: Subscriptions;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amountDue: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;

  @Default(InvoiceStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(InvoiceStatus)),
    allowNull: false,
  })
  status: InvoiceStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  paidAt: Date;
}
