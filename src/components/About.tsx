import React, { useState } from "react";
import { Award, ShieldCheck, MapPin, Sparkles, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function About() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // High-end assets matching mockup 2 "OUR SPACE"
  const galleryItems = [
    {
      title: "INTERIOR",
      desc: "Clean lines, high-contrast, Swiss minimal architectural design.",
      img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "RELAXATION AREA",
      desc: "Soft ambient soundscapes, zero-gravity lounger experience.",
      img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "HAIR TREATMENT ROOMS",
      desc: "Equipped with Dyson Supersonic heat-controlled tech.",
      img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "CHIEF ESTHETICIAN OFFICE",
      desc: "Aesthetic diagnostic suite, micro-photography diagnostics.",
      img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "SPA ZONE",
      desc: "Chromotherapeutic hot pools, volcanic salt chamber.",
      img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600",
    }
  ];

  const milestones = [
    { year: "2021", event: "Founded in Zurich", desc: "Launched first boutique skin science clinic in the historic old town." },
    { year: "2023", event: "L'Oreal Trophy & Expansion", desc: "Acclaimed for organic balayage artistry and expanded to Paris." },
    { year: "2025", event: "SaaS & AI Rejuvenation", desc: "Integrated digital AI diagnostic systems and clinical spa rooms." }
  ];

  return (
    <section id="lxnaria-about" className="py-24 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Story Intro Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-amber-600 dark:text-amber-500 font-sans text-xs tracking-[0.4em] uppercase font-semibold">
              The Genesis of LXNARIA
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight font-medium">
              We Help Create <br />
              <span className="font-sans italic font-light text-neutral-500">Moments of Beauty</span> <br />
              For You and Your Glow.
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-neutral-600 dark:text-neutral-300 font-light leading-relaxed text-sm sm:text-base">
              LXNARIA was born from a simple belief: beauty is most powerful when it reflects how you feel inside. 
              Inspired by nature, light, and the soft rhythm of self-care, our studio was created as a gentle space 
              where women and men could reconnect with themselves—not just enhance their appearance. 
              Our personalized consultations ensure that treatments are precisely addressed to each client's individual needs.
            </p>
          </div>
        </div>

        {/* Space Gallery - Mockup 2: "OUR SPACE" */}
        <div className="mb-24">
          <div className="flex flex-col items-center mb-10 text-center">
            <span className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 tracking-[0.5em] uppercase">
              GALLERY
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif mt-2 tracking-widest uppercase">
              OUR <span className="font-sans italic font-light lowercase">space</span>
            </h3>
            <div className="w-12 h-[1px] bg-amber-500 mt-4"></div>
          </div>

          {/* Aesthetic grid of gallery items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden group shadow-sm hover:shadow-lg ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className="relative h-64 sm:h-80 overflow-hidden cursor-pointer" onClick={() => setSelectedImage(item.img)}>
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/45 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 bg-white/90 text-neutral-950 rounded-full">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-sans text-xs tracking-widest font-semibold text-neutral-400 uppercase">
                      {item.title}
                    </h4>
                    <span className="text-[9px] font-mono text-neutral-300">0{index + 1}</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 font-light">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Milestones, Timelines & Awards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-neutral-100 dark:border-neutral-800">
          
          {/* Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <h4 className="font-serif text-2xl tracking-wide">Evolution of Excellence</h4>
            <div className="space-y-6 relative border-l border-neutral-200 dark:border-neutral-800 pl-6 ml-2">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-8.5 top-1.5 w-4 h-4 bg-amber-500 rounded-full border-4 border-white dark:border-neutral-950 shadow-sm"></span>
                  <div className="space-y-1">
                    <span className="font-sans text-xs font-bold text-amber-600 dark:text-amber-500">{milestone.year}</span>
                    <h5 className="font-sans text-sm font-semibold tracking-wide uppercase">{milestone.event}</h5>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light max-w-lg leading-relaxed">
                      {milestone.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Luxury Certification & Founders */}
          <div className="lg:col-span-5 space-y-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-8">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-500" />
              <h4 className="font-serif text-xl">Accreditation & Awards</h4>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              LXNARIA operations adhere to strict Swiss cosmetic and dermatological safety metrics. 
              Our staff hold board-certified master-level degrees.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Vogue Skin & Wellness Guild — Certified Member 2024
              </li>
              <li className="flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Swiss Aesthetic Precision Council — Master Grade
              </li>
              <li className="flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Dyson Supersonic Care Certified Partner
              </li>
            </ul>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
                alt="Clara Vance Founder"
                className="w-12 h-12 object-cover rounded-full border border-neutral-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-semibold">Clara Vance</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Co-Founder &amp; Principal Director</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox for large imagery */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 p-2 text-white hover:text-amber-400">
              <span className="text-lg font-sans">Close ✕</span>
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={selectedImage}
              alt="Expanded view"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
