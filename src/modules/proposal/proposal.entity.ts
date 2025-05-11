import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Project } from '../project/project.entity';
import { Agency } from '../agency/agency.entity';

export enum ProposalStatus {
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}
@Table
export class Proposal extends Model<Proposal> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  project_id: number;
  @BelongsTo(() => Project)
  project: Project;

  @ForeignKey(() => Agency)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  agency_id: number;
  @BelongsTo(() => Agency)
  agency: Agency;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  proposal_text: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  proposed_budget: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  proposed_timeline: string;

  @Column({
    type: DataType.ENUM(),
    values: Object.values(ProposalStatus),
    defaultValue: ProposalStatus.SUBMITTED,
  })
  status: ProposalStatus;
}
