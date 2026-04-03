import { Types } from "mongoose";

export type TAnalyticsQuery = {
  year: number;
  month: number;
  timezone: string;
  categoryIds?: string;
};

export type TCategoryAnalytics = {
  _id: string; // Category ID
  label: string;
  totalAmount: number;
};

export type TAnalyticsResponse = {
  total: number;
  categories: TCategoryAnalytics[];
};
