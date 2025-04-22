import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/config/constants';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll<User>();
    return users;
  }
  //For JWT strategy
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne<User>({
      where: { email: email },
    });
    return user;
  }

  //   async getUserById(user_id: number): Promise<User | null> {
  //     const user = await this.userRepository.findOne<User>({
  //       where: { user_id: user_id },
  //     });
  //     return user;
  //   }
}
