import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AGENCY_REPOSITORY } from 'src/config/constants';
import { Agency } from './agency.entity';
import { AgencyDto } from './dto/agency.dto';
import assert from 'assert';

@Injectable()
export class AgencyService {
  constructor(
    @Inject(AGENCY_REPOSITORY) private readonly agencyRepository: typeof Agency,
  ) {}

  async getAllAgencies(): Promise<Agency[]> {
    return await this.agencyRepository.findAll<Agency>();
  }

  async createAgency(agency: AgencyDto): Promise<Agency> {
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
    const existingAgency = await this.agencyRepository.findOne<Agency>({
      where: { id: agency_id },
    });
    if (!existingAgency) {
      throw new NotFoundException('Agency not found');
    }
    const updatedAgency = await existingAgency.update(agency, {
      where: { id: agency_id },
    });
    return updatedAgency;
  }

  //THERE IS NO REVIEWS
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
