export interface Product {
  id: number;

  name: string;

  description: string;

  nameTranslations:
    Record<
      string,
      string
    >;

  descriptionTranslations:
    Record<
      string,
      string
    >;

  categoryId: number;

  category: string;

  price: number;

  image:
    string | null;

  available: boolean;

  featured: boolean;

  dailySpecial: boolean;

  active: boolean;
}