import React, { useState, useEffect } from "react";
import { User, Sparkles, Award, Calendar, DollarSign, Gift, Star, ShieldCheck, RefreshCw, X, MessageSquare, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Booking, UserProfile, Service } from "../types";

interface DashboardProps {
  onOpenBooking: () => void;
  savedServices: string[];
  onToggleSaveService: (serviceId: string) => void;
}

export default function Dashboard({ onOpenBooking, savedServices, onToggleSaveService }: DashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal actions
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const loadDashboardData = () => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/services").then((r) => r.json())
    ])
      .then(([profileData, bookingsData, servicesData]) => {
        setProfile(profileData);
        setBookings(bookingsData);
        setServices(servicesData);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading dashboard data:", err));
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Cancel booking handler
  const handleCancelBooking = (bookingId: string) => {
    fetch(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" })
      .then((r) => r.json())
      .then(() => {
        loadDashboardData(); // Reload
      })
      .catch((err) => console.error("Error cancelling booking:", err));
  };

  // Reschedule booking handler
  const handleRescheduleBooking = () => {
    if (!rescheduleBooking || !rescheduleDate || !rescheduleTime) return;

    fetch(`/api/bookings/${rescheduleBooking.id}/reschedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: rescheduleDate, time: rescheduleTime })
    })
      .then((r) => r.json())
      .then(() => {
        setRescheduleBooking(null);
        setRescheduleDate("");
        setRescheduleTime("");
        loadDashboardData(); // Reload
      })
      .catch((err) => console.error("Error rescheduling booking:", err));
  };

  const handleJoinMembership = (tier: string) => {
    fetch("/api/profile/join-membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          loadDashboardData();
        }
      })
      .catch((err) => console.error("Error joining membership:", err));
  };

  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="text-sm font-sans tracking-widest text-neutral-400 animate-pulse">Accessing secure member files...</span>
      </div>
    );
  }

  // Split bookings
  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <section id="lxnaria-dashboard" className="py-24 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-neutral-100 dark:border-neutral-800 pb-8">
          <div>
            <span className="text-amber-600 dark:text-amber-500 font-sans text-xs tracking-[0.4em] uppercase font-semibold">
              MEMBER PORTAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight mt-1">
              Welcome Back, <span className="italic font-light text-neutral-500">{profile.name}</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Bound under secure email: {profile.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded-full shadow-md"
            >
              Book New Ritual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Wallet, Membership Card, Loyalty milestones */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Membership Card - Styled like a premium metal bank card */}
            <div className="relative overflow-hidden h-56 bg-gradient-to-br from-neutral-900 via-neutral-950 to-amber-950 text-white rounded-2xl p-6 shadow-xl border border-neutral-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-sans tracking-widest text-neutral-500 uppercase">LXNARIA METALLIC</p>
                  <p className="font-serif text-lg font-medium text-amber-400 mt-1">{profile.membership} Elite Tier</p>
                </div>
                <div className="p-2 bg-white/10 rounded-lg">
                  <Award className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
              </div>

              <div className="mt-8">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">Reward balance</span>
                <span className="text-3xl font-serif font-bold tracking-tight">{profile.rewardPoints} <span className="text-xs font-sans text-neutral-400">Pts</span></span>
              </div>

              <div className="mt-6 flex justify-between items-baseline border-t border-neutral-800 pt-4 text-xs font-mono">
                <span className="text-neutral-500">SOPHIA STERLING</span>
                <span className="text-neutral-500">EXPIRED: 12/27</span>
              </div>
            </div>

            {/* Wallet & Quick Stats */}
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-6 space-y-4">
              <h3 className="font-serif text-sm font-semibold">Account Wallet</h3>
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <span className="text-xs text-neutral-500">Available Pre-paid balance:</span>
                <span className="text-lg font-serif font-bold text-emerald-600">${profile.balance.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-normal">
                * Pre-paid credits are valid for all apothecary products and custom treatments. Can be loaded at the front desk.
              </p>
            </div>

            {/* Achievements - Gamified loyalty program */}
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-6 space-y-4">
              <h3 className="font-serif text-sm font-semibold">Loyalty Milestones</h3>
              <div className="space-y-3">
                {profile.achievements.map((ach) => (
                  <div key={ach.id} className="flex gap-3 items-start p-2 rounded bg-white dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800">
                    <div className={`p-2 rounded-full ${ach.unlocked ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}>
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${ach.unlocked ? "text-neutral-900 dark:text-white" : "text-neutral-400"}`}>{ach.name}</p>
                      <p className="text-[10px] text-neutral-500 leading-normal">{ach.desc}</p>
                      {ach.unlocked && <span className="text-[9px] font-mono text-emerald-500 mt-1 block">Unlocked {ach.date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Upcoming Bookings, Wishlist / Saved Services, Reschedule Modals */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Active Bookings list */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl border-b border-neutral-100 dark:border-neutral-800 pb-2">Your Scheduled Appointments</h3>
              
              {activeBookings.length === 0 ? (
                <div className="h-32 flex flex-col justify-center items-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                  <span className="text-xs text-neutral-400 italic">No scheduled appointments active</span>
                  <button onClick={onOpenBooking} className="mt-2 text-xs font-semibold text-amber-500 hover:underline">Book Your First Treatment</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeBookings.map((book) => (
                    <div
                      key={book.id}
                      className="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-700 dark:text-amber-400 rounded">
                            {book.id}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{book.status}</span>
                        </div>
                        <h4 className="font-serif text-lg font-medium">{book.serviceName}</h4>
                        <p className="text-xs text-neutral-500 font-light flex items-center gap-2">
                          <span>Stylist Master: <strong>{book.staffName}</strong></span>
                          <span>•</span>
                          <span className="text-amber-700 dark:text-amber-400 font-semibold">{book.date} at {book.time}</span>
                        </p>
                        {book.addOns.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {book.addOns.map((add) => (
                              <span key={add.name} className="px-2 py-0.5 bg-white dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-850 text-[9px] text-neutral-400 rounded">
                                + {add.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => {
                            setRescheduleBooking(book);
                            setRescheduleDate(book.date);
                            setRescheduleTime(book.time);
                          }}
                          className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 text-xs font-sans font-bold tracking-wider uppercase rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer w-full md:w-auto text-center"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelBooking(book.id)}
                          className="px-4 py-2.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 text-xs font-sans font-bold tracking-wider uppercase rounded-md transition-colors cursor-pointer w-full md:w-auto text-center"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Services Wishlist */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl border-b border-neutral-100 dark:border-neutral-800 pb-2">Your Saved Services &amp; Wishlist</h3>
              {profile.savedServices.length === 0 ? (
                <div className="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl text-center">
                  <span className="text-xs text-neutral-400 italic">No saved services found</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services
                    .filter((s) => savedServices.includes(s.id))
                    .map((s) => (
                      <div key={s.id} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-sm font-medium">{s.name}</h4>
                          <p className="text-xs text-neutral-500 font-light mt-0.5">{s.duration} — ${s.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleSaveService(s.id)}
                            className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-rose-500 rounded-full cursor-pointer"
                          >
                            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                          </button>
                          <button
                            onClick={() => onOpenBooking()}
                            className="px-3 py-1.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] uppercase tracking-wider font-semibold rounded"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Refer a Friend Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 to-neutral-500/5 border border-amber-500/20 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                  <h4 className="font-serif text-lg font-semibold">Refer a Friend, Earn $50</h4>
                </div>
                <p className="text-xs text-neutral-500 max-w-md leading-relaxed font-light">
                  Gift your friends 20% off their first LUNARIA experience. You will earn $50 apothecary credit once they complete their ritual.
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 p-3 rounded-lg text-center font-mono text-sm tracking-wider font-bold">
                LXNARIAGLOW-SOPHIA
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Reschedule Modal overlay */}
      <AnimatePresence>
        {rescheduleBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950 z-50 cursor-pointer"
              onClick={() => setRescheduleBooking(null)}
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white dark:bg-neutral-950 p-6 md:p-8 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-2xl z-50"
            >
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-6">
                <h4 className="font-serif text-lg">Reschedule Appointment</h4>
                <button onClick={() => setRescheduleBooking(null)}>
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-light">
                <p>Rescheduling: <strong>{rescheduleBooking.serviceName}</strong> with {rescheduleBooking.staffName}</p>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400">Choose New Date</label>
                  <input
                    type="date"
                    min="2026-06-25"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-sans tracking-widest uppercase text-neutral-400">Choose New Time</label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-900"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                  </select>
                </div>

                <button
                  onClick={handleRescheduleBooking}
                  className="w-full py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded shadow-md mt-4 cursor-pointer"
                >
                  Save Rescheduled Time
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
