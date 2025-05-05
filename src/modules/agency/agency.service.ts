import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AGENCY_REPOSITORY } from 'src/config/constants';
import { Agency } from './agency.entity';
import { AgencyDto } from './dto/agency.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AgencyService {
  constructor(
    @Inject(AGENCY_REPOSITORY) private readonly agencyRepository: typeof Agency,
    private readonly userService: UserService,
  ) {}

  async getAllAgencies(): Promise<Agency[]> {
    return await this.agencyRepository.findAll<Agency>();
  }

  async createAgency(agency: AgencyDto): Promise<Agency> {
    const isUserIdExists = await this.userService.getUserById(agency.user_id);
    if (!isUserIdExists) {
      throw new NotFoundException('User not found');
    }
    const newAgency = await this.agencyRepository.create<Agency>(agency);
    return newAgency;
  }

  async getAgencyById(agency_id: number): Promise<Agency | null> {
    const agency = await this.agencyRepository.findOne<Agency>({
      where: { id: agency_id },
    });
    return agency;
  }

  async updateAgency(
    agency_id: number,
    agency: AgencyDto,
  ): Promise<Agency | null> {
    const isUserIdExists = await this.userService.getUserById(agency.user_id);
    if (!isUserIdExists) {
      throw new NotFoundException('User not found');
    }
    const existingAgency = await this.agencyRepository.findByPk(agency_id);
    if (!existingAgency) {
      throw new NotFoundException('Agency not found');
    }
    const { rating, ...safeDto } = agency as any;
    const updatedAgency = await existingAgency.update(safeDto, {
      where: { id: agency_id },
    });
    return updatedAgency;
  }

  // async getAgenciesReviews(agency_id: number): Promise<Agency | null> {
  //     const existingAgency = await this.agencyRepository.findOne<Agency>({
  //       where: { id: agency_id },
  //     });
  //     if (!existingAgency) {
  //       throw new NotFoundException('Agency not found');
  //     }
  //     const reviews = await existingAgency.get('reviews')
  // }

  async getTopRatedAgencies(): Promise<Agency[]> {
    const agencies = await this.agencyRepository.findAll<Agency>();
    const topRatedAgencies = agencies
      .filter((agency) => agency.rating !== undefined && agency.rating !== null)
      .sort((a, b) => b.rating - a.rating);
    return topRatedAgencies;
  }
}
