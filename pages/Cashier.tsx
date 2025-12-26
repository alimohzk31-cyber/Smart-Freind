
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, Search, Plus, Minus, Trash2, CreditCard, Banknote, 
  Printer, Save, Barcode, X, Check, Clock, User, Users, DollarSign, 
  TrendingUp, AlertTriangle, ChevronRight, Filter, Percent, 
  Utensils, Pill, LayoutGrid, RefreshCw, Power, Receipt, 
  History, Calculator, UserPlus, Star, Package, Wallet, 
  ArrowDownCircle, ArrowUpCircle, FileText, Settings, ChevronLeft,
  Edit3, Image as ImageIcon, Box, Truck, BadgeDollarSign, ShieldAlert,
  Menu, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  POSProduct, POSCartItem, POSMode, 
  Shift, Customer 
} from '../types';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area
} from 'recharts';

// --- بيانات تجريبية (نظام المربع) ---
const INITIAL_PRODUCTS: POSProduct[] = [
  { id: '1', name: 'ايفون 15 برو ماكس 256', category: 'موبايلات', price: 1650000, wholesalePrice: 1600000, costPrice: 1550000, stock: 12, unit: 'قطعة', barcode: 'IP15PM', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'شاحن أنكر 20 واط', category: 'اكسسوارات', price: 25000, wholesalePrice: 18000, costPrice: 12000, stock: 150, unit: 'قطعة', barcode: 'ANK20', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'لابتوب ديل XPS 15', category: 'حاسبات', price: 2100000, wholesalePrice: 2000000, costPrice: 1900000, stock: 5, unit: 'قطعة', barcode: 'DELLXPS', image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'كابل شحن تايب سي', category: 'اكسسوارات', price: 5000, wholesalePrice: 3000, costPrice: 1500, stock: 500, unit: 'قطعة', barcode: 'CABLEC', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200' },
  { id: '5', name: 'سماعة ايربودز برو 2', category: 'صوتيات', price: 320000, wholesalePrice: 290000, costPrice: 260000, stock: 25, unit: 'قطعة', barcode: 'AIRPRO2', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200' },
];

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'شركة النور للاتصالات', phone: '07701234567', type: 'Wholesale', loyaltyPoints: 2450, balance: -1500000, creditLimit: 5000000, address: 'بغداد - شارع الربيعي' },
  { id: 'c2', name: 'أحمد جاسم (زبون مفرد)', phone: '07809988776', type: 'Retail', loyaltyPoints: 150, balance: 0, creditLimit: 0, address: '-' },
  { id: 'c3', name: 'مكتب الرافدين', phone: '07901122334', type: 'Wholesale', loyaltyPoints: 5000, balance: -4500000, creditLimit: 10000000, address: 'البصرة - الجزائر' },
];

// --- المكونات الفرعية ---

