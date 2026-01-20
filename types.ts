
export type Language = 'en' | 'ar';

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  image: string;
  storeId: string;
  category: 'Oud' | 'Perfume' | 'Musk' | 'Oil' | 'Lotion' | 'Dukhoon';
}

export interface Store {
  id: string;
  nameEn: string;
  nameAr: string;
  image: string;
  productCount: number;
}

export interface Workshop {
  nameEn: string;
  nameAr: string;
  date: string;
  time: string;
  detailsEn: string;
  detailsAr: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DeliveryCost {
  emirate: string;
  cities: { [key: string]: number };
}

export interface Translation {
  [key: string]: {
    en: string;
    ar: string;
  };
}
