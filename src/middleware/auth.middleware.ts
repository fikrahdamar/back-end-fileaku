import { NextFunction, Request, Response } from "express";
import { getUserData, IUserToken } from "../utils/jwt";

export interface IReqUser extends Request {
  user?: IUserToken;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    res.status(403).json({
      message: "Unauthorized",
      data: null,
    });
    return;
  }

  const [prefix, accesToken] = authorization.split(" ");
  if (!(prefix === "Bearer" && accesToken)) {
    res.status(403).json({
      message: "Unauthorized",
      data: null,
    });
    return;
  }

  const user = getUserData(accesToken);
  if (!user) {
    res.status(403).json({
      message: "No User found",
      data: null,
    });
    return;
  }

  (req as IReqUser).user = user;
  next();
};
