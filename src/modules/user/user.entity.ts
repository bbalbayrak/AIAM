import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserType } from './userType';

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
    allowNull: false,
  })
  contactName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  avatarUrl: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  bio: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  websiteUrl: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  verified: boolean;
}
