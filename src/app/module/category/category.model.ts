import { Schema, model } from "mongoose";
import { TCategory } from "./category.types";

const CategorySchema = new Schema<TCategory>({
  label: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
});

export const CategoryModel = model<TCategory>("category", CategorySchema);
