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
  body: string; // markdown text
  createdAt: string; // ISO string
  category: 'nutrition' | 'exercise' | 'workouts' | 'general';
  tags: string[]; // e.g. ["recipe", "family"]
  pinToBanner: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
  heroImageUrl?: string;
}
