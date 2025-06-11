import { Request, Response } from "express";
import { z } from "zod";
import userModel, { Iuser } from "../models/user.model";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validateRegisterSchema = z
  .object({
    fullName: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6, "Password harus minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Password harus minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

export default {
  async register(req: Request, res: Response) {
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      validateRegisterSchema.parse({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const dataUser = await userModel.create({
        fullName,
        username,
        email,
        password,
      });

      res.status(200).json({
        message: "User registered succesfully",
        data: dataUser,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation failed",
          data: null,
          errors: error.errors,
        });
      } else {
        res.status(400).json({
          message: "Error while registering user",
          data: null,
          error: {
            message: (error as Error).message,
            stack: (error as Error).stack,
          },
        });
      }
    }
  },
};
