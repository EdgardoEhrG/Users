import { App } from "./app";
import { ConfigService } from "./config/config.service";
import { UserController } from "./controllers/user";
import { PrismaService } from "./database/prisma";
import { ExceptionFilter } from "./errors/exception";
import { LoggerService } from "./logger";
import { UsersRepository } from "./repositories/users";
import { UserService } from "./services/users";

async function run() {
  const logger = new LoggerService();
  const prisma = new PrismaService(logger);
  const config = new ConfigService(logger);
  const usersRepository = new UsersRepository(prisma);
  const users = new UserService(config, usersRepository);

  const app = new App(
    logger,
    users,
    new UserController(logger, users, config),
    new ExceptionFilter(logger),
    config,
    prisma,
    usersRepository
  );
  await app.init();
}

run();
