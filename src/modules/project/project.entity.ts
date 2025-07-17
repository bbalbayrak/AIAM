import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProjectStatus } from './status.enum';
import { Business } from '../business/business.entity';
import { Proposal } from '../proposal/proposal.entity';
@Table
export class Project extends Model<Project> {
  @ForeignKey(() => Business)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  business_id: number;
  @BelongsTo(() => Business)
  business: Business;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  budget_range: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  estimated_hours: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  timeline: string;
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  expertise_required: Record<string, any>;
  @Column({
    type: DataType.ENUM,
    values: Object.values(ProjectStatus),
    allowNull: false,
    defaultValue: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deadline: Date;

  @HasMany(() => Proposal)
  proposals: Proposal[];
}
