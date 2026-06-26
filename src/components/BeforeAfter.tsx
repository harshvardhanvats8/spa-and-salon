import React, { useState } from "react";
import { Star, ShieldCheck, Eye, Sparkles, MessageCircle, Heart, Film } from "lucide-react";
import { motion } from "motion/react";

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const handleMove = (clientX: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, container);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 || isResizing) {
      const container = e.currentTarget.getBoundingClientRect();
      handleMove(e.clientX, container);
    }
  };

  const reviews = [
    {
      name: "Eleanor Vance",
      service: "The Really Good Facial",
      rating: 5,
      date: "Jun 24, 2026",
      quote: "My favorite stress reliever. There's nothing like ending the month with a visit to LXNARIA. The atmosphere is so calming, the staff are always attentive, and I leave feeling like a new person."
    },
    {
      name: "Sebastian Mercer",
      service: "Men's Royal Grooming",
      rating: 5,
      date: "Jun 25, 2026",
      quote: "Absolute precision barbering. The hot towel steam and scalp acupressure is unmatched in luxury. Feels like a 5-star hotel treatment room."
    },
    {
      name: "Genevieve Thorne",
      service: "Dermaplaning Radiance",
      rating: 5,
      date: "Jun 23, 2026",
      quote: "Instantly removed my dry skin texture and dry peach fuzz. Skincare absorption has tripled. A flawless luxury cosmetic base."
    }
  ];

  const reels = [
    { title: "Couture Balayage Glaze", views: "145K", img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400" },
    { title: "Skin Barrier PURGE Ritual", views: "89K", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=400" },
    { title: "Cryo Globe Eye Sculpt", views: "210K", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400" }
  ];

  return (
    <section id="lxnaria-gallery" className="py-24 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 tracking-[0.5em] uppercase">
            BEFORE &amp; AFTER DYNAMICS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2 tracking-widest uppercase">
            REAL <span className="font-sans italic font-light lowercase">transformations</span>
          </h2>
          <div className="w-12 h-[1px] bg-amber-500 mt-4"></div>
          <p className="mt-4 text-xs text-neutral-500 max-w-md font-light leading-relaxed">
            Real results, no filters, no retouching. See the profound cellular differences 
            unlocked by LXNARIA clinical therapies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left: Interactive Comparison Slider */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-serif text-2xl tracking-wide">Slide to View Cellular Renewal</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-md">
              Witness the skin micro-texture improvement immediately following **The Really Good Facial**. 
              Note the deep hydration, refined pores, and diminished cheek vascular lines.
            </p>

            <div
              className="relative h-96 w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-neutral-200 dark:border-neutral-800 shadow-xl"
              onTouchMove={handleTouchMove}
              onMouseMove={handleMouseMove}
              onMouseDown={() => setIsResizing(true)}
              onMouseUp={() => setIsResizing(false)}
              onMouseLeave={() => setIsResizing(false)}
            >
              {/* BEFORE IMAGE - Base */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800"
                  alt="Skin texture before treatment"
                  className="w-full h-full object-cover pointer-events-none filter saturate-50 contrast-125"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 left-4 bg-neutral-950/70 backdrop-blur-sm text-[10px] font-mono tracking-widest uppercase text-neutral-400 px-3 py-1 rounded">
                  Before Treatment
                </span>
              </div>

              {/* AFTER IMAGE - Sliding Mask overlay */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
                  alt="Skin texture after treatment"
                  className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
                  style={{ width: "100%" }}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 left-4 bg-amber-500 text-neutral-950 text-[10px] font-mono tracking-widest uppercase font-semibold px-3 py-1 rounded whitespace-nowrap">
                  Post-Treatment Glow
                </span>
              </div>

              {/* SLIDER HANDLE LINE */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-10"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-neutral-950 shadow-md flex items-center justify-center border border-neutral-200">
                  <span className="text-xs font-bold">⇄</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Reels/Video Transformation placeholder cards */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-serif text-2xl tracking-wide">Video Transformation Diaries</h3>
            <p className="text-xs text-neutral-500 font-light">Short behind-the-scenes transformations posted daily by our masters.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {reels.map((reel, idx) => (
                <div key={idx} className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden shadow-md relative group">
                  <div className="h-56 overflow-hidden relative">
                    <img src={reel.img} alt={reel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center">
                      <span className="p-2.5 bg-white/90 text-neutral-950 rounded-full">
                        <Film className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-serif text-xs font-semibold truncate">{reel.title}</p>
                    <p className="text-[9px] text-neutral-400 font-mono mt-0.5">{reel.views} Views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Masonry / Grid */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-16">
          <div className="flex flex-col items-center mb-10 text-center">
            <span className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 tracking-[0.5em] uppercase">
              REVIEWS
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif mt-2 tracking-widest uppercase">
              CUSTOMER <span className="font-sans italic font-light lowercase">diaries</span>
            </h3>
            <div className="w-12 h-[1px] bg-amber-500 mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-serif text-sm font-semibold">{rev.name}</h4>
                    <p className="text-[10px] font-sans font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase mt-0.5">{rev.service}</p>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed italic">
                  "{rev.quote}"
                </p>
                <div className="flex items-center gap-2 text-[10px] text-neutral-300 font-mono border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Verified Reservation • {rev.date}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
