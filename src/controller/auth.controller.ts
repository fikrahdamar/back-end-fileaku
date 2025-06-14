import { Request, Response } from "express";
import { z } from "zod";
import userModel, { IUser } from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/auth.middleware";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const validateRegisterSchema = z
  .object({
    fullName: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(6, "Password harus minimal 6 karakter")
      .refine((val) => /^(?=.*[A-Z]).+$/.test(val), {
        message: "Harus mengandung huruf kapital",
      })
      .refine((val) => /^(?=.*[0-9]).+$/.test(val), {
        message: "Harus mengandung angka",
      }),
    confirmPassword: z.string().min(6, "Password harus minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

export default {
  async register(req: Request, res: Response) {
    /*
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/RegisterRequest"
                    }  
                }
            }
        } 
    */
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

  async login(req: Request, res: Response) {
    /*
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/LoginRequest"
                    }  
                }
            }
        } 
    */
    try {
      const { identifier, password } = req.body as unknown as TLogin;

      const userByIdentifier = await userModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
        isActive: true,
      });

      if (!userByIdentifier) {
        res.status(403).json({
          message:
            "Error username atau email salah, atau akun belum diaktivasi",
          data: null,
        });
        return;
      }

      const passwordMatch: boolean =
        encrypt(password) === userByIdentifier.password;
      if (!passwordMatch) {
        res.status(403).json({
          message: "Password tidak valid",
          data: null,
        });
        return;
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      res.status(200).json({
        message: "Login succesful",
        data: token,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error while registering user",
        data: null,
        error: {
          message: (error as Error).message,
          stack: (error as Error).stack,
        },
      });
    }
  },
  async me(req: IReqUser, res: Response) {
    /*
    #swagger.tags = ['Auth']
     #swagger.security = [{
            "bearerAuth": []
    }]
    */
    try {
      const user = req.user;
      const result = await userModel.findById(user?.id);

      res.status(200).json({
        message: "Succes get user profile",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error while getting data user",
        data: null,
        error: {
          message: (error as Error).message,
          stack: (error as Error).stack,
        },
      });
    }
  },

  async activation(req: Request, res: Response) {
    /* 
      #swagger.tags = ['Auth']
    */
    try {
      const { code } = req.body as { code: string };
      const userActivation = await userModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        }
      );
      res.status(200).json({
        message: "activation succes",
        data: userActivation,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error while activate user",
        data: null,
        error: {
          message: (error as Error).message,
          stack: (error as Error).stack,
        },
      });
    }
  },
};
