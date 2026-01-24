
import { Product, Store, Workshop, DeliveryCost } from './types';

export const STORES: Store[] = [
  { id: 'ajmal', nameEn: 'Ajmal', nameAr: 'أجمل', image: 'images/stores/ajmal.jpg', productCount: 13 },
  { id: 'bin-hor', nameEn: 'Bin Hor', nameAr: 'بن حر', image: 'images/stores/bin-hor.jpg', productCount: 9 },
  { id: 'gazali', nameEn: 'Gazali', nameAr: 'غزالي', image: 'images/stores/gazali.jpg', productCount: 7 },
  { id: 'inshallah-mashallah', nameEn: 'Inshallah Mashallah', nameAr: 'ان شاء الله ما شاء الله', image: 'images/stores/inshallah-mashallah.jpg', productCount: 1 },
  { id: 'abdulrasheed', nameEn: 'Abdulrasheed', nameAr: 'عبدالرشيد', image: 'images/stores/abdulrasheed.jpg', productCount: 1 },
  { id: 'yunus', nameEn: 'Yunus', nameAr: 'يونس', image: 'images/stores/yunus.jpg', productCount: 4 },
];

export const PRODUCTS: Product[] = [
  // Ajmal
  { id: 'aj1', storeId: 'ajmal', nameEn: 'Lotion Dizzy', nameAr: 'لوشن ديزي', price: 55, category: 'Lotion', image: 'images/products/aj1.jpg' },
  { id: 'aj2', storeId: 'ajmal', nameEn: 'Oud Forest', nameAr: 'عود فورست', price: 160, category: 'Oud', image: 'images/products/aj2.jpg' },
  { id: 'aj3', storeId: 'ajmal', nameEn: 'Blue Scented Oud', nameAr: 'عود معطر ازرق', price: 240, category: 'Oud', image: 'images/products/aj3.jpg' },
  { id: 'aj4', storeId: 'ajmal', nameEn: 'Scented Oud Zayed', nameAr: 'عود معطر زايد', price: 245, category: 'Oud', image: 'images/products/aj4.jpg' },
  { id: 'aj5', storeId: 'ajmal', nameEn: 'Dukhoon Rashid', nameAr: 'دخون راشد', price: 100, category: 'Dukhoon', image: 'images/products/aj5.jpg' },
  { id: 'aj6', storeId: 'ajmal', nameEn: 'Amber Musk', nameAr: 'مسك عنبر', price: 175, category: 'Musk', image: 'images/products/aj6.jpg' },
  { id: 'aj7', storeId: 'ajmal', nameEn: 'Malaki Musk', nameAr: 'مسك ملكي', price: 190, category: 'Musk', image: 'images/products/aj7.jpg' },
  { id: 'aj8', storeId: 'ajmal', nameEn: 'Barakah Perfume', nameAr: 'عطر بركة', price: 150, category: 'Perfume', image: 'images/products/aj8.jpg' },
  { id: 'aj9', storeId: 'ajmal', nameEn: 'Mori wood oud 20', nameAr: 'عود خشب موري', price: 310, category: 'Oud', image: 'images/products/aj9.jpg' },
  { id: 'aj10', storeId: 'ajmal', nameEn: 'Dizzy Perfume', nameAr: 'عطر ديزي', price: 145, category: 'Perfume', image: 'images/products/aj10.jpg' },
  { id: 'aj11', storeId: 'ajmal', nameEn: 'Oud of Sheikha Noura (Quarter Tola)', nameAr: 'عود الشيخة نورة (ربع توله)', price: 155, category: 'Oil', image: 'images/products/aj11.jpg' },
  { id: 'aj12', storeId: 'ajmal', nameEn: 'Oud Qiblat Al Wafa (Quarter Tola)', nameAr: 'عود قبلة الوفاء (ربع توله)', price: 55, category: 'Oil', image: 'images/products/aj12.jpg' },
  { id: 'aj13', storeId: 'ajmal', nameEn: 'Makhmariya (Quarter Tola)', nameAr: 'مخمرية (ربع توله)', price: 55, category: 'Oil', image: 'images/products/aj13.jpg' },
  // Bin Hor
  { id: 'bh1', storeId: 'bin-hor', nameEn: 'Mukhallat Dehn Oud Barakah', nameAr: 'مخلط دهن عود بركة', price: 210, category: 'Oil', image: 'images/products/bh1.jpg' },
  { id: 'bh2', storeId: 'bin-hor', nameEn: 'Dehn Al Oud Al Amiri', nameAr: 'دهن العود الاميري', price: 245, category: 'Oil', image: 'images/products/bh2.jpg' },
  { id: 'bh3', storeId: 'bin-hor', nameEn: 'Jumeirah Perfume', nameAr: 'عطر جميرا', price: 210, category: 'Perfume', image: 'images/products/bh3.jpg' },
  { id: 'bh4', storeId: 'bin-hor', nameEn: 'Dehn Al Oud Seufi Special', nameAr: 'دهن العود سيوفي خاص', price: 210, category: 'Oil', image: 'images/products/bh4.jpg' },
  { id: 'bh5', storeId: 'bin-hor', nameEn: 'Old Dehn Oud Vaseline', nameAr: 'فازلين دهن عود قديم', price: 80, category: 'Oil', image: 'images/products/bh5.jpg' },
  { id: 'bh6', storeId: 'bin-hor', nameEn: 'Mohammed Bin Zayed', nameAr: 'محمد بن زايد', price: 210, category: 'Perfume', image: 'images/products/bh6.jpg' },
  { id: 'bh7', storeId: 'bin-hor', nameEn: 'Old Indian Dehn Al Oud', nameAr: 'دهن العود هندي قديم', price: 210, category: 'Oil', image: 'images/products/bh7.jpg' },
  { id: 'bh8', storeId: 'bin-hor', nameEn: 'Dehn Al Oud Barakah Shuyookh', nameAr: 'دهن العود بركة شيوخ', price: 210, category: 'Oil', image: 'images/products/bh8.jpg' },
  { id: 'bh9', storeId: 'bin-hor', nameEn: 'Musk Al Oud', nameAr: 'مسك العود', price: 210, category: 'Musk', image: 'images/products/bh9.jpg' },
  // Gazali
  { id: 'gz1', storeId: 'gazali', nameEn: 'Seoufi Oud Perfume', nameAr: 'عطر عود سيوفي', price: 24, category: 'Perfume', image: 'images/products/gz1.jpg' },
  { id: 'gz2', storeId: 'gazali', nameEn: 'Magic', nameAr: 'ماجيك', price: 180, category: 'Perfume', image: 'images/products/gz2.jpg' },
  { id: 'gz3', storeId: 'gazali', nameEn: 'HH Perfume', nameAr: 'عطر HH', price: 180, category: 'Perfume', image: 'images/products/gz3.jpg' },
  { id: 'gz4', storeId: 'gazali', nameEn: 'Indian Tola Seoufi Oud (Oud Bag)', nameAr: 'عود توله هندي سيوفي (شنطة عود)', price: 135, category: 'Oud', image: 'images/products/gz4.jpg' },
  { id: 'gz5', storeId: 'gazali', nameEn: 'Old Oud', nameAr: 'عود قديم', price: 245, category: 'Oud', image: 'images/products/gz5.jpg' },
  { id: 'gz6', storeId: 'gazali', nameEn: 'Pink Oud', nameAr: 'عنبر وردي', price: 180, category: 'Oud', image: 'images/products/gz6.jpg' },
  { id: 'gz7', storeId: 'gazali', nameEn: 'Shaikah Latifa Oud', nameAr: 'عود الشيخه لطيفة', price: 180, category: 'Oud', image: 'images/products/gz7.jpg' },
  // Others
  { id: 'is1', storeId: 'inshallah-mashallah', nameEn: 'Old Indian Oud Oil (Quarter Tola)', nameAr: 'دهن عود هندي قديم (ربع توله)', price: 100, category: 'Oil', image: 'images/products/is1.jpg' },
  { id: 'ar1', storeId: 'abdulrasheed', nameEn: 'Old Oud Oil (Quarter Tola)', nameAr: 'دهن عود قديم (ربع توله)', price: 150, category: 'Oil', image: 'images/products/ar1.jpg' },
  { id: 'yn1', storeId: 'yunus', nameEn: 'White Oud (Quarter Tola)', nameAr: 'عود ابيض (ربع توله)', price: 55, category: 'Oil', image: 'images/products/yn1.jpg' },
  { id: 'yn2', storeId: 'yunus', nameEn: 'Sheikh Sultan', nameAr: 'الشيخ سلطان', price: 300, category: 'Perfume', image: 'images/products/yn2.jpg' },
  { id: 'yn3', storeId: 'yunus', nameEn: 'Atfal Oud (Quarter Tola)', nameAr: 'عود اطفال (ربع توله)', price: 100, category: 'Oil', image: 'images/products/yn3.jpg' },
  { id: 'yn4', storeId: 'yunus', nameEn: 'Sheikah Fatima SF', nameAr: 'الشيخة فاطمه SF', price: 280, category: 'Perfume', image: 'images/products/yn4.jpg' },
];

