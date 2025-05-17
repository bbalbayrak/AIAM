import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from 'src/modules/user/user.entity';
import { Agency } from 'src/modules/agency/agency.entity';
import { Business } from 'src/modules/business/business.entity';
import { Project } from 'src/modules/project/project.entity';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { Contract } from 'src/modules/contract/contract.entity';
import { Milestone } from 'src/modules/milestone/milestone.entity';
import { Message } from 'src/modules/messages/messages.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV as any) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);

      sequelize.addModels([
        User,
        Agency,
        Business,
        Project,
        Proposal,
        Contract,
        Milestone,
        Message,
      ]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
