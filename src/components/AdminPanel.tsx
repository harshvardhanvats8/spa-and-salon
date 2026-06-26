import React, { useState, useEffect } from "react";
import { DollarSign, Calendar, TrendingUp, Users, RefreshCw, Star, Percent, CalendarRange, Trash2, Plus, Sparkles, CheckCircle, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "motion/react";
import { Booking, Coupon } from "../types";

export default function AdminPanel() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating new coupon
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState(15);
  const [newType, setNewType] = useState<"percent" | "fixed">("percent");
  const [newDesc, setNewDesc] = useState("");
  const [couponMsg, setCouponMsg] = useState("");

  const loadAdminData = () => {
    Promise.all([
      fetch("/api/admin/analytics").then((r) => r.json()),
      fetch("/api/coupons").then((r) => r.json())
    ])
      .then(([analyticsData, couponsData]) => {
        setAnalytics(analyticsData);
        setCoupons(couponsData);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading admin datasets:", err));
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handler to cancel a booking directly from Admin CRM panel
  const handleCancelBooking = (id: string) => {
    fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" })
      .then((r) => r.json())
      .then(() => {
        loadAdminData(); // Reload
      })
      .catch((err) => console.error("Error cancelling in CRM:", err));
  };

  if (loading || !analytics) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="text-sm font-sans tracking-widest text-neutral-400 animate-pulse">Establishing SaaS telemetry bridge...</span>
      </div>
    );
  }

  return (
    <section id="lxnaria-admin" className="py-24 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-neutral-100 dark:border-neutral-800 pb-8">
          <div>
            <span className="text-amber-600 dark:text-amber-500 font-sans text-xs tracking-[0.4em] uppercase font-semibold">
              MANAGEMENT PORTAL (CRM &amp; ERP)
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight mt-1">
              Business <span className="italic font-light text-neutral-500">analytics</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Secure Multi-Location Admin Center</p>
          </div>
          <button
            onClick={loadAdminData}
            className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-amber-500 flex items-center gap-2 cursor-pointer transition-colors text-xs uppercase tracking-wider font-semibold"
          >
            <RefreshCw className="w-4 h-4 animate-[spin_5s_infinite_linear]" /> Refresh Analytics
          </button>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Revenue */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase">MONTHLY REVENUE</span>
              <p className="text-2xl font-serif font-bold text-neutral-950 dark:text-white">${analytics.revenue.monthly.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">↑ 18.5% Forecast boost</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase">TOTAL BOOKINGS</span>
              <p className="text-2xl font-serif font-bold text-neutral-950 dark:text-white">{analytics.bookingsCount}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">From web, CRM, and walk-ins</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase">CONVERSION RATE</span>
              <p className="text-2xl font-serif font-bold text-neutral-950 dark:text-white">{analytics.conversionRate}%</p>
              <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">↑ 4.2% optimized UX</p>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Repeat Customer Retention */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase">CLIENT RETENTION</span>
              <p className="text-2xl font-serif font-bold text-neutral-950 dark:text-white">{analytics.retentionRate}%</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Gold &amp; Platinum loyalty tiers</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Business Charts using Recharts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Area Chart - Revenue Growth */}
          <div className="lg:col-span-8 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg">Weekly Revenue Dynamics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { day: "Mon", revenue: 1420 },
                  { day: "Tue", revenue: 2150 },
                  { day: "Wed", revenue: 3880 },
                  { day: "Thu", revenue: 4100 },
                  { day: "Fri", revenue: 5450 },
                  { day: "Sat", revenue: 6890 },
                  { day: "Sun", revenue: 12450 }
                ]}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} contentStyle={{ background: "#262626", border: "none", borderRadius: "8px", color: "#ffffff", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - Peak Booking Hours */}
          <div className="lg:col-span-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg">Peak Reservation Hours</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.peakHours}>
                  <XAxis dataKey="hour" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#262626", border: "none", borderRadius: "8px", color: "#ffffff", fontSize: "11px" }} />
                  <Bar dataKey="bookings" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Staff Performance & Calendar Scheduler */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Employee performance */}
          <div className="lg:col-span-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg">Stylist Performance Analytics</h3>
            <div className="space-y-4">
              {analytics.staffPerformance.map((st: any) => (
                <div key={st.name} className="flex justify-between items-center p-4 bg-white dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                  <div className="space-y-0.5">
                    <h5 className="font-sans text-xs font-bold uppercase">{st.name}</h5>
                    <p className="text-[10px] text-neutral-400">Total bookings: {st.bookings} appointments</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-sm font-semibold text-emerald-600">+${st.revenue}</p>
                    <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold justify-end">
                      <Star className="w-3 h-3 fill-amber-500" /> {st.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Privilege Codes / Coupon Management */}
          <div className="lg:col-span-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg">Privilege Codes &amp; Marketing</h3>
            
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {coupons.map((c) => (
                <div key={c.code} className="flex justify-between items-center p-3 bg-white dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                  <div>
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-600 rounded">
                      {c.code}
                    </span>
                    <p className="text-[10px] text-neutral-500 mt-1">{c.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                      {c.type === "percent" ? `${c.discount}% OFF` : `$${c.discount} OFF`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Form to add coupon (offline, updates view) */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold tracking-widest uppercase text-amber-500">Create Privilege Campaign</h4>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="CODE"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="p-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 rounded text-xs"
                />
                <input
                  type="number"
                  placeholder="VALUE"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(parseInt(e.target.value) || 0)}
                  className="p-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 rounded text-xs"
                />
                <button
                  onClick={() => {
                    if (!newCode) return;
                    const c: Coupon = { code: newCode, discount: newDiscount, type: newType, desc: newDesc || `${newDiscount}% off luxury treatments` };
                    setCoupons([...coupons, c]);
                    setNewCode("");
                    setNewDesc("");
                  }}
                  className="px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Reservation Calendar Log CRM panel */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl border-b border-neutral-100 dark:border-neutral-800 pb-2">Active Reservations CRM Grid</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden">
              <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Client Details</th>
                  <th className="p-4">Treatment</th>
                  <th className="p-4">Stylist Master</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {analytics.bookingsHistory.map((book: Booking) => (
                  <tr key={book.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                    <td className="p-4 font-mono font-bold text-amber-600">{book.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold">{book.customerName}</p>
                        <p className="text-[10px] text-neutral-400">{book.customerEmail}</p>
                      </div>
                    </td>
                    <td className="p-4 font-serif font-medium">{book.serviceName}</td>
                    <td className="p-4">{book.staffName}</td>
                    <td className="p-4 font-semibold text-amber-700 dark:text-amber-400">{book.date} at {book.time}</td>
                    <td className="p-4 font-bold">${book.price}</td>
                    <td className="p-4 text-right">
                      {book.status !== "cancelled" ? (
                        <button
                          onClick={() => handleCancelBooking(book.id)}
                          className="p-2 hover:bg-rose-50 text-rose-500 rounded cursor-pointer"
                          title="Force Cancel Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-300 uppercase">CANCELLED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
