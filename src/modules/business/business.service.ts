import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BUSINESS_REPOSITORY } from 'src/config/constants';
import { Business } from './business.entity';
import { BusinessDto } from './dto/business.dto';
import { UserService } from '../user/user.service';
import { CompanySize } from './companySize.enum';

@Injectable()
export class BusinessService {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: typeof Business,
    private readonly userService: UserService,
  ) {}

  async getAllBusinesses(): Promise<Business[]> {
    return await this.businessRepository.findAll<Business>();
  }

  async createBusiness(businessDto: BusinessDto): Promise<Business> {
    const user = await this.userService.getUserById(businessDto.user_id);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${businessDto.user_id} not found`,
      );
    }
    const newBusiness =
      await this.businessRepository.create<Business>(businessDto);
    return newBusiness;
  }

  async getBusinessById(id: number): Promise<Business> {
    const business = await this.businessRepository.findByPk<Business>(id);
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    return business;
  }

  async updateBusiness(
    id: number,
    businessDto: BusinessDto,
  ): Promise<Business> {
    const business = await this.businessRepository.findByPk<Business>(id);
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    await business.update(businessDto);
    return business;
  }
}
