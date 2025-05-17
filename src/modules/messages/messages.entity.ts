import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Contract } from '../contract/contract.entity';
import { User } from '../user/user.entity';

@Table
export class Message extends Model<Message> {
  @ForeignKey(() => Contract)
  @Column({ type: DataType.INTEGER, allowNull: false })
  contract_id: number;
  @BelongsTo(() => Contract)
  contract: Contract;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  sender_id: number;
  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  sent_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  read_at: Date;
}
