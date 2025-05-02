import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  //For Admin
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

  async updateUser(user_id: number, user: UserDto): Promise<User | null> {
    const existingUser = await this.userRepository.findOne<User>({
      where: { id: user_id },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const hashedUser = {
      ...user,
      password: hashedPassword,
    };

    const updatedUser = await existingUser.update(hashedUser, {
      where: { id: user_id },
    });
    return updatedUser;
  }

  async deleteUser(user_id: number): Promise<void> {
    const user = await this.userRepository.findOne<User>({
      where: { id: user_id },
    });
    await user.destroy();
  }
}
