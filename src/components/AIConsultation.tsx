import React, { useState } from "react";
import { Sparkles, CheckCircle, ShieldCheck, Clock, User, Heart, Star, Calendar, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

interface AIConsultationProps {
  onOpenBooking: (serviceId?: string) => void;
}

export default function AIConsultation({ onOpenBooking }: AIConsultationProps) {
  // Form input states
  const [age, setAge] = useState("28");
  const [skinType, setSkinType] = useState("Combination");
  const [hairType, setHairType] = useState("Fine & Wavey");
  const [concerns, setConcerns] = useState("Dehydrated, light cheek redness, uneven tone");
  const [goals, setGoals] = useState("Deep cellular plump, smooth glass skin glow");
  const [budget, setBudget] = useState("Luxury Prestige");

  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [recommendation, setRecommendation] = useState<string | null>(null);

  // Loading animation phases
  const loadingPhases = [
    "Analyzing cellular epidermal barrier...",
    "Assessing sebum-moisture equilibrium metrics...",
    "Scanning hair cortex cuticle alignment...",
    "Bespoking synergistic peptide & botanical elixirs...",
    "Formulating clinical LXNARIA treatment pairings..."
  ];

  const handleRunConsultation = () => {
    setLoading(true);
    setRecommendation(null);
    let phaseIdx = 0;
    setLoaderMessage(loadingPhases[0]);

    // Stagger loader messages for ultra-premium UX
    const interval = setInterval(() => {
      phaseIdx++;
      if (phaseIdx < loadingPhases.length) {
        setLoaderMessage(loadingPhases[phaseIdx]);
      }
    }, 1500);

    const payload = { skinType, hairType, age, concerns, goals, budget };

    fetch("/api/consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        clearInterval(interval);
        setRecommendation(data.recommendation);
      })
      .catch((err) => {
        clearInterval(interval);
        console.error("Consultation failure:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section id="lxnaria-consultation" className="py-24 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Aesthetic Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 tracking-[0.5em] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            AI BEAUTY CONSULTATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2 tracking-widest uppercase">
            AESTHETIC <span className="font-sans italic font-light lowercase">diagnostics</span>
          </h2>
          <div className="w-12 h-[1px] bg-amber-500 mt-4"></div>
          <p className="mt-4 text-xs text-neutral-500 max-w-md font-light leading-relaxed">
            Our Gemini-powered luxury algorithm analyzes your unique skin corneum and hair cuticle dynamics, 
            prescribing the precise botanical formulas and bespoke in-salon therapies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <h3 className="font-serif text-lg pb-3 border-b border-neutral-100 dark:border-neutral-800">Your Biology Quiz</h3>
            
            <div className="space-y-4">
              {/* Age */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400">Biological Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-sm"
                />
              </div>

              {/* Skin type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400">Skin Profile</label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full p-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-sm cursor-pointer"
                >
                  <option value="Dry">Dry — Flaky, compromised mantle</option>
                  <option value="Oily">Oily — Overactive sebum networks</option>
                  <option value="Combination">Combination — T-zone desynchronization</option>
                  <option value="Sensitive">Sensitive — Reactive acid barrier</option>
                  <option value="Normal">Normal — Perfectly balanced lipids</option>
                </select>
              </div>

              {/* Hair type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400">Hair Cuticle Profile</label>
                <input
                  type="text"
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value)}
                  placeholder="e.g. Fine, curly, chemically treated..."
                  className="w-full p-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-sm"
                />
              </div>

              {/* Specific concerns */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400">Aesthetic Concerns</label>
                <textarea
                  value={concerns}
                  onChange={(e) => setConcerns(e.target.value)}
                  placeholder="e.g. Dark circles, dry patches, split ends..."
                  className="w-full p-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-xs leading-relaxed"
                  rows={3}
                />
              </div>

              {/* Primary goals */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400">Aesthetic Goals</label>
                <input
                  type="text"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Smooth texture, high hair shine..."
                  className="w-full p-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-sm"
                />
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400">Budget Perspective</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-sm cursor-pointer"
                >
                  <option value="Luxury Prestige">Luxury Prestige — High-performance actives</option>
                  <option value="Conscious Organic">Conscious Organic — Botanicals and clays</option>
                  <option value="Clinical Essential">Clinical Essential — Direct cell hydration</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunConsultation}
              disabled={loading}
              className="w-full py-4 bg-neutral-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {loading ? "Analyzing..." : "Perform AI Diagnostic"}
            </button>
          </div>

          {/* Right Column: AI Report Display */}
          <div className="lg:col-span-7 flex flex-col justify-stretch">
            <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between flex-grow shadow-xl relative min-h-[400px]">
              
              <AnimatePresence mode="wait">
                {/* Loader screen */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 dark:bg-neutral-950/95 rounded-2xl flex flex-col justify-center items-center p-8 text-center space-y-6 z-10"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-amber-100 dark:border-neutral-800 border-t-amber-500 animate-spin"></div>
                      <Sparkles className="w-6 h-6 text-amber-500 absolute top-5 left-5 animate-pulse" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <p className="font-serif text-lg tracking-wide animate-pulse">LXNARIA AI Aesthetician</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans tracking-wide leading-relaxed">
                        {loaderMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Report display content */}
              {recommendation ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-500" />
                      <span className="text-[10px] font-sans font-bold tracking-widest text-amber-600 dark:text-amber-500 uppercase">
                        AI REPORT ACTIVE — HIGH ACCURACY
                      </span>
                    </div>
                    <button
                      onClick={() => setRecommendation(null)}
                      className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1.5 cursor-pointer font-sans tracking-wider"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reset
                    </button>
                  </div>

                  {/* Markdown output rendered in a clean luxury aesthetic */}
                  <div className="prose prose-neutral dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed font-light text-neutral-700 dark:text-neutral-300 space-y-4 max-h-[450px] overflow-y-auto pr-2">
                    <ReactMarkdown>{recommendation}</ReactMarkdown>
                  </div>

                  {/* Dynamic Action Trigger to drive Booking */}
                  <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] text-neutral-500 font-light leading-normal max-w-md">
                      * All suggested treatments above are performed using clinical-grade, sterilized luxury tools under direct esthetic supervision.
                    </p>
                    <button
                      onClick={() => onOpenBooking()}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded-full shrink-0 flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Calendar className="w-4 h-4" /> Schedule Recommended Treatment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
                  <div className="p-4 bg-amber-500/10 rounded-full text-amber-500">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-xl font-medium">Bespoke Advisory Ready</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light max-w-sm leading-relaxed">
                      Fill out your skin and hair concerns on the left panel, and our AI council will generate a clinical-luxury wellness itinerary.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
