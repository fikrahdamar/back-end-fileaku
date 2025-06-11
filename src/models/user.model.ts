import mongoose, { Schema, Document } from "mongoose";
import { encrypt } from "../utils/encryption";

export interface Iuser extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string | null;
}

const userSchema = new Schema<Iuser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User&background=random",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activationCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  next();
});

const userModel = mongoose.model<Iuser>("User", userSchema);

export default userModel;