export const WORKSHOP: Workshop = {
  nameEn: "Perfume Blending Workshop",
  nameAr: "ورشة عمل تركيب العطور",
  date: "October 24, 2025",
  time: "6:00 PM - 8:00 PM",
  detailsEn: "Join us for an exclusive evening of olfactory discovery. Learn the art of perfume making from expert blenders and create your own signature scent to take home.",
  detailsAr: "انضم إلينا في أمسية حصرية لاكتشاف العطور. تعلم فن صناعة العطور من الخبراء وابتكر رائحتك الخاصة لتأخذها معك إلى المنزل.",
  image: "images/workshop.jpg"
};

export const DELIVERY_COSTS = [
  {
    emirate: 'Dubai',
    cities: { 'Deira': 30, 'Bur Dubai': 30, 'Jumeirah': 35, 'Downtown': 35, 'Al Barsha': 35, 'Mirdif': 35, 'JLT/Marina': 40, 'Jebel Ali': 45 }
  },
  {
    emirate: 'Abu Dhabi',
    cities: { 'City Center': 40, 'Khalifa City': 45, 'Yas Island': 45, 'Mussafah': 45, 'Mohammed Bin Zayed City': 45, 'Al Ain City': 50 }
  },
  {
    emirate: 'Sharjah',
    cities: { 'Al Majaz': 25, 'Al Khan': 25, 'Al Nahda': 25, 'Muwailih': 30, 'University City': 30, 'Khor Fakkan': 50, 'Kalba': 50 }
  },
  {
    emirate: 'Ajman',
    cities: { 'Al Nuaimiya': 20, 'Al Rawda': 20, 'Al Jurf': 20, 'Makhriz (Store)': 0, 'Hamriya': 30 }
  },
  {
    emirate: 'Umm Al Quwain',
    cities: { 'City Center': 35, 'Al Salamah': 35, 'Falaj Al Mualla': 45 }
  },
  {
    emirate: 'Ras Al Khaimah',
    cities: { 'City Center': 40, 'Al Hamra': 45, 'Mina Al Arab': 45, 'Masafi': 50 }
  },
  {
    emirate: 'Fujairah',
    cities: { 'City Center': 40, 'Dibba': 50, 'Al Aqah': 55 }
  }
];