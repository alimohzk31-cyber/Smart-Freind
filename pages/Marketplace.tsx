
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Coffee, Utensils, Search, Smartphone, MapPin, Star, 
  ShoppingBasket, Pill, Armchair, Wrench, Plane, Fuel, Briefcase,
  Plus, Minus, ShoppingCart, X, Filter, ChevronRight, Heart, Info,
  Clock, Truck, Tag, CreditCard, ChevronLeft, Navigation
} from 'lucide-react';
import { MarketplaceItem, CartItem, MarketplaceCategory, Vendor } from '../types';

// --- MOCK DATA FACTORY ---
const CATEGORIES: { id: MarketplaceCategory; label: string; icon: any; color: string }[] = [
  { id: 'cars', label: 'السيارات', icon: Car, color: 'text-blue-500' },
  { id: 'food', label: 'المطاعم', icon: Utensils, color: 'text-orange-500' },
  { id: 'coffee', label: 'الكوفي', icon: Coffee, color: 'text-amber-700' },
  { id: 'supermarket', label: 'السوبر ماركت', icon: ShoppingBasket, color: 'text-green-500' },
  { id: 'pharmacy', label: 'الصيدلية', icon: Pill, color: 'text-red-500' },
  { id: 'tech', label: 'الإلكترونيات', icon: Smartphone, color: 'text-purple-500' },
  { id: 'furniture', label: 'الأثاث', icon: Armchair, color: 'text-indigo-500' },
  { id: 'services', label: 'الخدمات', icon: Wrench, color: 'text-slate-500' },
  { id: 'travel', label: 'السفر', icon: Plane, color: 'text-sky-500' },
  { id: 'fuel', label: 'الوقود', icon: Fuel, color: 'text-yellow-500' },
  { id: 'jobs', label: 'الوظائف', icon: Briefcase, color: 'text-pink-500' },
];

