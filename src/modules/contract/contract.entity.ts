import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Project } from '../project/project.entity';
import { Proposal } from '../proposal/proposal.entity';
import { Business } from '../business/business.entity';
import { Agency } from '../agency/agency.entity';

export enum ContractStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  TERMINATED = 'terminated',
}
@Table
export class Contract extends Model<Contract> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  project_id: number;
  @BelongsTo(() => Project)
  project: Project;

  @ForeignKey(() => Proposal)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  proposal_id: number;
  @BelongsTo(() => Proposal)
  proposal: Proposal;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  business_id: number;
  @BelongsTo(() => Business)
  business: Business;

  @ForeignKey(() => Agency)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  agency_id: number;
  @BelongsTo(() => Agency)
  agency: Agency;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  agreed_budget: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  start_date: Date;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  end_date: Date;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  terms_and_conditions: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(ContractStatus),
    defaultValue: ContractStatus.ACTIVE,
  })
  status: ContractStatus;
}
