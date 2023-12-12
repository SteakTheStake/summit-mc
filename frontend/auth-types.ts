export interface IsPlegdedProps {
  included: Included[];
}

interface Included {
  attributes: Attributes;
}

interface Attributes {
  url?: string;
}