const ITEMS: MarketplaceItem[] = [
  // Cars
  { id: 'c1', title: 'Toyota Land Cruiser', subtitle: '2024 • GXR Twin Turbo', price: 78000, currency: 'USD', category: 'cars', image: 'https://images.unsplash.com/photo-1594502184342-28ef3827b036?auto=format&fit=crop&q=80&w=800', rating: 5, location: 'بغداد/اليرموك', specs: { 'المحرك': 'V6 Twin Turbo', 'المسافة': '0 كم', 'الضمان': '3 سنوات' }, isHot: true },
  { id: 'c2', title: 'Mercedes G-Class', subtitle: 'G63 AMG Edition 1', price: 210000, currency: 'USD', category: 'cars', image: 'https://images.unsplash.com/photo-1520031441872-265149a9e690?auto=format&fit=crop&q=80&w=800', rating: 5, location: 'أربيل', specs: { 'المحرك': 'V8 Biturbo', 'اللون': 'Matte Black', 'سنة': '2023' }, isHot: true },
  { id: 'c3', title: 'Kia K5', subtitle: '2023 • GT Line Full', price: 24500, currency: 'USD', category: 'cars', image: 'https://images.unsplash.com/photo-1609529669235-c07e4e1bd6e9?auto=format&fit=crop&q=80&w=800', rating: 4.8, location: 'البصرة', specs: { 'المحرك': '2.5L', 'المسافة': '12,000 كم', 'اللون': 'Wolf Gray' } },
  { id: 'c4', title: 'Hyundai Tucson', subtitle: '2024 • Panoramic', price: 23000, currency: 'USD', category: 'cars', image: 'https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800', rating: 4.7, location: 'بغداد', specs: { 'المحرك': '2.0L', 'المسافة': '0 كم', 'ضمان': '5 سنوات' } },

  // Food
  { id: 'f1', title: 'مسكوف عراقي', subtitle: 'سمك شبوط حي (2 كغم)', price: 35000, currency: 'IQD', category: 'food', image: 'https://images.unsplash.com/photo-1535914652254-20d418e6e8e8?auto=format&fit=crop&q=80&w=800', rating: 4.9, vendorName: 'مطعم صمد', deliveryTime: '45-60 دقيقة', isPromo: true },
  { id: 'f2', title: 'مشويات مشكلة', subtitle: 'نفر كباب + تكة + معلاك', price: 22000, currency: 'IQD', category: 'food', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', rating: 4.8, vendorName: 'كباب زرزور', deliveryTime: '30-45 دقيقة' },
  { id: 'f3', title: 'بيتزا سوبريم', subtitle: 'حجم عائلي', price: 18000, currency: 'IQD', category: 'food', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', rating: 4.6, vendorName: 'Pizza House', deliveryTime: '30 دقيقة' },
  
  // Supermarket
  { id: 's1', title: 'أرز بسمتي', subtitle: 'درجة اولى (5 كغم)', price: 12000, currency: 'IQD', category: 'supermarket', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800', deliveryTime: 'سريع', isPromo: true, discount: 10 },
  { id: 's2', title: 'زيت دوار الشمس', subtitle: 'زرزور (1 لتر)', price: 2500, currency: 'IQD', category: 'supermarket', image: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&q=80&w=800', deliveryTime: 'سريع' },
  
  // Tech
  { id: 't1', title: 'iPhone 15 Pro', subtitle: '256GB Natural Titanium', price: 1150, currency: 'USD', category: 'tech', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', rating: 5, specs: {'الضمان': 'آسياسيل', 'الذاكرة': '256GB'} },
];

const VENDORS: Vendor[] = [
  { id: 'v1', name: 'مطعم صمد', category: 'food', rating: 4.8, location: 'المنصور', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', deliveryTime: '45 دقيقة', minOrder: 15000 },
  { id: 'v2', name: 'لؤلؤة بغداد', category: 'cars', rating: 4.9, location: 'النهضة', image: 'https://images.unsplash.com/photo-1562141989-c5c79ac8f576?auto=format&fit=crop&q=80&w=800' },
];

// --- COMPONENTS ---

const HeroCarousel = () => (
  <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-b-[3rem] shadow-2xl mb-8 group bg-slate-900">
    <motion.div 
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      className="absolute inset-0"
    >
      <img 
         src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1920"
         alt="Hero" 
         className="w-full h-full object-cover opacity-50" 
      />
    </motion.div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
    
    <div className="absolute bottom-0 w-full p-8 md:p-16">
       <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="bg-accent/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg shadow-accent/20">Exclusive Offers</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl leading-tight">
              السوق العراقي <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">المركزي</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              وجهتك الأولى للتسوق الذكي. سيارات، عقارات، إلكترونيات، وطلبات مطاعم بتجربة سينمائية فريدة.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button className="px-8 py-4 bg-primary hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2">
              <ShoppingBasket size={20} /> تسوق الآن
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur hover:bg-white/20 text-white rounded-2xl font-bold border border-white/10 transition-all">
              تصفح العروض
            </button>
          </motion.div>
       </div>
    </div>
  </div>
);

const SectionHeader = ({ title, action }: { title: string, action?: any }) => (
  <div className="flex justify-between items-center mb-6 px-4">
     <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
       <span className="w-1.5 h-8 bg-gradient-to-b from-primary to-blue-400 rounded-full"></span>
       {title}
     </h2>
     {action}
  </div>
);

// --- CATEGORY VIEWS ---

const CarCard: React.FC<{ item: MarketplaceItem; onOpen: (i: MarketplaceItem) => void }> = ({ item, onOpen }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden group cursor-pointer flex flex-col h-full shadow-sm hover:shadow-xl transition-all"
    onClick={() => onOpen(item)}
  >
    <div className="relative h-64 overflow-hidden">
      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-4 right-4 flex gap-2">
         {item.isHot && <span className="bg-accent/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur">HOT DEAL</span>}
      </div>
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-90"></div>
      <div className="absolute bottom-4 right-4 text-white">
        <h3 className="font-bold text-xl leading-none">{item.title}</h3>
        <p className="text-slate-300 text-sm mt-1">{item.subtitle}</p>
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col">
       {item.specs && (
         <div className="grid grid-cols-3 gap-2 mb-6">
           {Object.entries(item.specs).slice(0,3).map(([k,v]) => (
             <div key={k} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-center border border-slate-100 dark:border-slate-700">
               <span className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{k}</span>
               <span className="block text-xs font-bold text-slate-800 dark:text-white">{v}</span>
             </div>
           ))}
         </div>
       )}
       <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400">السعر النقدي</span>
            <span className="text-xl font-black text-primary">{item.price.toLocaleString()} <span className="text-xs font-normal text-slate-500">{item.currency}</span></span>
          </div>
          <button className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-xl transition-colors text-slate-500 dark:text-slate-300">
            <ChevronLeft size={20} />
          </button>
       </div>
    </div>
  </motion.div>
);

const FoodCard: React.FC<{ item: MarketplaceItem; onAdd: (i: MarketplaceItem) => void }> = ({ item, onAdd }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden group flex h-32 md:h-auto md:flex-col shadow-sm hover:shadow-lg transition-all"
  >
    <div className="relative w-32 md:w-full md:h-48 shrink-0">
      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      {item.rating && (
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 backdrop-blur px-2 py-0.5 rounded-lg flex items-center gap-1 text-xs text-amber-500 font-bold shadow-sm">
          <Star size={10} fill="currentColor" /> {item.rating}
        </div>
      )}
    </div>
    <div className="p-3 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base line-clamp-1">{item.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.vendorName}</p>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 dark:text-slate-300">
           <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"><Clock size={10} /> {item.deliveryTime}</span>
           <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"><Truck size={10} /> توصيل مجاني</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
         <span className="font-bold text-primary">{item.price.toLocaleString()} {item.currency}</span>
         <button onClick={() => onAdd(item)} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors">
           <Plus size={16} />
         </button>
      </div>
    </div>
  </motion.div>
);

const SupermarketGrid = ({ items, onAdd }: { items: MarketplaceItem[], onAdd: (i: MarketplaceItem) => void }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {items.map(item => (
      <div key={item.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 hover:shadow-lg transition text-center relative group">
         {item.isPromo && <span className="absolute top-2 left-2 bg-accent text-white text-[10px] px-1.5 rounded font-bold">-{item.discount}%</span>}
         <img src={item.image} className="w-20 h-20 object-contain mx-auto mb-3 drop-shadow-md" alt="" />
         <h4 className="text-slate-900 dark:text-white text-sm font-bold line-clamp-1">{item.title}</h4>
         <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{item.subtitle}</p>
         <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{item.price.toLocaleString()}</span>
            <button onClick={() => onAdd(item)} className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
              <Plus size={14} />
            </button>
         </div>
      </div>
    ))}
  </div>
);

// --- MODALS & DRAWERS ---

const ProductModal = ({ item, onClose, onAdd }: { item: MarketplaceItem, onClose: () => void, onAdd: (i: MarketplaceItem) => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row"
    >
       <div className="relative w-full md:w-1/2 h-64 md:h-auto">
         <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
         <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur transition">
           <X size={20} />
         </button>
       </div>
       
       <div className="flex-1 p-8 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <div className="flex justify-between items-start">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{item.title}</h2>
                  <p className="text-lg text-slate-500 dark:text-slate-300">{item.subtitle}</p>
               </div>
               <div className="text-right">
                  <div className="text-2xl font-black text-primary">{item.price.toLocaleString()}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{item.currency}</div>
               </div>
            </div>
            {item.rating && (
              <div className="flex items-center gap-2 mt-4">
                 <div className="flex text-amber-500"><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star size={16} /></div>
                 <span className="text-sm text-slate-500 dark:text-slate-400">({item.rating} تقييم)</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6">
             {item.specs && (
               <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                 <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">المواصفات الفنية</h3>
                 <div className="grid grid-cols-2 gap-4">
                   {Object.entries(item.specs).map(([k,v]) => (
                     <div key={k} className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2 last:border-0">
                       <span className="text-slate-500 dark:text-slate-400 text-sm">{k}</span>
                       <span className="text-slate-900 dark:text-white font-bold text-sm">{v}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
             
             {item.category === 'cars' && (
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 text-white">
                   <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3"><CreditCard size={16} /> حاسبة الأقساط</h3>
                   <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">القسط الشهري التقريبي (5 سنوات)</span>
                      <span className="text-xl font-bold text-emerald-400">$380</span>
                   </div>
                   <input type="range" className="w-full mt-3 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                </div>
             )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-4">
             <button onClick={() => { onAdd(item); onClose(); }} className="flex-1 py-4 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex justify-center items-center gap-2">
               <ShoppingBasket /> إضافة للسلة
             </button>
             <button className="px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-white rounded-xl font-bold transition-colors">
               <Heart />
             </button>
          </div>
       </div>
    </motion.div>
  </motion.div>
);

const CartDrawer = ({ isOpen, onClose, cart, updateQty }: { isOpen: boolean, onClose: () => void, cart: CartItem[], updateQty: (id: string, d: number) => void }) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
          >
             <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary"><ShoppingBasket size={20} /></span>
                  سلة المشتريات
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition"><X /></button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <ShoppingBasket size={64} className="mb-4 opacity-20" />
                    <p>السلة فارغة</p>
                    <button onClick={onClose} className="mt-4 text-primary text-sm font-bold">تصفح المنتجات</button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 group hover:border-primary/30 transition">
                       <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-slate-200 dark:bg-slate-900" alt="" />
                       <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1">{item.title}</h4>
                            <p className="text-primary font-mono text-sm">{item.price.toLocaleString()} {item.currency}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 w-fit rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                             <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-white flex items-center justify-center transition"><Minus size={12} /></button>
                             <span className="text-slate-900 dark:text-white text-sm font-bold w-4 text-center">{item.quantity}</span>
                             <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition"><Plus size={12} /></button>
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>

             {cart.length > 0 && (
               <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-slate-500 dark:text-slate-400">المجموع الكلي</span>
                     <span className="text-3xl font-black text-slate-900 dark:text-white">{total.toLocaleString()} <span className="text-sm font-normal text-slate-500">IQD</span></span>
                  </div>
                  <button className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/25 text-white rounded-2xl font-bold transition-all transform active:scale-95">
                    إتمام الشراء
                  </button>
               </div>
             )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const OrderTrackingView = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden shadow-sm">
     <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-accent animate-gradient"></div>
     <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Navigation size={18} className="text-accent" /> تتبع الطلب الحي</h3>
        <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded font-bold">جاري التوصيل</span>
     </div>
     
     <div className="h-48 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6 relative overflow-hidden border border-slate-200 dark:border-slate-700 group">
        {/* Mock Map */}
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/44.3615,33.3128,12,0/600x300?access_token=pk.xxx')] bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute"></div>
           <div className="w-4 h-4 bg-primary rounded-full relative border-2 border-white shadow-xl"></div>
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-2 rounded-lg text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
           <p className="font-bold">الكابتن أحمد</p>
           <p className="text-slate-500 dark:text-slate-300">يصل خلال 15 دقيقة</p>
        </div>
     </div>

     <div className="flex justify-between relative">
        <div className="absolute top-2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 z-0"></div>
        {['تم الطلب', 'المطعم', 'في الطريق', 'واصل'].map((step, i) => (
           <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 ${i <= 2 ? 'bg-primary border-primary' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}></div>
              <span className={`text-[10px] ${i <= 2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step}</span>
           </div>
        ))}
     </div>
  </div>
);

// --- MAIN PAGE ---

export const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState<MarketplaceCategory>('cars');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return ITEMS.filter(item => 
      item.category === activeCategory &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeCategory, searchQuery]);

  const addToCart = (item: MarketplaceItem) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      if (exist) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) return { ...i, quantity: Math.max(0, i.quantity + delta) };
      return i;
    }).filter(i => i.quantity > 0));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
         
         {/* Search & Category Nav */}
         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-4 shadow-2xl mb-8">
            <div className="relative mb-6">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="ابحث عن سيارة، مطعم، أو منتج..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pr-12 pl-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
               />
            </div>
            
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
               {CATEGORIES.map(cat => (
                 <button
                   key={cat.id}
                   onClick={() => setActiveCategory(cat.id)}
                   className={`flex flex-col items-center gap-2 min-w-[5.5rem] p-3 rounded-2xl transition-all duration-300 border border-transparent ${
                     activeCategory === cat.id 
                       ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105 border-white/10' 
                       : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                   }`}
                 >
                   <cat.icon size={24} className={activeCategory === cat.id ? 'animate-bounce' : ''} />
                   <span className="text-xs font-bold whitespace-nowrap">{cat.label}</span>
                 </button>
               ))}
            </div>
         </div>

         {/* Layout Grid */}
         <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content */}
            <div className="flex-1">
               <SectionHeader 
                  title={CATEGORIES.find(c => c.id === activeCategory)?.label || ''} 
                  action={<button className="text-primary text-sm font-bold hover:underline">عرض الكل</button>}
               />

               <div className="min-h-[400px]">
                 {filteredItems.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                       <Search size={48} className="mx-auto mb-4" />
                       <p>لا توجد نتائج</p>
                    </div>
                 ) : (
                    <>
                      {activeCategory === 'cars' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {filteredItems.map(item => <CarCard key={item.id} item={item} onOpen={setSelectedItem} />)}
                        </div>
                      )}
                      
                      {activeCategory === 'food' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredItems.map(item => <FoodCard key={item.id} item={item} onAdd={addToCart} />)}
                        </div>
                      )}

                      {activeCategory === 'supermarket' && (
                         <SupermarketGrid items={filteredItems} onAdd={addToCart} />
                      )}

                      {/* Default Fallback Grid for others */}
                      {!['cars', 'food', 'supermarket'].includes(activeCategory) && (
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                           {filteredItems.map(item => (
                              <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white dark:bg-white/5 rounded-2xl p-4 hover:shadow-lg dark:hover:bg-white/10 transition cursor-pointer border border-slate-200 dark:border-white/5">
                                 <img src={item.image} className="w-full h-40 object-cover rounded-xl mb-4" alt="" />
                                 <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                                 <p className="text-primary font-bold">{item.price.toLocaleString()} {item.currency}</p>
                              </div>
                           ))}
                         </div>
                      )}
                    </>
                 )}
               </div>
            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block w-80 space-y-6">
               <div className="sticky top-24 space-y-6">
                  {/* Mini Cart Widget */}
                  <div className="bg-white/90 dark:bg-secondary/60 backdrop-blur border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xl">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">السلة السريعة</h3>
                        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{cart.reduce((a,b)=>a+b.quantity,0)}</span>
                     </div>
                     {cart.length > 0 ? (
                        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                           {cart.map(i => (
                              <div key={i.id} className="flex justify-between text-sm">
                                 <span className="text-slate-600 dark:text-slate-300 line-clamp-1">{i.title}</span>
                                 <span className="text-slate-900 dark:text-white font-bold">x{i.quantity}</span>
                              </div>
                           ))}
                        </div>
                     ) : <p className="text-slate-500 text-sm mb-4">السلة فارغة</p>}
                     <button onClick={() => setIsCartOpen(true)} className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-primary font-bold rounded-xl transition">
                        عرض التفاصيل
                     </button>
                  </div>

                  {/* Active Order Tracking (Mock) */}
                  <OrderTrackingView />
                  
                  {/* Daily Promo */}
                  <div className="bg-gradient-to-br from-accent to-red-900 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg">
                     <div className="relative z-10">
                        <span className="bg-white/20 text-xs px-2 py-1 rounded mb-2 inline-block">Flash Sale</span>
                        <h3 className="text-2xl font-black mb-1">خصم 50%</h3>
                        <p className="text-sm opacity-90 mb-4">على جميع طلبات المطاعم اليوم!</p>
                        <button className="bg-white text-accent px-4 py-2 rounded-lg text-sm font-bold shadow-lg">اطلب الآن</button>
                     </div>
                     <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400" className="absolute -right-10 -bottom-10 w-40 h-40 object-cover rounded-full opacity-50 group-hover:scale-110 transition-transform" alt="" />
                  </div>
               </div>
            </div>
         </div>

      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedItem && <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={addToCart} />}
      </AnimatePresence>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQty={updateQty} />

    </div>
  );
};
