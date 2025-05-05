import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { CompanySize } from './companySize.enum';

@Table
export class Business extends Model<Business> {
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
    allowNull: true,
  })
  industry: string;
  @Column({
    type: DataType.ENUM,
    values: Object.values(CompanySize),
    allowNull: false,
  })
  company_size: CompanySize;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  annual_revenue_range: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  previous_ai_experience: string;
}
