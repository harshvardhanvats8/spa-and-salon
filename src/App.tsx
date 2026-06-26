import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import BookingSystem from "./components/BookingSystem";
import Dashboard from "./components/Dashboard";
import OnlineStore from "./components/OnlineStore";
import AIConsultation from "./components/AIConsultation";
import AdminPanel from "./components/AdminPanel";
import BeforeAfter from "./components/BeforeAfter";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import { X, ShieldCheck, Mail, MapPin, Phone, Clock, CreditCard, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("lxnaria-dark-mode");
    return saved !== null ? JSON.parse(saved) : true;
  }); // Defaulting to refined twilight dark mode, or loaded from localStorage
  const [activeTab, setActiveTab] = useState("about");
  const [language, setLanguage] = useState("en");

  // Global booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>(undefined);

  // Profile favorite services syncing state
  const [savedServices, setSavedServices] = useState<string[]>([]);

  useEffect(() => {
    // Sync theme class with body
    const bodyClass = document.body.classList;
    if (darkMode) {
      bodyClass.add("dark");
    } else {
      bodyClass.remove("dark");
    }
    localStorage.setItem("lxnaria-dark-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    // Fetch initial profile to load saved services
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setSavedServices(data.savedServices);
      })
      .catch((err) => console.error("Error fetching initial favorites:", err));
  }, []);

  const handleToggleSaveService = (serviceId: string) => {
    fetch("/api/profile/save-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId })
    })
      .then((r) => r.json())
      .then((data) => {
        setSavedServices(data.savedServices);
      })
      .catch((err) => console.error("Error toggling saved service:", err));
  };

  const handleOpenBooking = (serviceId?: string) => {
    setPreSelectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = () => {
    // Quick delay then auto-close booking window
    setTimeout(() => {
      setIsBookingOpen(false);
    }, 2000);
  };

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Privilege subscription successfully established.");
  };

  const isPresentationTab = ["about", "services", "store", "gallery", "consultation"].includes(activeTab);

  useEffect(() => {
    const tabToIdMap: Record<string, string> = {
      about: "lxnaria-about",
      services: "lxnaria-services",
      store: "lxnaria-store",
      gallery: "lxnaria-gallery",
      consultation: "lxnaria-consultation",
    };

    const targetId = tabToIdMap[activeTab];
    if (targetId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? "bg-neutral-950 text-white" : "bg-neutral-50 text-neutral-900"}`}>
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
        language={language}
        setLanguage={setLanguage}
      />

      {/* 2. Fullscreen Immersive Hero section (only on presentation views) */}
      {isPresentationTab && (
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExploreServices={() => setActiveTab("services")}
        />
      )}

      {/* 3. Main Coordinates Routing tabs */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={isPresentationTab ? "presentation" : activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {isPresentationTab && (
              <>
                <About />
                <Services
                  onOpenBooking={handleOpenBooking}
                  savedServices={savedServices}
                  onToggleSaveService={handleToggleSaveService}
                />
                <BeforeAfter />
                <OnlineStore
                  onToggleSaveService={handleToggleSaveService}
                  savedServices={savedServices}
                />
                <AIConsultation onOpenBooking={handleOpenBooking} />
                <Blog />
                <Contact />
              </>
            )}

            {activeTab === "dashboard" && (
              <Dashboard
                onOpenBooking={() => handleOpenBooking()}
                savedServices={savedServices}
                onToggleSaveService={handleToggleSaveService}
              />
            )}

            {activeTab === "admin" && <AdminPanel />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Global Booking Wizard Overlay Modals */}
      <AnimatePresence>
        {isBookingOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950 z-50 cursor-pointer"
              onClick={() => setIsBookingOpen(false)}
            ></motion.div>

            {/* Centered booking wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed inset-4 md:inset-y-12 md:left-1/2 md:right-auto md:w-full md:max-w-4xl md:-translate-x-1/2 bg-transparent z-50 overflow-y-auto"
            >
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="p-2 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 rounded-full hover:scale-110 transition-transform cursor-pointer"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <BookingSystem
                initialServiceId={preSelectedServiceId}
                onSuccess={handleBookingSuccess}
                onClose={() => setIsBookingOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. Production Luxury Footer */}
      <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.55em] text-white font-bold block transition-all duration-500 hover:tracking-[0.65em] whitespace-nowrap">
              LXNARIA
            </span>
            <p className="text-xs leading-relaxed font-light">
              Premium Swiss skin science, botanical apothecary formulas, and custom heat styling. 
              Designed to optimize natural biology and deliver profound wellness experiences.
            </p>
            <p className="text-[10px] font-mono text-neutral-600">
              © 2026 LXNARIA Studio. Limmatquai 45, Zürich. Swiss Reg 802.24A
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-sans font-bold tracking-widest text-white uppercase">RESERVE CHANNELS</h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <button onClick={() => setActiveTab("services")} className="hover:text-white">Clinical Treatment Menu</button>
              </li>
              <li>
                <button onClick={() => setActiveTab("store")} className="hover:text-white">Bespoke Apothecary</button>
              </li>
              <li>
                <button onClick={() => handleOpenBooking()} className="hover:text-white">Online Reservation System</button>
              </li>
              <li>
                <button onClick={() => setActiveTab("consultation")} className="hover:text-white">AI Esthetician Consultation</button>
              </li>
            </ul>
          </div>

          {/* Contact coordinates quick view */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-sans font-bold tracking-widest text-white uppercase">SANCTUARY COORDS</h4>
            <ul className="space-y-2 text-xs font-light">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Zurich Flagship
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> +41 44 222 1234
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> concierge@lxnaria.com
              </li>
            </ul>
          </div>

          {/* Privilege Newsletter Subscription */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-sans font-bold tracking-widest text-white uppercase">PRIVILEGE JOURNAL</h4>
            <p className="text-xs font-light">Subscribe to receive invitation-only Swiss skin reports and priority timeslots.</p>
            <form onSubmit={handleNewsletterSubscribe} className="flex gap-1.5">
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="flex-grow p-2 bg-neutral-900 border border-neutral-800 text-xs text-white rounded outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-neutral-950 text-xs uppercase font-bold tracking-wider rounded hover:opacity-90 transition-opacity"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Certifications, Payment Methods bar */}
        <div className="max-w-7xl mx-auto px-6 border-t border-neutral-900 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-neutral-600 font-mono">
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Swiss Aesthetics Board Certified
            </span>
            <span>•</span>
            <span>Dyson Supersonic Authorized Partner</span>
            <span>•</span>
            <span>Aesop Curated apothecary distributor</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4" />
            <span>SECURE CRYPTO &amp; STRIPE CHECKOUT GATEWAY</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
