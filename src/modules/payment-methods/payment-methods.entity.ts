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

@Table
export class PaymentMethod extends Model<PaymentMethod> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  provider: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  method_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  brand: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  last4: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  exp_month: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  exp_year: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_default: boolean;
}
