export interface Pokemon {
  name: string;
  url: string;
  id: number;
  imageUrl: string;
  types: string[];
  abilities: string[];
  stats: { name: string; value: number }[];
  images: string[];
  description?: string;
  habitat?: string;
  generation?: string;
}
