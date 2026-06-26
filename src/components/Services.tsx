import React, { useState, useEffect } from "react";
import { Clock, DollarSign, Star, ChevronRight, HelpCircle, X, Sparkles, CheckCircle, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Service } from "../types";

interface ServicesProps {
  onOpenBooking: (serviceId?: string) => void;
  savedServices: string[];
  onToggleSaveService: (serviceId: string) => void;
}

export default function Services({ onOpenBooking, savedServices, onToggleSaveService }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading services:", err));
  }, []);

  const categories = [
    { id: "all", label: "ALL", count: services.length },
    { id: "skin", label: "SKIN CARE", count: services.filter(s => s.category === "skin").length },
    { id: "spa", label: "BODY RITUALS", count: services.filter(s => s.category === "spa").length },
    { id: "hair", label: "HAIR TREATMENTS", count: services.filter(s => s.category === "hair").length },
    { id: "grooming", label: "MEN GROOMING", count: services.filter(s => s.category === "grooming").length }
  ];

  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter((s) => s.category === selectedCategory);

  return (
    <section id="lxnaria-services" className="py-24 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Editorial Title */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 tracking-[0.5em] uppercase">
            SERVICES
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2 tracking-widest uppercase">
            OUR <span className="font-sans italic font-light lowercase">services</span>
          </h2>
          <div className="w-12 h-[1px] bg-amber-500 mt-4"></div>
          <p className="mt-4 text-xs text-neutral-500 max-w-md font-light leading-relaxed">
            Inspired by nature, light, and the soft rhythm of self-care. 
            Designed to restore balance, nourish deeply, and reveal your natural radiance.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 border text-xs font-sans tracking-widest uppercase font-medium rounded-md transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-md"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
              }`}
            >
              {cat.label}
              <span className={`text-[9px] font-mono rounded-full px-1.5 py-0.5 ${
                selectedCategory === cat.id ? "bg-amber-600 dark:bg-amber-100 text-white dark:text-neutral-900" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="text-sm font-sans tracking-widest text-neutral-400 animate-pulse">Loading treatments...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const isSaved = savedServices.includes(service.id);
              return (
                <motion.div
                  key={service.id}
                  layoutId={`service-card-${service.id}`}
                  className="bg-neutral-50 dark:bg-neutral-900/65 border border-neutral-100 dark:border-neutral-800 rounded-xl p-6 relative group hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  {/* Save/Favorite Heart trigger */}
                  <button
                    onClick={() => onToggleSaveService(service.id)}
                    className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-800 rounded-full border border-neutral-100 dark:border-neutral-700 shadow-sm text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>

                  <div className="space-y-4">
                    <span className="text-[10px] font-sans font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
                      {service.category} CARE
                    </span>
                    
                    <h3 className="font-serif text-lg font-medium text-neutral-950 dark:text-white group-hover:text-amber-600 transition-colors">
                      {service.name}
                    </h3>
                    
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium pt-2 text-neutral-600 dark:text-neutral-300 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        {service.duration}
                      </span>
                      <span className="flex items-center gap-0.5 text-neutral-900 dark:text-white font-semibold">
                        <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                        {service.price}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-[10px] font-sans font-bold tracking-widest uppercase rounded-md transition-colors cursor-pointer shadow-sm"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => setSelectedService(service)}
                      className="px-3 py-2 text-[10px] font-sans font-bold tracking-widest uppercase text-neutral-500 hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Learn More <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Slide-out Editorial Drawer matching Mockup 4 */}
      <AnimatePresence>
        {selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950 z-50 cursor-pointer"
              onClick={() => setSelectedService(null)}
            ></motion.div>

            {/* Left slide-out panel (exactly as in Mockup 4 side card layout) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed top-0 left-0 h-full w-full max-w-md bg-white dark:bg-neutral-950 z-50 shadow-2xl border-r border-neutral-100 dark:border-neutral-800 overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                
                {/* Header controls */}
                <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-amber-600 dark:text-amber-500 uppercase">
                    TREATMENT OVERVIEW
                  </span>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                {/* Cover Image */}
                <div className="h-48 overflow-hidden rounded-xl relative">
                  <img
                    src={selectedService.beforeAfterGallery?.[0] || "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600"}
                    alt={selectedService.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-[9px] font-mono tracking-widest uppercase bg-amber-600 px-2 py-0.5 rounded">
                      4.9★ RATING
                    </span>
                  </div>
                </div>

                {/* Treatment Main Titles */}
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-medium tracking-tight">
                    {selectedService.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <span className="text-amber-700 dark:text-amber-400 font-serif">
                      ${selectedService.price}
                    </span>
                    <span className="text-neutral-400">|</span>
                    <span className="text-neutral-500 font-sans font-light flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      {selectedService.duration}
                    </span>
                  </div>
                </div>

                {/* Treatment details */}
                <div className="space-y-6 text-sm font-light">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400">Description</h4>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {selectedService.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400">Suitable For</h4>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
                      {selectedService.suitableFor}
                    </p>
                  </div>

                  {/* What is involved / Benefits list */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400">What's Involved &amp; Benefits</h4>
                    <ul className="space-y-2">
                      {selectedService.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                          <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Products Used */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400">Apothecary Products Used</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedService.productsUsed.map((prod, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-[10px] font-sans tracking-wide text-neutral-500 rounded">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Add-ons */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400">Suggested Add-on Services</h4>
                    <div className="space-y-2">
                      {selectedService.addOns.map((add, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded">
                          <span className="text-xs text-neutral-600 dark:text-neutral-300">{add.name}</span>
                          <span className="text-xs font-semibold text-amber-600">+${add.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Drawer Booking CTA - Black Block layout like mockup 4 */}
                <button
                  onClick={() => {
                    onOpenBooking(selectedService.id);
                    setSelectedService(null);
                  }}
                  className="w-full py-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-sans font-bold tracking-widest uppercase rounded-lg transition-colors cursor-pointer text-xs flex justify-center items-center shadow-lg hover:bg-neutral-900 dark:hover:bg-neutral-100"
                >
                  Book an Appointment
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
