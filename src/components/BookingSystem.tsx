import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User, Sparkles, Check, ChevronRight, ChevronLeft, CreditCard, Ticket, ShieldCheck, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Service, Staff, Booking } from "../types";

interface BookingSystemProps {
  initialServiceId?: string;
  onSuccess: (newBooking: any) => void;
  onClose?: () => void;
}

export default function BookingSystem({ initialServiceId, onSuccess, onClose }: BookingSystemProps) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const [customerName, setCustomerName] = useState("Sophia Sterling");
  const [customerEmail, setCustomerEmail] = useState("harshvardhanvats8@gmail.com");
  const [customerPhone, setCustomerPhone] = useState("+1 (555) 555-5555");
  const [notes, setNotes] = useState("");

  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [bookingError, setBookingError] = useState("");
  const [bookingPending, setBookingPending] = useState(false);

  // Timeslots generator (standard luxury hours)
  const availableSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM",
    "05:30 PM",
    "07:00 PM"
  ];

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then(r => r.json()),
      fetch("/api/staff").then(r => r.json())
    ])
      .then(([serviceData, staffData]) => {
        setServices(serviceData);
        setStaff(staffData);
        setLoading(false);

        // Pre-select service if passed as a prop
        if (initialServiceId) {
          const match = serviceData.find((s: Service) => s.id === initialServiceId);
          if (match) setSelectedService(match);
        }
      })
      .catch(err => console.error("Error setting up bookings engine:", err));
  }, [initialServiceId]);

  // Handle AddOn toggling
  const handleToggleAddOn = (addOnName: string) => {
    if (selectedAddOns.includes(addOnName)) {
      setSelectedAddOns(selectedAddOns.filter(a => a !== addOnName));
    } else {
      setSelectedAddOns([...selectedAddOns, addOnName]);
    }
  };

  // Check Coupon Code
  const handleApplyCoupon = () => {
    if (!couponCode) return;
    setCouponError("");
    setCouponSuccess("");
    
    fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode })
    })
      .then(r => {
        if (!r.ok) throw new Error("Invalid code");
        return r.json();
      })
      .then(data => {
        setCouponDiscount(data.coupon);
        setCouponSuccess(`${data.coupon.desc} successfully applied!`);
      })
      .catch(() => {
        setCouponError("This luxury code is invalid or expired.");
        setCouponDiscount(null);
      });
  };

  // Submit Booking
  const handleSubmitBooking = () => {
    setBookingPending(true);
    setBookingError("");

    const payload = {
      customerName,
      customerEmail,
      customerPhone,
      serviceId: selectedService?.id,
      staffId: selectedStaff?.id,
      date: selectedDate,
      time: selectedTime,
      addOns: selectedAddOns,
      notes,
      couponCode: couponDiscount?.code
    };

    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to confirm reservation");
        return data;
      })
      .then((data) => {
        setBookingResponse(data);
        setStep(5); // Go to Success Confirmation Step
        onSuccess(data.booking);
      })
      .catch((err) => {
        setBookingError(err.message);
      })
      .finally(() => {
        setBookingPending(false);
      });
  };

  // Price Computations
  const getPricingSummary = () => {
    if (!selectedService) return { basePrice: 0, addOnsTotal: 0, discount: 0, finalPrice: 0 };
    let basePrice = selectedService.price;
    let addOnsTotal = 0;

    selectedAddOns.forEach(name => {
      const match = selectedService.addOns.find(a => a.name === name);
      if (match) addOnsTotal += match.price;
    });

    const totalBeforeDiscount = basePrice + addOnsTotal;
    let discount = 0;

    if (couponDiscount) {
      if (couponDiscount.type === "percent") {
        discount = (totalBeforeDiscount * couponDiscount.discount) / 100;
      } else {
        discount = couponDiscount.discount;
      }
    }

    return {
      basePrice,
      addOnsTotal,
      discount,
      finalPrice: Math.max(0, totalBeforeDiscount - discount)
    };
  };

  const pricing = getPricingSummary();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="text-sm font-sans tracking-widest text-neutral-400 animate-pulse">Initializing reservation platform...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl relative">
      
      {/* Step Indicators */}
      {step < 5 && (
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-6 mb-8 overflow-x-auto gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center space-x-2 shrink-0">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                step === num
                  ? "bg-neutral-950 dark:bg-white text-white dark:text-neutral-950"
                  : step > num
                    ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
              }`}>
                {num}
              </span>
              <span className={`text-[10px] font-sans tracking-widest uppercase font-semibold ${
                step === num ? "text-neutral-900 dark:text-white" : "text-neutral-400"
              }`}>
                {num === 1 ? "Treatment" : num === 2 ? "Stylist" : num === 3 ? "Schedule" : "Confirm"}
              </span>
              {num < 4 && <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />}
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: SELECT TREATMENT */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl">Select Your Therapeutic Treatment</h3>
            <p className="text-xs text-neutral-500 font-light">Select from our specialized botanical skin or hair treatments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${
                  selectedService?.id === service.id
                    ? "bg-amber-500/5 dark:bg-amber-500/5 border-amber-500 shadow-sm"
                    : "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300"
                }`}
              >
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-400">{service.category} CARE</h4>
                  <h5 className="font-serif font-medium text-sm mt-1">{service.name}</h5>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-2 font-light">
                    <span>{service.duration}</span>
                    <span>•</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">${service.price}</span>
                  </div>
                </div>
                {selectedService?.id === service.id && <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>}
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-end">
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded-full disabled:opacity-40 flex items-center gap-2 cursor-pointer"
            >
              Next: Choose Stylist <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: CHOOSE STYLIST/STAFF */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl">Select Esthetician Stylist</h3>
            <p className="text-xs text-neutral-500 font-light">Our masters hold board-certified specializations in Europe and Asia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStaff(st)}
                className={`border rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col ${
                  selectedStaff?.id === st.id
                    ? "border-amber-500 shadow-lg bg-amber-500/5"
                    : "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300"
                }`}
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={st.image} alt={st.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[9px] font-mono tracking-widest uppercase bg-amber-600 px-2 py-0.5 rounded">
                      {st.experience} EXP
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2 flex-grow">
                  <h4 className="font-serif text-sm font-semibold">{st.name}</h4>
                  <p className="text-[10px] font-sans font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">{st.role}</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-light leading-normal line-clamp-3">
                    {st.specialization}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400 text-xs font-sans font-semibold tracking-widest uppercase rounded-full flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              disabled={!selectedStaff}
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded-full disabled:opacity-40 flex items-center gap-2 cursor-pointer"
            >
              Next: Select Schedule <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: CHOOSE DATE & TIME */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl">Select Appointment Schedule</h3>
            <p className="text-xs text-neutral-500 font-light">Select from our real-time available hours. Timeslots sync dynamically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Date Pick */}
            <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900 p-6 border border-neutral-100 dark:border-neutral-800 rounded-xl">
              <label className="text-xs font-bold font-sans tracking-widest uppercase text-neutral-400 block">Choose Date</label>
              <div className="relative">
                <input
                  type="date"
                  min="2026-06-25"
                  max="2026-07-25"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 rounded-lg text-sm text-neutral-800 dark:text-white"
                />
              </div>
              {selectedStaff && (
                <div className="pt-2 text-[10px] text-neutral-500 font-light leading-normal">
                  * {selectedStaff.name} is scheduled on {selectedStaff.availability.join(", ")}.
                </div>
              )}
            </div>

            {/* Time Pick */}
            <div className="space-y-3">
              <label className="text-xs font-bold font-sans tracking-widest uppercase text-neutral-400 block">Available Timeslots</label>
              {!selectedDate ? (
                <div className="h-32 flex items-center justify-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                  <span className="text-xs text-neutral-400 italic">Please select a date first</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-3 text-xs font-mono rounded-lg border text-center transition-all cursor-pointer ${
                        selectedTime === slot
                          ? "bg-amber-500 border-amber-500 text-neutral-950 font-semibold"
                          : "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 border border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400 text-xs font-sans font-semibold tracking-widest uppercase rounded-full flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded-full disabled:opacity-40 flex items-center gap-2 cursor-pointer"
            >
              Next: Confirm &amp; Add-ons <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: CONFIRM & ADD-ONS */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl">Confirm &amp; Personalize Your Ritual</h3>
            <p className="text-xs text-neutral-500 font-light">Choose optional active boosters to heighten your treatment.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Add-ons & Notes */}
            <div className="lg:col-span-7 space-y-6">
              {/* Optional Add-ons */}
              {selectedService && selectedService.addOns && selectedService.addOns.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold font-sans tracking-widest uppercase text-neutral-400 block">Available Boosters</label>
                  <div className="space-y-2">
                    {selectedService.addOns.map((add) => (
                      <div
                        key={add.name}
                        onClick={() => handleToggleAddOn(add.name)}
                        className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                          selectedAddOns.includes(add.name)
                            ? "bg-amber-500/5 border-amber-500 shadow-sm"
                            : "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300"
                        }`}
                      >
                        <span className="text-xs font-medium">{add.name}</span>
                        <span className="text-xs font-semibold text-amber-600">+${add.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Notes */}
              <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900 p-6 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                <label className="text-xs font-bold font-sans tracking-widest uppercase text-neutral-400 block">Personal Consultation Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. skin allergies, target areas, pressure levels or preferred beverage (champagne, coffee, sparkling water)..."
                  className="w-full p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 rounded-lg text-xs leading-relaxed"
                  rows={3}
                />
              </div>
            </div>

            {/* Right Col: Summary & Promo Coupon */}
            <div className="lg:col-span-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 space-y-6">
              <h4 className="font-serif text-lg border-b border-neutral-200 dark:border-neutral-800 pb-3">Reservation Summary</h4>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Treatment:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Stylist Master:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{selectedStaff?.name}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Schedule:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{selectedDate} at {selectedTime}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Boosters ({selectedAddOns.length}):</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">+${pricing.addOnsTotal}</span>
                  </div>
                )}
              </div>

              {/* Coupon input */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block">Apply Privilege Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. LUNARIAGLOW"
                    className="flex-grow p-2.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 rounded text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs rounded uppercase font-semibold tracking-wider hover:opacity-90"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-rose-500">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-500">{couponSuccess}</p>}
              </div>

              {/* Total display */}
              <div className="border-t border-b border-neutral-200 dark:border-neutral-800 py-4 flex justify-between items-baseline">
                <span className="text-sm font-serif font-bold text-neutral-900 dark:text-white">Total Value:</span>
                <div className="text-right">
                  {pricing.discount > 0 && (
                    <p className="text-xs text-neutral-400 line-through">${pricing.basePrice + pricing.addOnsTotal}</p>
                  )}
                  <p className="text-2xl font-serif font-bold text-amber-600">${pricing.finalPrice}</p>
                </div>
              </div>

              {/* Error messages */}
              {bookingError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded text-xs leading-normal">
                  {bookingError}
                </div>
              )}

              {/* Trigger Shipped Confirmation Booking */}
              <button
                disabled={bookingPending}
                onClick={handleSubmitBooking}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-55 text-neutral-950 font-sans font-bold tracking-widest uppercase rounded-lg transition-colors cursor-pointer text-xs flex justify-center items-center shadow-md shadow-amber-500/10"
              >
                {bookingPending ? "Configuring Caliber Securely..." : "Confirm & Pay Reservation"}
              </button>
            </div>
          </div>

          <div className="pt-6 flex justify-between border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 border border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400 text-xs font-sans font-semibold tracking-widest uppercase rounded-full flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: SUCCESS CONFIRMATION & CALENDAR SYNC */}
      {step === 5 && bookingResponse && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-8">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl tracking-wide">Appointment Confirmed</h3>
            <p className="text-xs text-neutral-500 font-light max-w-md mx-auto">
              Your luxury treatment at LUNARIA is scheduled. We have sent SMS &amp; WhatsApp reminders.
            </p>
          </div>

          {/* Details Card */}
          <div className="max-w-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-6 mx-auto text-left space-y-3">
            <div className="flex justify-between text-xs border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
              <span className="text-neutral-400">Reservation ID:</span>
              <span className="font-mono font-bold text-amber-600">{bookingResponse.booking.id}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
              <span className="text-neutral-400">Treatment:</span>
              <span className="font-semibold">{bookingResponse.booking.serviceName}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
              <span className="text-neutral-400">Master Stylist:</span>
              <span className="font-semibold">{bookingResponse.booking.staffName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Schedule:</span>
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                {bookingResponse.booking.date} — {bookingResponse.booking.time}
              </span>
            </div>
          </div>

          {/* Calendar Sync Links */}
          <div className="space-y-3 max-w-sm mx-auto">
            <h4 className="text-[10px] font-sans font-bold tracking-widest uppercase text-neutral-400">Sync with Your Calendar</h4>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={bookingResponse.googleCalendarUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-sans font-semibold text-neutral-600 dark:text-neutral-400 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                Google Calendar <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={bookingResponse.outlookCalendarUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-sans font-semibold text-neutral-600 dark:text-neutral-400 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                Outlook <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                if (onClose) onClose();
                else setStep(1); // reset
              }}
              className="px-8 py-3.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-sans font-bold tracking-widest uppercase rounded-full cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
