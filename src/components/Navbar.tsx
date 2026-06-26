import React, { useState, useEffect } from "react";
import { Sparkles, Phone, MessageCircle, Moon, Sun, Menu, X, ChevronDown, User, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export default function Navbar({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  onOpenBooking,
  language,
  setLanguage
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: "en", label: "EN — English" },
    { code: "fr", label: "FR — Français" },
    { code: "de", label: "DE — Deutsch" },
    { code: "it", label: "IT — Italiano" }
  ];

  const navigationItems = [
    { id: "about", label: "Our Story" },
    { id: "services", label: "Services" },
    { id: "store", label: "Apothecary" },
    { id: "gallery", label: "Transformations" },
    { id: "consultation", label: "Consult AI", icon: <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> },
    { id: "dashboard", label: "Member Portal" },
    { id: "admin", label: "Business SaaS" }
  ];

  return (
    <header
      id="lxnaria-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md shadow-sm border-b border-neutral-100 dark:border-neutral-800 py-4"
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo - Styled with extreme editorial elegance */}
        <div
          id="lxnaria-logo"
          onClick={() => setActiveTab("about")}
          className="cursor-pointer group flex items-baseline space-x-2"
        >
          <span className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.55em] text-neutral-950 dark:text-white transition-all duration-500 group-hover:tracking-[0.65em] whitespace-nowrap">
            LXNARIA
          </span>
          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMegaMenuOpen(false);
              }}
              className={`relative py-2 text-[13px] font-sans font-medium tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                activeTab === item.id
                  ? "text-amber-700 dark:text-amber-400 font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
              {activeTab === item.id && (
                <motion.span
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 w-full h-[1.5px] bg-amber-600 dark:bg-amber-400"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right side utility controls */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Quick Chat Triggers */}
          <a
            href="https://wa.me/15555555555"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
            title="WhatsApp Luxury Concierge"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          <a
            href="tel:+15555555555"
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            title="Concierge Hot Line"
          >
            <Phone className="w-5 h-5" />
          </a>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold">{language}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-xl rounded-lg py-1 z-20"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-sans tracking-wide text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center justify-between"
                      >
                        {lang.label}
                        {language === lang.code && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-amber-500 transition-colors cursor-pointer"
            title="Toggle Ambiance"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Core Booking CTA */}
          <button
            onClick={onOpenBooking}
            className="relative overflow-hidden group ml-2 px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-sans font-semibold tracking-widest uppercase transition-all duration-300 rounded-full cursor-pointer shadow-md"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Book Appointment
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-amber-700/10 dark:bg-amber-100/10 transition-transform duration-500"></div>
          </button>
        </div>

        {/* Mobile menu and toggles */}
        <div className="flex lg:hidden items-center space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-amber-500 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-900 dark:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4 flex flex-col">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left py-2.5 text-sm tracking-widest uppercase font-medium border-b border-neutral-50 dark:border-neutral-800 transition-colors flex items-center gap-2 ${
                    activeTab === item.id
                      ? "text-amber-700 dark:text-amber-400 font-semibold"
                      : "text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={onOpenBooking}
                  className="w-full text-center py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold tracking-widest uppercase rounded-full shadow-md"
                >
                  Book Appointment
                </button>
              </div>

              <div className="flex justify-around items-center pt-4 text-neutral-500">
                <a href="https://wa.me/15555555555" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs">
                  <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                </a>
                <a href="tel:+15555555555" className="flex items-center gap-1.5 text-xs">
                  <Phone className="w-4 h-4 text-amber-500" /> Concierge Call
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
