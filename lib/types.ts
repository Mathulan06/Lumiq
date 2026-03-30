export interface Photo {
  id: string;
  publicId: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  isHero?: boolean;
  isFeatured?: boolean;
}
