import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Contract } from '../contract/contract.entity';

export enum MilestoneStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected',
}

@Table
export class Milestone extends Model<Milestone> {
  @ForeignKey(() => Contract)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  contract_id: number;
  @BelongsTo(() => Contract)
  contract: Contract;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  due_date: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  amount: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(MilestoneStatus),
    allowNull: false,
    defaultValue: MilestoneStatus.PENDING,
  })
  status: MilestoneStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completed_at: Date;
}
