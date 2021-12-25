import { IConfigService } from "./config.service.interface";
import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { ILogger } from "../logger/interface";

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(private logger: ILogger) {
    const result: DotenvConfigOutput = config();
    this.config = {};
    if (result.error) {
      this.logger.error("[ConfigService] Cannot read .env file");
    } else {
      this.logger.log(
        "[ConfigService] Configurations from .env file are using"
      );
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get<T extends string | number>(key: string) {
    return this.config[key] as T;
  }
}
