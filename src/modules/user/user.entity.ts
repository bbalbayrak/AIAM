import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { UserStatus, UserType } from './userType';
import { UserService } from './user.service';
import { Agency } from '../agency/agency.entity';
import { Business } from '../business/business.entity';
import { Review } from '../review/review.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
    allowNull: false,
  })
  userType: UserType;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contactName: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatarUrl: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  bio: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  websiteUrl: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  verified: boolean;
  @Column({
    type: DataType.ENUM,
    values: Object.values(UserStatus),
    allowNull: false,
    defaultValue: UserStatus.USER,
  })
  role: UserStatus;

  @HasMany(() => Agency)
  agencies: Agency[];

  @HasMany(() => Business)
  businesses: Business[];

  @HasMany(() => Review)
  reviews: Review[];
}
