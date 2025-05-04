import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';

@Table
export class Agency extends Model<Agency> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  expertise_tags: Record<string, any>;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  hourly_rate: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  min_project_size: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  team_size: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  years_experience: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  portfolio_urls: Record<string, any>;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  client_references: Record<string, any>;

  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  rating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  projects_completed: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  languages_spoken: Record<string, any>;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  certifications: Record<string, any>;
}
