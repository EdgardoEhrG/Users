import { LoggerService } from "../logger";
import { Response, Router } from "express";
import { IRoute } from "./route.interface";

export abstract class Controller {
  private readonly _router: Router;

  constructor(private logger: LoggerService) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T) {
    res.type("application/json");
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  public created(res: Response) {
    res.sendStatus(201);
  }

  protected bindRoutes(routes: IRoute[]) {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`);
      const middleware = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.func.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler;
      this.router[route.method](route.path, pipeline);
    }
  }
}
