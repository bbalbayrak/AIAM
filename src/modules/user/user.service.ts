import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/config/constants';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async createUser(user: UserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const hashedUser = {
      ...user,
      password: hashedPassword,
    };

    return await this.userRepository.create<User>(hashedUser);
  }

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

  async getUserById(user_id: number): Promise<User | null> {
    const user = await this.userRepository.findOne<User>({
      where: { id: user_id },
      attributes: { exclude: ['password'] },
    });
    return user;
  }

  async getCurrentUserInfo(user_id: number): Promise<User | null> {
    const user = await this.userRepository.findOne<User>({
      where: { id: user_id },
    });
    return user;
  }
}
