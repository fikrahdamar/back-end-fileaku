import { Request, Response } from "express";

export default {
  dummy(req: Request, res: Response) {
    res.status(200).json({ message: "Data dummy telah masuk", data: "OK" });
  },
};
