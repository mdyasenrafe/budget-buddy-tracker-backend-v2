import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import { userRolesArray, userStatusArray } from "./user.constant";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: userRolesArray,
      default: "user",
    },
    status: {
      type: String,
      enum: userStatusArray,
      default: "pending",
    },
    photo: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: "web",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, 12);
  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

export const UserModel = model<TUser>("user", userSchema);
