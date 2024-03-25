export interface UserSubscriptionDetails {
  tier: Tier;
  packs: Pack[];
  downloads: Download[];
}

interface Tier {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  included: Included[];
  join_link: string;
}

interface Included {
  id: string;
  item: string;
}

interface Pack {
  id: string;
  title: string;
}

export interface Download {
  id: string;
  release: string;
  resolution: number;
  name: string;
  pack: string;
}

export interface UserCodeDetails extends UserSubscriptionDetails {
  code: {
    code: string;
    uses_remaining: number;
    expiry: string;
  };
  message?: string;
}
