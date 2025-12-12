export interface StaffProfile {
  uid: string;
  email: string;
  displayName?: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  startWeightKg?: number | null;
  latestWeightKg?: number | null;
}

export interface WeightCheckin {
  id?: string;
  userId: string;
  weightKg: number;
  createdAt: string; // ISO string
}

export interface NewsItem {
  id?: string;
  title: string;
  body?: string;
  createdAt: string; // ISO string
  ctaLabel?: string;
  ctaUrl?: string;
}
