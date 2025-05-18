import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Contract } from '../contract/contract.entity';
import { User } from '../user/user.entity';

@Table
export class Review extends Model<Review> {
  @ForeignKey(() => Contract)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  contract_id: number;
  @BelongsTo(() => Contract)
  contract: Contract;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  reviewer_id: number;
  @BelongsTo(() => User)
  reviewerUser: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  reviewee_id: number;
  @BelongsTo(() => User)
  reviewedUser: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  })
  rating: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  review_text: string;
}
