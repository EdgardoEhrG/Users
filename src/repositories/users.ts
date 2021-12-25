import { UserModel } from "@prisma/client";
import { PrismaService } from "../database/prisma";
import { User } from "../entities/user";

export interface IUsersRepository {
  create: (user: User) => Promise<UserModel>;
  find: (email: string) => Promise<UserModel | null>;
}

// ----

export class UsersRepository implements IUsersRepository {
  constructor(private prismaService: PrismaService) {}

  async create({ email, password, name }: User): Promise<UserModel> {
    return this.prismaService.client.userModel.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  async find(email: string): Promise<UserModel | null> {
    return this.prismaService.client.userModel.findFirst({
      where: {
        email,
      },
    });
  }
}
