import { UserModel } from "@prisma/client";
import { IConfigService } from "../config/config.service.interface";
import { UserLoginDto } from "../dto/user-login";
import { UserRegisterDto } from "../dto/user-register";
import { User } from "../entities/user";
import { IUsersRepository } from "../repositories/users";

export interface IUserService {
  createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
  validateUser: (dto: UserLoginDto) => Promise<boolean>;
}

export class UserService implements IUserService {
  constructor(
    private configService: IConfigService,
    private usersRepository: IUsersRepository
  ) {}

  async createUser({
    email,
    name,
    password,
  }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name);
    await newUser.setPassword(password);
    const existedUser = await this.usersRepository.find(email);

    if (existedUser) {
      return null;
    }

    return this.usersRepository.create(newUser);
  }

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    const existedUser = await this.usersRepository.find(email);

    if (!existedUser) {
      return false;
    }

    const newUser = new User(
      existedUser?.email,
      existedUser?.name,
      existedUser.password
    );
    return newUser.comparePassword(password);
  }

  async getUserInfo(email: string): Promise<UserModel | null> {
    return this.usersRepository.find(email);
  }
}
