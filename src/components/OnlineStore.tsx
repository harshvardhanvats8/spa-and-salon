import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, Star, CheckCircle, Trash2, X, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";

interface OnlineStoreProps {
  onToggleSaveService: (id: string) => void;
  savedServices: string[];
}

export default function OnlineStore({ onToggleSaveService, savedServices }: OnlineStoreProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Cart Management
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState<any>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading apothecary products:", err));
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const applyPromo = () => {
    if (!promoCode) return;
    setPromoError("");
    setPromoSuccess("");

    fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode })
    })
      .then((r) => {
        if (!r.ok) throw new Error("Invalid promo");
        return r.json();
      })
      .then((data) => {
        setPromoDiscount(data.coupon);
        setPromoSuccess(`${data.coupon.desc} successfully applied!`);
      })
      .catch(() => {
        setPromoError("Privilege code is invalid or expired.");
        setPromoDiscount(null);
      });
  };

  const checkout = () => {
    setCheckoutComplete(true);
    setCart([]);
    setPromoCode("");
    setPromoDiscount(null);
    setPromoSuccess("");
    setTimeout(() => {
      setCheckoutComplete(false);
      setIsCartOpen(false);
    }, 4000);
  };

  const getCartTotals = () => {
    const itemsTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    let discount = 0;
    if (promoDiscount) {
      if (promoDiscount.type === "percent") {
        discount = (itemsTotal * promoDiscount.discount) / 100;
      } else {
        discount = promoDiscount.discount;
      }
    }
    return {
      itemsTotal,
      discount,
      finalTotal: Math.max(0, itemsTotal - discount)
    };
  };

  const totals = getCartTotals();

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const categories = ["all", "Skin Care", "Luxury Skin Care", "Styling Tech"];

  return (
    <section id="lxnaria-store" className="py-24 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Editorial Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 tracking-[0.5em] uppercase">
            APOTHECARY STORE
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2 tracking-widest uppercase">
            THE <span className="font-sans italic font-light lowercase">apothecary</span>
          </h2>
          <div className="w-12 h-[1px] bg-amber-500 mt-4"></div>
          <p className="mt-4 text-xs text-neutral-500 max-w-md font-light leading-relaxed">
            Curated daily skin rituals and advanced styling tech used on our clinic floor, 
            shipped globally with carbon-neutral delivery.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[10px] font-sans font-bold tracking-widest uppercase rounded border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border-neutral-950"
                    : "border-neutral-100 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box & Shopping Cart Counter */}
          <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
            <div className="relative flex-grow md:w-64">
              <input
                type="text"
                placeholder="Search apothecary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2.5 pl-9 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded text-xs leading-normal"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-600 dark:text-neutral-300 hover:text-amber-500 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-[9px] font-bold text-neutral-950 flex items-center justify-center animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="text-sm font-sans tracking-widest text-neutral-400 animate-pulse">Aligning apothecary jars...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => {
              const isSaved = savedServices.includes(p.id);
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl p-4 relative group flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:border-neutral-200 dark:hover:border-neutral-700/80"
                >
                  <button
                    onClick={() => onToggleSaveService(p.id)}
                    className="absolute top-6 right-6 p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-full border border-neutral-100 dark:border-neutral-700 shadow-sm text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 z-10 transition-all cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500 text-rose-500 animate-[pulse_1s_infinite]" : ""}`} />
                  </button>

                  <div className="space-y-5">
                    {/* Editorial Aspect Ratio Card Container */}
                    <div className="h-56 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-950 relative flex items-center justify-center border border-neutral-100/50 dark:border-neutral-800/30">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-neutral-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    <div className="space-y-1.5 px-1">
                      <span className="text-[9px] font-sans font-bold text-amber-600 dark:text-amber-500 tracking-[0.2em] uppercase block">{p.brand}</span>
                      <h3 className="font-serif text-sm font-semibold tracking-wide leading-snug h-10 line-clamp-2 text-neutral-800 dark:text-neutral-150">{p.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">{p.rating}</span>
                        <span className="text-neutral-400 dark:text-neutral-500">({p.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 px-1 flex items-center justify-between">
                    <span className="text-base font-serif font-bold text-neutral-900 dark:text-white">${p.price}</span>
                    <button
                      onClick={() => addToCart(p)}
                      className="px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-sans font-extrabold tracking-[0.15em] uppercase rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      Add To Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Cart Slider Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950 z-50 cursor-pointer"
              onClick={() => setIsCartOpen(false)}
            ></motion.div>

            {/* Slide-out cart right panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-950 z-50 shadow-2xl border-l border-neutral-100 dark:border-neutral-800 overflow-y-auto"
            >
              <div className="p-8 h-full flex flex-col justify-between">
                
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-amber-600" />
                      <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase">
                        YOUR APOTHECARY BAG
                      </span>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Cart Items list */}
                  {checkoutComplete ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif text-lg font-medium">Checkout Complete</h4>
                        <p className="text-xs text-neutral-400 font-light">Thank you for your order. Shipped carbon-neutral.</p>
                      </div>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="py-20 text-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto" />
                      <p className="text-xs text-neutral-400 italic">Your apothecary bag is empty.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl items-center justify-between">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-12 h-12 object-cover bg-neutral-150 dark:bg-neutral-950 rounded-lg" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="flex-grow min-w-0">
                            <h5 className="font-serif text-xs font-medium truncate">{item.product.name}</h5>
                            <p className="text-[10px] text-neutral-400 font-light mt-0.5">{item.quantity} x ${item.product.price}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="p-1 hover:text-rose-500 cursor-pointer">
                            <Trash2 className="w-4 h-4 text-neutral-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer with totals and promo code */}
                {cart.length > 0 && !checkoutComplete && (
                  <div className="space-y-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    {/* Promo coupon input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block">Privilege Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. LXNARIAGLOW"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="flex-grow p-2.5 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded text-xs"
                        />
                        <button onClick={applyPromo} className="px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs rounded uppercase font-semibold">
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="text-[9px] text-rose-500">{promoError}</p>}
                      {promoSuccess && <p className="text-[9px] text-emerald-500">{promoSuccess}</p>}
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between text-neutral-500">
                        <span>Items Subtotal:</span>
                        <span className="font-semibold text-neutral-900 dark:text-white">${totals.itemsTotal}</span>
                      </div>
                      {totals.discount > 0 && (
                        <div className="flex justify-between text-neutral-500">
                          <span>Discount Applied:</span>
                          <span className="font-semibold text-emerald-600">-${totals.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-baseline border-t border-neutral-100 dark:border-neutral-800 pt-4">
                        <span className="text-sm font-serif font-bold text-neutral-950 dark:text-white">Order Total:</span>
                        <span className="text-xl font-serif font-bold text-amber-600">${totals.finalTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={checkout}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded-lg shadow-md cursor-pointer"
                    >
                      Proceed to Secure One-Click Checkout
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
