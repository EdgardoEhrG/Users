import { PrismaClient } from "@prisma/client";
import e from "express";
import { ILogger } from "../logger/interface";

export class PrismaService {
  client: PrismaClient;

  constructor(private logger: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log("[Prisma Service] DB is connected");
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `[Prisma Service] The connection is failed. ${error.message}`
        );
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
