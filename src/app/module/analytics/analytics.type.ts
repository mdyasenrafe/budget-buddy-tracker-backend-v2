export type TAnalyticsQuery = {
  year: number;
  monthIndex: number;
  timezone: string;
  categoryIds?: string;
};

export type TCategoryAnalytics = {
  _id: string;
  label: string;
  totalAmount: number;
};

export type TAnalyticsResponse = {
  total: number;
  categories: TCategoryAnalytics[];
};
