import { Server } from "http";

import express, { Express } from "express";
import { json } from "body-parser";

import { LoggerService } from "./logger";
import { UserController } from "./controllers/user";
import { ExceptionFilter } from "./errors/exception";
import { IUserService, UserService } from "./services/users";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.service.interface";
import { ILogger } from "./logger/interface";
import { IExceptionFilter } from "./errors/exception.interface";
import { PrismaService } from "./database/prisma";
import { IUsersRepository, UsersRepository } from "./repositories/users";
import { AuthMiddleware } from "./middleware/auth";

export class App {
  app: Express;
  port: number;
  server: Server;
  logger: ILogger;
  users: IUserService;
  userController: UserController;
  ExceptionFilter: IExceptionFilter;
  config: IConfigService;
  prisma: PrismaService;
  usersRepository: IUsersRepository;

  constructor(
    logger: LoggerService,
    users: UserService,
    userController: UserController,
    ExceptionFilter: ExceptionFilter,
    config: ConfigService,
    prisma: PrismaService,
    usersRepository: UsersRepository
  ) {
    this.app = express();
    this.port = 8000;
    this.server = new Server();
    this.logger = logger;
    this.users = users;
    this.userController = userController;
    this.ExceptionFilter = ExceptionFilter;
    this.config = config;
    this.prisma = prisma;
    this.usersRepository = usersRepository;
  }

  useMiddleware() {
    this.app.use(json());
    const auth = new AuthMiddleware(this.config.get("SECRET"));
    this.app.use(auth.execute.bind(auth));
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExceptionFilters() {
    this.app.use(this.ExceptionFilter.catch.bind(this.ExceptionFilter));
  }

  public async init() {
    this.useMiddleware();
    this.useRoutes();
    this.useExceptionFilters();
    await this.prisma.connect();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server is running on http://localhost:${this.port}`);
  }
}
