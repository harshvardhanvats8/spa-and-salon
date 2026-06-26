import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, AlertTriangle, ShieldCheck, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setFormName("");
      setFormEmail("");
      setFormMsg("");
    }, 4000);
  };

  return (
    <section id="lxnaria-contact" className="py-24 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 tracking-[0.5em] uppercase">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2 tracking-widest uppercase">
            WE'D LOVE TO <span className="font-sans italic font-light lowercase">hear</span> FROM YOU
          </h2>
          <div className="w-12 h-[1px] bg-amber-500 mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Coordinates & Information */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="font-serif text-2xl tracking-wide">LXNARIA Coordinates</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              We look forward to welcoming you into our tranquil sanctuary. 
              Please reach out for booking inquiries, membership setups, or custom corporate luxury spa packages.
            </p>

            <div className="space-y-6">
              {/* Flagship */}
              <div className="flex gap-4">
                <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg text-amber-500 shadow-sm shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold">Zurich Flagship</h4>
                  <p className="text-xs text-neutral-500 font-light mt-1">Limmatquai 45, Old Town, 8001 Zürich, Switzerland</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">* Complimentary secure valet &amp; EV charger parking</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg text-amber-500 shadow-sm shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold">Sanctuary Hours</h4>
                  <p className="text-xs text-neutral-500 font-light mt-1">Weekdays: 09:00 AM — 08:00 PM</p>
                  <p className="text-xs text-neutral-500 font-light">Saturdays: 09:00 AM — 06:00 PM</p>
                  <p className="text-xs text-neutral-500 font-light text-rose-500">Sundays: Private Member Events Only</p>
                </div>
              </div>

              {/* Concierge hot lines */}
              <div className="flex gap-4">
                <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg text-amber-500 shadow-sm shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold">Concierge Channels</h4>
                  <p className="text-xs text-neutral-500 font-light mt-1">Direct Call: +41 (44) 222-1234</p>
                  <p className="text-xs text-neutral-500 font-light">WhatsApp: +1 (555) LUX-GLOW</p>
                  <p className="text-xs text-neutral-500 font-light">Email: concierge@lxnaria.com</p>
                </div>
              </div>
            </div>

            {/* Emergency hotline banner */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3.5 items-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-light leading-normal">
                <strong>Emergency cancellation?</strong> Direct WhatsApp our 24/7 concierge hot desk at least 4 hours before your booking to avoid holding fees.
              </p>
            </div>
          </div>

          {/* Right Column: Feedback / Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <h3 className="font-serif text-xl border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-6">Write to Our Esthetician Council</h3>
            
            {formSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-medium">Message Dispatch success</h4>
                  <p className="text-xs text-neutral-400 font-light">An LXNARIA supervisor will respond to your security email in 2 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs font-light">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400 block">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full p-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400 block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full p-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400 block">How can we assist your ritual?</label>
                  <textarea
                    required
                    placeholder="Enter message..."
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    className="w-full p-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-xs leading-relaxed"
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-3 py-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-[10px] text-neutral-400 font-light leading-normal">
                    We respect your privacy. Under Swiss GDPR, your biological skin data details are fully secured under medical-grade cryptographic firewalls.
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded-lg shadow-md cursor-pointer transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