const ReceiptComponent = ({ cart, total, subtotal, discount, transactionId, customer, pricingTier, profit }: any) => (
  <div className="bg-white p-6 text-black font-mono text-[12px] w-[80mm] mx-auto shadow-sm border border-slate-200 receipt-container">
    <div className="text-center mb-4 border-b-2 border-black pb-2">
      <h2 className="text-xl font-black uppercase tracking-tight">المربع التجارية</h2>
      <p className="text-[10px] font-bold">وكلاء معتمدون • تجارة عامة</p>
      <p className="text-[10px] mt-1">بغداد - شارع الصناعة - 07700000000</p>
    </div>
    <div className="border-b border-dashed border-slate-400 mb-2 py-2">
      <div className="flex justify-between"><span>رقم القائمة:</span> <span className="font-bold">#{transactionId}</span></div>
      <div className="flex justify-between"><span>التاريخ:</span> <span>{new Date().toLocaleString('ar-IQ')}</span></div>
      <div className="flex justify-between"><span>العميل:</span> <span className="font-bold">{customer?.name || 'زبون نقدي'}</span></div>
      <div className="flex justify-between"><span>نوع البيع:</span> <span>{pricingTier === 'wholesale' ? 'جملة' : 'مفرد'}</span></div>
    </div>
    <div className="space-y-1 mb-4">
      {cart.map((item: any) => (
        <div key={item.id} className="flex justify-between items-end border-b border-slate-100 pb-1">
          <div className="flex flex-col">
             <span className="font-bold">{item.name}</span>
             <span className="text-[9px] text-slate-600">{item.quantity} {item.unit || 'x'} * {item.appliedPrice.toLocaleString()}</span>
          </div>
          <span className="font-bold">{(item.appliedPrice * item.quantity).toLocaleString()}</span>
        </div>
      ))}
    </div>
    <div className="border-t-2 border-black pt-2 space-y-1">
      <div className="flex justify-between"><span>المجموع:</span> <span>{subtotal.toLocaleString()}</span></div>
      {discount > 0 && <div className="flex justify-between text-black"><span>الخصم:</span> <span>-{discount.toLocaleString()}</span></div>}
      <div className="flex justify-between text-lg font-black border-t border-slate-400 mt-1 pt-1">
        <span>الصافي:</span>
        <span>{total.toLocaleString()}</span>
      </div>
    </div>
    <div className="mt-6 text-center text-[10px] font-bold">
      شكراً لتعاملكم معنا • البضاعة المباعة لا ترد
    </div>
    <div className="flex justify-center mt-2">
       <img src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${transactionId}`} alt="QR" />
    </div>
  </div>
);

const ProductFormModal = ({ isOpen, onClose, initialData, onSave }: any) => {
  const [formData, setFormData] = useState(initialData || { name: '', price: 0, wholesalePrice: 0, costPrice: 0, stock: 0, category: 'عام', barcode: '', unit: 'قطعة' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{initialData ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition"><X size={28} /></button>
        </div>
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="col-span-1 md:col-span-2">
                 <label className="text-xs font-black text-slate-500 mb-2 block uppercase">اسم المنتج</label>
                 <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white" />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-500 mb-2 block uppercase">الباركود</label>
                 <div className="flex gap-2">
                    <input type="text" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none font-mono text-slate-900 dark:text-white" />
                    <button className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"><Barcode size={24} /></button>
                 </div>
              </div>
              <div>
                 <label className="text-xs font-black text-slate-500 mb-2 block uppercase">الوحدة</label>
                 <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none text-slate-900 dark:text-white">
                    <option>قطعة</option>
                    <option>كرتون</option>
                    <option>كيلوغرام</option>
                    <option>متر</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs font-black text-slate-500 mb-2 block uppercase">سعر التكلفة (الشراء)</label>
                 <input type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})} className="w-full p-4 bg-red-50 dark:bg-red-900/10 border-none rounded-2xl font-bold outline-none text-red-600" />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-500 mb-2 block uppercase">الكمية الحالية</label>
                 <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none text-slate-900 dark:text-white" />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-500 mb-2 block uppercase">سعر البيع (مفرد)</label>
                 <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-4 bg-blue-50 dark:bg-blue-900/10 border-none rounded-2xl font-bold outline-none text-blue-600" />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-500 mb-2 block uppercase">سعر البيع (جملة)</label>
                 <input type="number" value={formData.wholesalePrice} onChange={e => setFormData({...formData, wholesalePrice: Number(e.target.value)})} className="w-full p-4 bg-amber-50 dark:bg-amber-900/10 border-none rounded-2xl font-bold outline-none text-amber-600" />
              </div>
           </div>
        </div>
        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-950 flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold border border-slate-200 dark:border-slate-700">إلغاء</button>
           <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700">حفظ المنتج</button>
        </div>
      </motion.div>
    </div>
  );
};

export const Cashier = () => {
  // State Management
  const [activeView, setActiveView] = useState<'dashboard' | 'sales' | 'customers' | 'inventory' | 'reports'>('dashboard');
  const [products, setProducts] = useState<POSProduct[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [cart, setCart] = useState<POSCartItem[]>([]);
  
  // Sales State
  const [searchQuery, setSearchQuery] = useState('');
  const [pricingTier, setPricingTier] = useState<'retail' | 'wholesale'>('retail');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [discount, setDiscount] = useState(0);
  
  // Modals & Drawers
  const [showPayment, setShowPayment] = useState(false);
  const [productModal, setProductModal] = useState({ isOpen: false, data: null as any });
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Dashboard Stats
  const totalSalesToday = 4500000;
  const totalProfitToday = 850000;
  const lowStockCount = products.filter(p => p.stock < 10).length;

  // Derived Values
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery)
    );
  }, [products, searchQuery]);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + (i.appliedPrice * i.quantity), 0), [cart]);
  const totalProfit = useMemo(() => cart.reduce((s, i) => s + ((i.appliedPrice - (i.costPrice || 0)) * i.quantity), 0), [cart]);
  const total = Math.max(0, subtotal - discount);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Handlers
  const addToCart = (product: POSProduct) => {
    if (product.stock <= 0) {
      alert("⚠️ المنتج نافذ من المخزن!");
      return;
    }
    const price = pricingTier === 'wholesale' ? (product.wholesalePrice || product.price) : product.price;
    
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1, appliedPrice: price } : i);
      }
      return [...prev, { ...product, quantity: 1, appliedPrice: price }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) return { ...i, quantity: Math.max(1, i.quantity + delta) };
      return i;
    }));
  };

  const handlePricingTierChange = (tier: 'retail' | 'wholesale') => {
    setPricingTier(tier);
    // Update cart prices
    setCart(prev => prev.map(item => ({
      ...item,
      appliedPrice: tier === 'wholesale' ? (item.wholesalePrice || item.price) : item.price
    })));
  };

  const finalizeSale = (method: 'CASH' | 'CREDIT') => {
    if (method === 'CREDIT') {
      if (!selectedCustomer) {
        alert("⚠️ يجب اختيار عميل للبيع الآجل");
        return;
      }
      if (selectedCustomer.balance + total < -(selectedCustomer.creditLimit || 0)) {
        alert(`⚠️ تجاوز الحد الائتماني! المتبقي: ${(-(selectedCustomer.creditLimit || 0) - selectedCustomer.balance).toLocaleString()}`);
        return;
      }
      // Update customer balance
      setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, balance: c.balance - total } : c));
    }

    // Reduce stock
    setProducts(prev => prev.map(p => {
      const inCart = cart.find(c => c.id === p.id);
      if (inCart) return { ...p, stock: p.stock - inCart.quantity };
      return p;
    }));

    setShowPayment(false);
    setCart([]);
    setDiscount(0);
    // In real app, save invoice here
    alert(`تم حفظ الفاتورة بنجاح (${method === 'CASH' ? 'نقدي' : 'آجل'}). الربح: ${totalProfit.toLocaleString()}`);
  };

  const handleSaveProduct = (data: any) => {
    if (productModal.data) {
      setProducts(prev => prev.map(p => p.id === productModal.data.id ? { ...p, ...data } : p));
    } else {
      setProducts(prev => [{ ...data, id: Date.now().toString(), image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200' }, ...prev]);
    }
  };

  // Reusable Cart Content Component
  const CartContent = () => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between items-center">
            <div>
                <h2 className="font-black text-xl text-slate-900 dark:text-white">فاتورة البيع</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pricingTier === 'wholesale' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-500' : 'bg-blue-500/20 text-blue-600 dark:text-blue-500'}`}>
                    {pricingTier === 'wholesale' ? 'تسعير الجملة' : 'تسعير المفرد'}
                </span>
            </div>
            <div className="flex gap-2">
                {/* Close Button for Mobile only */}
                <button onClick={() => setShowMobileCart(false)} className="p-2 lg:hidden bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-slate-900 dark:hover:text-white transition">
                    <X size={18} />
                </button>
                <button onClick={() => setCart([])} className="p-2 bg-red-50 dark:bg-slate-800 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>

        {/* Customer Select */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select 
                value={selectedCustomer?.id || ''}
                onChange={(e) => setSelectedCustomer(MOCK_CUSTOMERS.find(c => c.id === e.target.value) || null)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-12 pl-4 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 appearance-none"
                >
                    <option value="">زبون نقدي عام</option>
                    {MOCK_CUSTOMERS.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.type === 'Wholesale' ? 'جملة' : 'مفرد'})</option>
                    ))}
                </select>
                {selectedCustomer && (
                    <div className="mt-2 flex justify-between text-[10px] px-2">
                    <span className="text-slate-500 dark:text-slate-400">الرصيد الحالي:</span>
                    <span className={`font-mono font-bold ${selectedCustomer.balance < 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                        {selectedCustomer.balance.toLocaleString()}
                    </span>
                    </div>
                )}
            </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-100/50 dark:bg-black/20">
            <AnimatePresence>
                {cart.map(item => (
                    <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-3 group shadow-sm"
                    >
                    <img src={item.image} className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-900" alt="" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.name}</h4>
                            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{(item.appliedPrice * item.quantity).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-800 rounded hover:bg-blue-600 hover:text-white text-slate-600 dark:text-white transition shadow-sm"><Plus size={12} /></button>
                                <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-white">{item.quantity}</span>
                                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition shadow-sm"><Minus size={12} /></button>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                                {item.appliedPrice.toLocaleString()} / {item.unit}
                            </div>
                        </div>
                    </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {/* Totals & Action */}
        <div className="p-4 md:p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pb-24 lg:pb-6">
            <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 font-bold">
                    <span>المجموع</span>
                    <span className="font-mono text-slate-900 dark:text-white">{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-red-500 dark:text-red-400 font-bold cursor-pointer" onClick={() => setDiscount(5000)}>
                    <span>خصم</span>
                    <span className="font-mono">-{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white">الإجمالي النهائي</span>
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{total.toLocaleString()}</span>
                </div>
                <div className="text-right text-[10px] text-slate-500 dark:text-slate-600 font-mono">
                    الربح المتوقع: {totalProfit.toLocaleString()}
                </div>
            </div>

            <button 
                onClick={() => setShowPayment(true)}
                disabled={cart.length === 0}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale active:scale-95"
            >
                <span>الدفع والطباعة</span>
                <ChevronRight className="rtl:rotate-180" />
            </button>
        </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-500 text-slate-900 dark:text-slate-100">
      
      {/* 1. Header (Al-Morabba Identity) */}
      <nav className="h-16 md:h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-40 shadow-sm dark:shadow-xl">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 transform hover:rotate-12 transition">
               <Box size={24} className="md:w-7 md:h-7" />
            </div>
            <div>
               <h1 className="font-black text-xl md:text-2xl text-slate-900 dark:text-white tracking-tight">المربع <span className="text-amber-500 dark:text-amber-400">التجاري</span></h1>
               <span className="text-[8px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden md:block">Commercial Sales System v2.0</span>
            </div>
         </div>

         <div className="flex bg-slate-100 dark:bg-slate-800 p-1 md:p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar max-w-[50vw] md:max-w-none">
            {[
              { id: 'dashboard', label: 'الرئيسية', icon: LayoutGrid },
              { id: 'sales', label: 'البيع', icon: ShoppingBag },
              { id: 'customers', label: 'العملاء', icon: Users },
              { id: 'inventory', label: 'المخزن', icon: Package },
              { id: 'reports', label: 'التقارير', icon: FileText },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${activeView === tab.id ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'}`}
              >
                <tab.icon size={16} className="md:w-[18px] md:h-[18px]" /> <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
         </div>

         <div className="flex items-center gap-3">
            <div className="hidden xl:flex flex-col items-end mr-4">
               <span className="text-xs font-bold text-slate-500 dark:text-slate-400">وردية: أحمد علي</span>
               <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">08:00 AM - OPEN</span>
            </div>
            <button className="p-2 md:p-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-500 rounded-xl transition border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
               <Power size={18} className="md:w-5 md:h-5" />
            </button>
         </div>
      </nav>

      {/* 2. Main Content Layout */}
      <div className="flex-1 flex overflow-hidden relative">
         <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 relative pb-20 lg:pb-0 transition-colors">
            
            {/* --- DASHBOARD --- */}
            {activeView === 'dashboard' && (
               <div className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                     <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-500/20 dark:group-hover:bg-blue-600/30 transition"></div>
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-500 rounded-2xl"><DollarSign size={24} /></div>
                              <span className="text-xs font-bold bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg">+15%</span>
                           </div>
                           <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">مبيعات اليوم</p>
                           <h3 className="text-3xl font-black text-slate-900 dark:text-white">{totalSalesToday.toLocaleString()} <span className="text-sm font-medium text-slate-500">د.ع</span></h3>
                        </div>
                     </div>

                     <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/20 dark:group-hover:bg-amber-500/30 transition"></div>
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-2xl"><TrendingUp size={24} /></div>
                              <span className="text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg">ممتاز</span>
                           </div>
                           <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">صافي الأرباح</p>
                           <h3 className="text-3xl font-black text-slate-900 dark:text-white">{totalProfitToday.toLocaleString()} <span className="text-sm font-medium text-slate-500">د.ع</span></h3>
                        </div>
                     </div>

                     {/* Hidden on very small screens to save space if needed */}
                     <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-xl relative overflow-hidden group hidden sm:block">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/20 dark:group-hover:bg-red-500/30 transition"></div>
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-500 rounded-2xl"><AlertTriangle size={24} /></div>
                              <span className="text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded-lg">إجراء مطلوب</span>
                           </div>
                           <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">تنبيهات المخزون</p>
                           <h3 className="text-3xl font-black text-slate-900 dark:text-white">{lowStockCount} <span className="text-sm font-medium text-slate-500">مواد</span></h3>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2"><ArrowUpCircle className="text-blue-500" /> تحليل المبيعات الأسبوعي</h3>
                        <div className="h-60 md:h-80">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={[{name: 'Sat', v: 4000}, {name: 'Sun', v: 3000}, {name: 'Mon', v: 2000}, {name: 'Tue', v: 2780}, {name: 'Wed', v: 1890}, {name: 'Thu', v: 2390}, {name: 'Fri', v: 3490}]}>
                                 <defs>
                                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                       <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                 </defs>
                                 <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} />
                                 <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} />
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.2} />
                                 <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff'}} />
                                 <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* --- SALES (POS) --- */}
            {activeView === 'sales' && (
               <>
                  <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                     <div className="max-w-6xl flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 group w-full">
                           <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                           <input 
                             type="text" 
                             placeholder="بحث (اسم، باركود)..."
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                             className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-2xl py-3 md:py-4 pr-12 pl-4 text-slate-900 dark:text-white shadow-sm dark:shadow-inner outline-none transition-all font-bold text-base md:text-lg"
                           />
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                              <Barcode size={24} />
                           </div>
                        </div>
                        
                        {/* Pricing Tier Toggle */}
                        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 w-full md:w-auto">
                           <button 
                             onClick={() => handlePricingTierChange('retail')}
                             className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-xs font-black transition-all ${pricingTier === 'retail' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                           >
                              مفرد (Retail)
                           </button>
                           <button 
                             onClick={() => handlePricingTierChange('wholesale')}
                             className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-xs font-black transition-all ${pricingTier === 'wholesale' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                           >
                              جملة (Wholesale)
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-24 md:pb-6">
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
                        {filteredProducts.map(p => (
                           <motion.div 
                             key={p.id}
                             whileHover={{ y: -4 }}
                             whileTap={{ scale: 0.96 }}
                             onClick={() => addToCart(p)}
                             className="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-3 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 flex flex-col h-full cursor-pointer relative group shadow-md hover:shadow-xl transition-all"
                           >
                              <div className="absolute top-3 left-3 z-10">
                                 <span className={`px-2 py-1 rounded-lg text-[8px] md:text-[10px] font-black text-white ${p.stock > 10 ? 'bg-emerald-600' : p.stock > 0 ? 'bg-amber-600' : 'bg-red-600 animate-pulse'}`}>
                                    {p.stock} {p.unit}
                                 </span>
                              </div>
                              <div className="w-full aspect-square mb-3 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
                                 <img src={p.image} className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700" alt="" />
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm line-clamp-2 leading-tight px-1 mb-2">{p.name}</h4>
                              </div>
                              <div className="mt-auto flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2 md:p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                 <p className={`font-black text-xs md:text-sm ${pricingTier === 'wholesale' ? 'text-amber-600 dark:text-amber-500' : 'text-blue-600 dark:text-blue-500'}`}>
                                    {(pricingTier === 'wholesale' ? (p.wholesalePrice || p.price) : p.price).toLocaleString()}
                                 </p>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </>
            )}

            {/* --- CUSTOMERS, INVENTORY, REPORTS VIEWS REMAIN SIMILAR ... --- */}
            {activeView === 'customers' && (
               <div className="p-4 md:p-8 space-y-6 animate-fade-in pb-20 md:pb-8">
                  {/* ... Existing customers code ... */}
                  <div className="flex justify-between items-center">
                     <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3"><Users className="text-blue-500" /> إدارة العملاء</h2>
                     <button className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition text-sm">إضافة عميل</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {customers.map(customer => (
                        <div key={customer.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                           <div className="flex justify-between mb-4">
                              <h3 className="font-bold text-slate-900 dark:text-white">{customer.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded ${customer.balance < 0 ? 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
                                 {customer.balance.toLocaleString()}
                              </span>
                           </div>
                           <div className="flex gap-2">
                              <button className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition">كشف حساب</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            
            {activeView === 'inventory' && (
               <div className="p-4 md:p-8 space-y-6 animate-fade-in pb-20 md:pb-8">
                  <div className="flex justify-between items-center">
                     <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3"><Package className="text-amber-500" /> المخزون</h2>
                     <button onClick={() => setProductModal({ isOpen: true, data: null })} className="px-4 py-2 md:px-6 md:py-3 bg-amber-600 text-white rounded-2xl font-bold shadow-lg text-sm hover:bg-amber-700">إضافة منتج</button>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden overflow-x-auto shadow-sm">
                     <table className="w-full text-right min-w-[800px]">
                        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                           <tr>
                              <th className="p-6">المادة</th>
                              <th className="p-6 text-center">الكمية</th>
                              <th className="p-6 text-center text-blue-600 dark:text-blue-400">سعر المفرد</th>
                              <th className="p-6 text-center">إجراءات</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {products.map(p => (
                              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                 <td className="p-6 font-bold text-slate-900 dark:text-white">{p.name}</td>
                                 <td className="p-6 text-center text-slate-700 dark:text-slate-300">{p.stock}</td>
                                 <td className="p-6 text-center text-blue-600 dark:text-blue-400">{p.price.toLocaleString()}</td>
                                 <td className="p-6 text-center">
                                    <button onClick={() => setProductModal({ isOpen: true, data: p })} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><Edit3 size={18} /></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

         </main>

         {/* --- DESKTOP SIDEBAR (CART) --- */}
         <aside className="hidden lg:flex w-[400px] xl:w-[450px] bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col shadow-2xl relative z-30 transition-colors">
            <CartContent />
         </aside>

         {/* --- MOBILE CART DRAWER --- */}
         <AnimatePresence>
            {showMobileCart && (
               <>
                  <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }} 
                     exit={{ opacity: 0 }} 
                     onClick={() => setShowMobileCart(false)}
                     className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
                  />
                  <motion.div 
                     initial={{ y: '100%' }} 
                     animate={{ y: 0 }} 
                     exit={{ y: '100%' }} 
                     transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                     className="fixed bottom-0 left-0 right-0 h-[85vh] bg-slate-50 dark:bg-slate-900 rounded-t-[2.5rem] z-[110] lg:hidden flex flex-col shadow-2xl overflow-hidden border-t border-slate-200 dark:border-slate-800"
                  >
                     <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-4 mb-2"></div>
                     <CartContent />
                  </motion.div>
               </>
            )}
         </AnimatePresence>

         {/* --- MOBILE BOTTOM SUMMARY BAR --- */}
         {cart.length > 0 && activeView === 'sales' && !showMobileCart && (
            <motion.div 
               initial={{ y: 100 }} 
               animate={{ y: 0 }} 
               className="fixed bottom-0 left-0 right-0 p-4 z-50 lg:hidden"
            >
               <div className="bg-blue-600 rounded-2xl shadow-2xl p-4 flex justify-between items-center text-white" onClick={() => setShowMobileCart(true)}>
                  <div className="flex items-center gap-3">
                     <div className="bg-white/20 p-2 rounded-xl">
                        <ShoppingBag size={24} />
                     </div>
                     <div className="flex flex-col">
                        <span className="font-bold text-xs opacity-90">{cartItemCount} مواد في السلة</span>
                        <span className="font-black text-lg">{total.toLocaleString()} د.ع</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-sm bg-white/10 px-4 py-2 rounded-xl">
                     عرض السلة <ChevronLeft size={16} className="rtl:rotate-180" />
                  </div>
               </div>
            </motion.div>
         )}
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
         {showPayment && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
               >
                  {/* Preview - Hidden on small mobile to focus on payment */}
                  <div className="hidden md:flex w-[350px] bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-8 flex-col items-center overflow-y-auto">
                     <ReceiptComponent 
                        cart={cart} total={total} subtotal={subtotal} 
                        discount={discount} transactionId={Math.floor(100000 + Math.random() * 900000)} 
                        customer={selectedCustomer} pricingTier={pricingTier} profit={totalProfit}
                     />
                  </div>

                  {/* Payment Methods */}
                  <div className="flex-1 p-6 md:p-12 flex flex-col">
                     <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">إتمام العملية</h2>
                        <button onClick={() => setShowPayment(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition"><X size={24} /></button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-auto">
                        <button onClick={() => finalizeSale('CASH')} className="p-6 md:p-8 bg-emerald-600 hover:bg-emerald-500 rounded-[2rem] text-white flex flex-col items-center gap-4 transition group shadow-lg">
                           <Banknote size={48} className="group-hover:scale-110 transition-transform" />
                           <span className="text-2xl font-black">دفع نقدي (CASH)</span>
                           <span className="text-sm opacity-80 font-bold">استلام المبلغ كاملاً</span>
                        </button>
                        
                        <button onClick={() => finalizeSale('CREDIT')} className="p-6 md:p-8 bg-amber-500 hover:bg-amber-400 rounded-[2rem] text-white flex flex-col items-center gap-4 transition group shadow-lg">
                           <Wallet size={48} className="group-hover:scale-110 transition-transform" />
                           <span className="text-2xl font-black">بيع آجل (ذمة)</span>
                           <span className="text-sm opacity-80 font-bold">تسجيل على حساب العميل</span>
                        </button>
                     </div>

                     <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-between items-center mt-4">
                        <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">المبلغ المطلوب</span>
                        <span className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">{total.toLocaleString()} IQD</span>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}

         {productModal.isOpen && (
            <ProductFormModal 
               isOpen={productModal.isOpen} 
               onClose={() => setProductModal({ isOpen: false, data: null })} 
               initialData={productModal.data} 
               onSave={handleSaveProduct} 
            />
         )}
      </AnimatePresence>

    </div>
  );
};
