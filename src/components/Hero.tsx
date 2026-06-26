import React from "react";
import { Star, Clock, Calendar, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export default function Hero({ onOpenBooking, onExploreServices }: HeroProps) {
  // Check if open (e.g. 9 AM to 8 PM in local time is standard for LUNARIA)
  const isCurrentlyOpen = () => {
    const hours = new Date().getHours();
    return hours >= 9 && hours < 20;
  };

  return (
    <section id="lxnaria-hero" className="relative lg:h-[95vh] min-h-[720px] md:min-h-[820px] flex items-center justify-center overflow-hidden bg-neutral-900 text-white pt-24 pb-12 lg:pt-28 lg:pb-16">
      
      {/* Immersive Background Image with rich linear gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Salon Ambiance"
          className="w-full h-full object-cover object-center opacity-40 scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-900/50 to-neutral-950/90"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent"></div>
      </div>

      {/* Editorial Luxury Lighting Orbs (Sight Grabbers) */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[100px] mix-blend-screen pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-amber-600/5 blur-[90px] mix-blend-screen pointer-events-none" />

      {/* Floating circular luxury badge stamp (Rotating Credential Overlay) */}
      <div className="absolute top-1/4 right-1/3 w-40 h-40 pointer-events-none opacity-25 hidden xl:block z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 fill-current">
            <path id="badgePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
            <text className="text-[5px] tracking-[0.25em] font-sans font-bold uppercase">
              <textPath href="#badgePath" startOffset="0%">
                • LXNARIA SANCTUARY • SWISS CELLULAR EXCELLENCE • EST. 2021
              </textPath>
            </text>
          </svg>
          <div className="absolute text-amber-400 font-serif text-xs tracking-widest font-bold">LX</div>
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center py-6 md:py-10">
        
        {/* Left Column - Branding & Copy */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 lg:space-y-8">
          
          {/* Live Business Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3 px-4 py-2 bg-neutral-950/80 backdrop-blur-md border border-neutral-800/80 rounded-full text-[11px] tracking-widest uppercase font-medium"
          >
            <span className={`w-2 h-2 rounded-full ${isCurrentlyOpen() ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
            <span className="text-neutral-300">
              {isCurrentlyOpen() ? "Open Now — Indulge Today" : "Closed — Booking for tomorrow"}
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" /> 4.9 Rating
            </span>
          </motion.div>

          {/* Premium Typography Heading with Salon Name and Spacing */}
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <motion.h4
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-amber-500 font-sans text-xs tracking-[0.45em] uppercase font-semibold block pb-2"
              >
                The Sanctuary of Aesthetic Perfection
              </motion.h4>
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-3xl sm:text-5xl font-serif leading-[1.15] tracking-tight font-medium border-t border-white/10 pt-4"
            >
              We Help Create <br />
              <span className="font-sans italic font-light text-neutral-300">Moments of Beauty</span> <br />
              For You &amp; Your Glow.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed font-light"
          >
            A blend of Swiss cellular science, Aesop botanical precision, and Dyson thermal care. 
            Designed to heighten your natural biology and unlock profound, light-reflecting relaxation.
          </motion.p>

          {/* Call to Actions with beautiful spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2"
          >
            <button
              onClick={onOpenBooking}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-full shadow-lg shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
            <button
              onClick={onExploreServices}
              className="px-6 py-3.5 bg-transparent border border-neutral-700 hover:bg-white/10 text-white font-sans font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center"
            >
              Explore Services
            </button>
          </motion.div>

          {/* Premium Certifications/Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center space-x-6 pt-2 text-neutral-400 text-xs font-light"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Sterilized &amp; Medical Grade
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              Valet &amp; VIP Lounge Parking
            </span>
          </motion.div>
        </div>

        {/* Right Column - Luxury Floating Statistics & Micro-App widget */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-neutral-950/85 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 lg:p-8 space-y-5 lg:space-y-6 shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <h3 className="font-serif text-base lg:text-lg text-amber-400 tracking-wide">LXNARIA in Numbers</h3>
            
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="border-b border-neutral-800 pb-3">
                <span className="text-2xl lg:text-3xl font-serif font-semibold text-white">4.9★</span>
                <p className="text-[9px] lg:text-[10px] font-sans tracking-widest uppercase text-neutral-500 mt-1">Google Rating</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">1,450+ verified reviews</p>
              </div>
              <div className="border-b border-neutral-800 pb-3">
                <span className="text-2xl lg:text-3xl font-serif font-semibold text-white">465m²</span>
                <p className="text-[9px] lg:text-[10px] font-sans tracking-widest uppercase text-neutral-500 mt-1">Luxe Area</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">High-end private suites</p>
              </div>
              <div className="pb-1">
                <span className="text-2xl lg:text-3xl font-serif font-semibold text-white">16</span>
                <p className="text-[9px] lg:text-[10px] font-sans tracking-widest uppercase text-neutral-500 mt-1">Swiss Estheticians</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">Master boardcertified staff</p>
              </div>
              <div className="pb-1">
                <span className="text-2xl lg:text-3xl font-serif font-semibold text-white">5 Yrs</span>
                <p className="text-[9px] lg:text-[10px] font-sans tracking-widest uppercase text-neutral-500 mt-1">Of Excellence</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">Founded in Zurich, Switzerland</p>
              </div>
            </div>

            {/* Quick interactive shortcut */}
            <div className="bg-neutral-900 border border-neutral-800/80 p-3 lg:p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Instant AI Consultation</p>
                  <p className="text-[9px] lg:text-[10px] text-neutral-400">Take our 1-min quick skincare quiz.</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer">Start</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
