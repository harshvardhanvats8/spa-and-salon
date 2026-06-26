import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// -------------------------------------------------------------
// IN-MEMORY DATABASE SEEDS & STORAGE
// -------------------------------------------------------------

// Active bookings
interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string;
  time: string;
  price: number;
  status: "pending" | "confirmed" | "rescheduled" | "cancelled";
  addOns: { name: string; price: number }[];
  notes?: string;
  createdAt: string;
}

// In-memory collections
let bookings: Booking[] = [
  {
    id: "B-1001",
    customerName: "Eleanor Vance",
    customerEmail: "eleanor@luxury.com",
    customerPhone: "+1 (555) 019-2834",
    serviceId: "skin-really-good-facial",
    serviceName: "The Really Good Facial",
    staffId: "staff-olivia",
    staffName: "Olivia Westwood",
    date: "2026-06-28",
    time: "10:00 AM",
    price: 140,
    status: "confirmed",
    addOns: [{ name: "Collagen Eye Mask", price: 25 }],
    createdAt: "2026-06-24T10:30:00Z",
  },
  {
    id: "B-1002",
    customerName: "Sebastian Mercer",
    customerEmail: "sebastian@prestige.com",
    customerPhone: "+1 (555) 014-9988",
    serviceId: "hair-royal-grooming",
    serviceName: "Men's Royal Grooming",
    staffId: "staff-marcus",
    staffName: "Marcus Sterling",
    date: "2026-06-29",
    time: "02:30 PM",
    price: 95,
    status: "confirmed",
    addOns: [{ name: "Beard Beard Oil Treatment", price: 15 }],
    createdAt: "2026-06-25T14:15:00Z",
  },
  {
    id: "B-1003",
    customerName: "Genevieve Thorne",
    customerEmail: "genevieve@hautecouture.com",
    customerPhone: "+1 (555) 018-7711",
    serviceId: "skin-dermaplaning",
    serviceName: "Dermaplaning Radiance",
    staffId: "staff-clara",
    staffName: "Clara Vance",
    date: "2026-06-27",
    time: "11:30 AM",
    price: 120,
    status: "confirmed",
    addOns: [],
    createdAt: "2026-06-23T09:00:00Z",
  }
];

// Custom User Profile/Dashboard Data
let userProfile = {
  name: "Sophia Sterling",
  email: "harshvardhanvats8@gmail.com", // Bound to current user
  phone: "+1 (555) LUX-GLOW",
  membership: "Gold",
  rewardPoints: 1250,
  balance: 350.0,
  favoriteStaffId: "staff-olivia",
  favoriteStaffName: "Olivia Westwood",
  savedServices: ["skin-really-good-facial", "spa-cryo-globe-massage"],
  achievements: [
    { id: "first-glow", name: "First Glow", desc: "Booked your first treatment", unlocked: true, date: "2026-05-15" },
    { id: "gold-standard", name: "Gold Standard", desc: "Upgraded to Gold Elite tier", unlocked: true, date: "2026-06-01" },
    { id: "product-maven", name: "Product Maven", desc: "Purchased high-end home care", unlocked: false }
  ]
};

// Services Data (Matching High-end LXNARIA branding and visual layout)
const services = [
  {
    id: "skin-really-good-facial",
    category: "skin",
    name: "The Really Good Facial",
    price: 140,
    duration: "60 min",
    rating: 4.9,
    description: "The 60-minute personalized facial that transforms your skin and renews your confidence.",
    suitableFor: "All skin types, especially skin exhibiting fatigue, mild congestion, or loss of radiance.",
    benefits: [
      "Deep pore purging & removal of cellular debris",
      "Stimulates natural lymphatic drainage",
      "Infuses specialized peptide arrays for deep skin repair",
      "Plumps fine lines with ultra-low molecular hyaluronic acid"
    ],
    productsUsed: ["Aesop Parsley Seed Cleanser", "Dior L'Or de Vie Concentrate", "LXNARIA Custom Glow Elixir"],
    beforeAfterGallery: [
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600"
    ],
    reviews: [
      { author: "Melissa P.", text: "My favorite stress reliever. There's nothing like ending the month with a visit to Lunaria.", rating: 5, date: "Jun 28, 2025" },
      { author: "Sophie L.", text: "The atmosphere is so calming, the staff are always attentive, and I leave feeling like a new person.", rating: 5, date: "Jul 6, 2025" }
    ],
    addOns: [
      { name: "Collagen Eye Mask Boost", price: 25 },
      { name: "LED Red Light Therapy", price: 30 },
      { name: "Cryo-Globe Eye Sculpt", price: 35 }
    ]
  },
  {
    id: "skin-dermaplaning",
    category: "skin",
    name: "Dermaplaning Radiance",
    price: 120,
    duration: "60 min",
    rating: 4.8,
    description: "Removes dead skin cells and fine peach fuzz for a soft, smooth, incredibly radiant finish.",
    suitableFor: "Dull complexions, rough skin texture, and fine facial hairs.",
    benefits: [
      "Instantly smoother cosmetic application",
      "Enhances skincare product penetration by 80%",
      "Smooths skin texture and dry patches",
      "Zero downtime, instant light-reflecting glow"
    ],
    productsUsed: ["Aesop Purifying Facial Cream", "LXNARIA Soothing Squalane Serum"],
    beforeAfterGallery: [
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600"
    ],
    reviews: [
      { author: "Chloe R.", text: "My makeup has never looked this flawless. Dermaplaning here is an absolute ritual.", rating: 5, date: "May 12, 2026" }
    ],
    addOns: [
      { name: "Vitamin C Hydration Mask", price: 20 },
      { name: "Cooling Jade Roller Massage", price: 15 }
    ]
  },
  {
    id: "skin-enzyme-exfoliation",
    category: "skin",
    name: "Enzyme Exfoliation Treatment",
    price: 110,
    duration: "45 min",
    rating: 4.7,
    description: "Manual pore cleansing combined with organic fruit enzymes to remove blackheads, congestion, and impurities without irritation.",
    suitableFor: "Sensitive skin, congested pores, acne-prone or reactive skin.",
    benefits: [
      "Gentle exfoliation using papaya and pineapple enzymes",
      "Reduces active breakouts and redness",
      "Refines dilated pore walls",
      "Comforting cold compress finish"
    ],
    productsUsed: ["Aesop Chamomile Anti-Blemish Masque", "Dior HydrAction Skin System"],
    beforeAfterGallery: [],
    reviews: [],
    addOns: [
      { name: "High-Frequency Sanitizing Lift", price: 20 }
    ]
  },
  {
    id: "skin-high-frequency",
    category: "skin",
    name: "High Frequency Purifier",
    price: 90,
    duration: "30 min",
    rating: 4.8,
    description: "Calms acne, boosts healing, and improves blood circulation using gentle electrical currents and ozone.",
    suitableFor: "Active breakouts, blemish-prone skin, uneven tone.",
    benefits: [
      "Eliminates acne-causing bacteria sub-epidermally",
      "Reduces healing time of blemishes by 50%",
      "Increases oxygenation to the outer layers",
      "Refines and tightens the look of large pores"
    ],
    productsUsed: ["LXNARIA Tea Tree Purifier", "Aesop Control Gel"],
    beforeAfterGallery: [],
    reviews: [],
    addOns: []
  },
  {
    id: "skin-purelift-technology",
    category: "skin",
    name: "PureLift Face Sculpting",
    price: 160,
    duration: "60 min",
    rating: 5.0,
    description: "Microcurrent lifts and tones facial muscles for a firmer, younger-looking skin contour.",
    suitableFor: "Lax skin, loss of structural definition, saggy jawline.",
    benefits: [
      "Instant non-invasive cheekbone & jawline sculpting",
      "Boosts cellular ATP and natural collagen production",
      "Dramatically reduces under-eye puffiness",
      "Creates a firm, contoured aesthetic perfect for events"
    ],
    productsUsed: ["Dior Prestige La Micro-Huile", "LXNARIA Platinum Conductivity Gel"],
    beforeAfterGallery: [],
    reviews: [],
    addOns: [
      { name: "Gold Foil Peptide Infusion", price: 40 }
    ]
  },
  {
    id: "spa-cryo-globe-massage",
    category: "spa",
    name: "Cryo Globe Massage & Lift",
    price: 95,
    duration: "30 min",
    rating: 4.9,
    description: "Cooling ice globes reduce puffiness, soothe inflammation, and boost microcirculation for a radiant, sculpted cheek contour.",
    suitableFor: "Inflamed, hot, puffy skin or sinus congestion.",
    benefits: [
      "Reduces face puffiness and under-eye bags instantly",
      "Constricts vascular networks to soothe redness",
      "Provides luxurious, therapeutic lymphatic relief",
      "Tones and tightens facial appearance"
    ],
    productsUsed: ["Aesop Seeking Silence Moisturizer", "Dior Hydra Life Sorbet"],
    beforeAfterGallery: [],
    reviews: [],
    addOns: []
  },
  {
    id: "hair-royal-grooming",
    category: "grooming",
    name: "Men's Royal Grooming",
    price: 95,
    duration: "45 min",
    rating: 4.9,
    description: "Tailored luxury haircut accompanied by a relaxing hot towel treatment, straight-razor shave, and luxury head massage.",
    suitableFor: "Modern gentlemen seeking precision cutting and unparalleled spa relaxation.",
    benefits: [
      "Precision scissoring or clipper contouring",
      "Hot steam infusion with essential tea tree oils",
      "Invigorating scalp acupressure session",
      "Complimentary scotch or single-origin cold brew"
    ],
    productsUsed: ["Dyson Professional Styling Array", "Aesop Sage Hair Paste", "LXNARIA Cedarwood Beard Nourish"],
    beforeAfterGallery: [],
    reviews: [],
    addOns: [
      { name: "Silver Hair Detox Wash", price: 20 },
      { name: "Nose & Ear Waxing Refinement", price: 15 }
    ]
  },
  {
    id: "hair-color-couture",
    category: "hair",
    name: "Couture Balayage & Glaze",
    price: 280,
    duration: "180 min",
    rating: 5.0,
    description: "Custom hand-painted French balayage, customized root shadows, and a luxurious shine glaze.",
    suitableFor: "Natural-looking multidimensional blonde, brunette, or copper tones.",
    benefits: [
      "Seamless growth transitions with no stark lines",
      "High-shine gloss coating protects hair cuticle",
      "Bond-building formulation to safeguard fiber elasticity",
      "Dyson Supersonic luxurious signature blowout"
    ],
    productsUsed: ["L'Oreal Professionnel Smartbond", "Dior Hair Mist Infusion", "Dyson Airwrap Styler"],
    beforeAfterGallery: [],
    reviews: [],
    addOns: [
      { name: "Olaplex Intensive Treatment", price: 50 },
      { name: "K18 Peptide Shield Upgrade", price: 45 }
    ]
  }
];

// Stylists / Team members
const staff = [
  {
    id: "staff-olivia",
    name: "Olivia Westwood",
    role: "Master Esthetician & Skin Director",
    rating: 4.9,
    experience: "12 Years",
    specialization: "Advanced Non-Invasive Anti-Aging & Skin Purifying",
    bio: "Olivia spent a decade training in Zurich and Paris. She specializes in crafting bespoke skin diets and high-performance peptide infusions.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    instagram: "@olivia_skin_couture",
    awards: ["Vogue Skin Professional of the Year 2024", "Swiss Aesthetic Guild Gold Medal"],
    availability: ["Monday", "Tuesday", "Thursday", "Friday"]
  },
  {
    id: "staff-marcus",
    name: "Marcus Sterling",
    role: "Senior Grooming Architect",
    rating: 4.9,
    experience: "8 Years",
    specialization: "Precision Scissor Cuts & Beard Sculpting",
    bio: "Marcus combines classic British barbering with modern structure. Known for his flawless razor fades and premium head massage techniques.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    instagram: "@marcus_cuts_prestige",
    awards: ["Best Barber Finalist 2025", "Dyson Master Class Instructor"],
    availability: ["Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "staff-clara",
    name: "Clara Vance",
    role: "Creative Hair & Color Couture Expert",
    rating: 5.0,
    experience: "15 Years",
    specialization: "Balayage Artistry & Keratin Sculpting",
    bio: "Clara has styled for London Fashion Week and is LUNARIA's principal color alchemist, delivering vibrant, healthy hair fiber transformations.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    instagram: "@clara_color_architect",
    awards: ["L'Oreal Color Trophy Winner 2023", "British Hair Awards Icon"],
    availability: ["Tuesday", "Wednesday", "Friday", "Saturday"]
  }
];

// Online Store Products
const products = [
  {
    id: "prod-aesop-parsley",
    name: "Aesop Parsley Seed Anti-Oxidant Serum",
    brand: "Aesop",
    price: 85,
    category: "Skin Care",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=500",
    description: "A lightweight, antioxidant-rich daily facial hydration serum. Ideal for urban dwellers.",
    reviewsCount: 342,
    inStock: true
  },
  {
    id: "prod-dior-prestige",
    name: "Dior Prestige La Crème Essential",
    brand: "Dior Beauty",
    price: 390,
    category: "Luxury Skin Care",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=500",
    description: "The ultimate luxury cellular restructuring cream made with Rose de Granville extracts.",
    reviewsCount: 118,
    inStock: true
  },
  {
    id: "prod-dyson-supersonic",
    name: "Dyson Supersonic Hair Dryer (Special Edition)",
    brand: "Dyson Beauty",
    price: 429,
    category: "Styling Tech",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=500",
    description: "Intelligent heat control designed for fast drying and protecting hair from extreme heat.",
    reviewsCount: 1530,
    inStock: true
  },
  {
    id: "prod-lxnaria-elixir",
    name: "LXNARIA Midnight Glow Botanical Oil",
    brand: "LXNARIA Organic",
    price: 115,
    category: "Skin Care",
    rating: 4.95,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=500",
    description: "Our signature in-house blend of organic blue tansy, squalane, and gold peptides for sleep repair.",
    reviewsCount: 89,
    inStock: true
  }
];

// SEO Optimized Blog Posts
const blogPosts = [
  {
    id: "blog-skin-barrier",
    title: "The Silent Barrier: Restoring Corneum Integrity in Urban Environments",
    category: "Skin Care",
    readTime: "6 min read",
    snippet: "Urban pollution can compromise your skin's protective lipid mantle. Learn the core steps to shield, lock, and restore moisture using ceramides and adaptogens.",
    author: "Olivia Westwood",
    date: "June 15, 2026",
    content: "Our skin barrier is our shield. When exposed to daily pollutants, micro-particulates infiltrate the pores, generating oxidative stress. To counteract this, a dual-defense routine consisting of non-foaming oil-based cleansers, stabilized Vitamin C, and biocompatible squalane is vital..."
  },
  {
    id: "blog-balayage-science",
    title: "Couture Highlights: The Science of Minimizing Damage During Balayage",
    category: "Hair Care",
    readTime: "8 min read",
    snippet: "Hand-painted blonde shouldn't compromise the structure of your hair. Clara Vance breaks down chemical pre-treatment, bond protection, and lipid sealing.",
    author: "Clara Vance",
    date: "June 20, 2026",
    content: "Lifting pigment requires swelling the hair cuticle. In traditional salons, this process damages the disulfide bonds that give hair its strength. At LXNARIA, we use specialized amino acid chains and localized thermal shields to maintain maximum cortical integrity..."
  }
];

// Coupons / Promotions
const coupons = [
  { code: "LUNARIAGLOW", discount: 20, type: "percent", desc: "20% off your first luxury treatment" },
  { code: "MEMBERSHIP10", discount: 10, type: "percent", desc: "10% off any premium membership tier" },
  { code: "SPA50", discount: 50, type: "fixed", desc: "$50 off any spa service exceeding $150" }
];

// -------------------------------------------------------------
// BACKEND ROUTING / REST API
// -------------------------------------------------------------

// Core Application Status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString(), brand: "LXNARIA" });
});

// 1. Get all services
app.get("/api/services", (req, res) => {
  res.json(services);
});

// 2. Get all staff
app.get("/api/staff", (req, res) => {
  res.json(staff);
});

// 3. Get all store products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// 4. Get blog posts
app.get("/api/blog", (req, res) => {
  res.json(blogPosts);
});

// 5. Customer Profile
app.get("/api/profile", (req, res) => {
  res.json(userProfile);
});

// Update Profile Favorites/Saved
app.post("/api/profile/save-service", (req, res) => {
  const { serviceId } = req.body;
  if (!serviceId) return res.status(400).json({ error: "Service ID required" });
  if (userProfile.savedServices.includes(serviceId)) {
    userProfile.savedServices = userProfile.savedServices.filter(id => id !== serviceId);
  } else {
    userProfile.savedServices.push(serviceId);
  }
  res.json({ savedServices: userProfile.savedServices });
});

// Join Membership Tier
app.post("/api/profile/join-membership", (req, res) => {
  const { tier } = req.body;
  if (!["Bronze", "Silver", "Gold", "Platinum"].includes(tier)) {
    return res.status(400).json({ error: "Invalid membership tier" });
  }
  userProfile.membership = tier;
  userProfile.rewardPoints += 250; // Welcome reward points
  res.json({ success: true, profile: userProfile });
});

// 6. Bookings endpoints
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// Create a new booking (Validates, checks timeslots, returns real calendar metadata)
app.post("/api/bookings", (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    serviceId,
    staffId,
    date,
    time,
    addOns,
    notes,
    couponCode
  } = req.body;

  if (!customerName || !customerEmail || !serviceId || !staffId || !date || !time) {
    return res.status(400).json({ error: "Missing required booking details" });
  }

  // Find service and staff details
  const service = services.find(s => s.id === serviceId);
  const selectedStaff = staff.find(st => st.id === staffId);

  if (!service) return res.status(404).json({ error: "Service not found" });
  if (!selectedStaff) return res.status(404).json({ error: "Staff stylist not found" });

  // Calculate base & final price
  let basePrice = service.price;
  let selectedAddOns: { name: string; price: number }[] = [];

  if (addOns && Array.isArray(addOns)) {
    addOns.forEach((addOnName: string) => {
      const match = service.addOns.find(a => a.name === addOnName);
      if (match) {
        selectedAddOns.push({ name: match.name, price: match.price });
        basePrice += match.price;
      }
    });
  }

  // Apply Coupon if exists
  let discountAmount = 0;
  if (couponCode) {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon) {
      if (coupon.type === "percent") {
        discountAmount = (basePrice * coupon.discount) / 100;
      } else if (coupon.type === "fixed") {
        discountAmount = coupon.discount;
      }
    }
  }

  const finalPrice = Math.max(0, basePrice - discountAmount);

  // Check timeslot conflict
  const isConflict = bookings.some(
    b => b.staffId === staffId && b.date === date && b.time === time && b.status !== "cancelled"
  );

  if (isConflict) {
    return res.status(409).json({
      error: `Stylist ${selectedStaff.name} is already booked at ${time} on ${date}. Please select an alternative hour.`,
      suggestedTimes: ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"]
    });
  }

  // Create real booking
  const newBooking: Booking = {
    id: `B-${1000 + bookings.length + 1}`,
    customerName,
    customerEmail,
    customerPhone: customerPhone || "+1 (555) 000-0000",
    serviceId,
    serviceName: service.name,
    staffId,
    staffName: selectedStaff.name,
    date,
    time,
    price: finalPrice,
    status: "confirmed",
    addOns: selectedAddOns,
    notes,
    createdAt: new Date().toISOString(),
  };

  bookings.unshift(newBooking);

  // Add loyalty points
  userProfile.rewardPoints += Math.floor(finalPrice * (userProfile.membership === "Platinum" ? 1.5 : userProfile.membership === "Gold" ? 1.2 : 1.0));

  res.status(201).json({
    success: true,
    message: "Appointment confirmed with luxury caliber.",
    booking: newBooking,
    googleCalendarUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=LXNARIA+-+${encodeURIComponent(service.name)}&dates=${date.replace(/-/g, "")}T090000Z/${date.replace(/-/g, "")}T100000Z&details=${encodeURIComponent(notes || "Luxury salon treatment")}++Stylist:+${encodeURIComponent(selectedStaff.name)}&sf=true&output=xml`,
    outlookCalendarUrl: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=LXNARIA+-+${encodeURIComponent(service.name)}&startdt=${date}T09:00:00Z&enddt=${date}T10:00:00Z&body=${encodeURIComponent(notes || "")}`,
  });
});

// Cancel booking
app.patch("/api/bookings/:id/cancel", (req, res) => {
  const { id } = req.params;
  const booking = bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  booking.status = "cancelled";
  res.json({ success: true, booking });
});

// Reschedule booking
app.patch("/api/bookings/:id/reschedule", (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;
  if (!date || !time) return res.status(400).json({ error: "Date and time required" });

  const booking = bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  booking.date = date;
  booking.time = time;
  booking.status = "rescheduled";
  res.json({ success: true, booking });
});

// 7. Interactive AI Beauty Consultation (Secure, robust server-side Gemini)
app.post("/api/consultation", async (req, res) => {
  const { skinType, hairType, age, concerns, goals, budget } = req.body;

  const systemPrompt = `You are LXNARIA's award-winning Chief AI Aesthetician, skin & hair bio-analyst, and luxury beauty routine architect.
You represent a high-end salon matching the calibers of Aesop, Dior Beauty, and luxury hotel wellness spas.
Your job is to read the user's details, skin/hair types, concerns, and goals, then output a personalized, luxury-focused wellness advisory.

IMPORTANT FORMATTING RULES:
You MUST output your response in structured MARKDOWN format.
Structure your response as follows:
1. **LUXURY BIO-ANALYSIS**: A professional, elegant, eye-opening summary analyzing why their skin/hair is reacting this way (e.g. cellular barrier failure, moisture deficit, cortical cuticle strain). Be scientific yet comforting.
2. **RECOMMENDED LXNARIA TREATMENTS**: Select 1 or 2 real LUNARIA treatments from our menu:
   - "The Really Good Facial" ($140, 60min) - deep peptide infusion, purging
   - "Dermaplaning Radiance" ($120, 60min) - exfoliating peach fuzz, product penetration
   - "Enzyme Exfoliation Treatment" ($110, 45min) - gentle enzyme clearing, pore refine
   - "High Frequency Purifier" ($90, 30min) - electrical ozone sanitizing, breakouts
   - "PureLift Face Sculpting" ($160, 60min) - microcurrent contouring, face lifter
   - "Cryo Globe Massage & Lift" ($95, 30min) - skin soothing, puffiness reducer
   - "Men's Royal Grooming" ($95, 45min) - razor haircut, massage, scotch
   - "Couture Balayage & Glaze" ($280, 180min) - customized hand-painting, bond builder
   Explain exactly why these specific menu choices are perfect for their bio-profile.
3. **BESPOKE AT-HOME REGIMEN**: Create a structured Morning (AM) & Evening (PM) skincare and hair ritual. Recommend real products (e.g. Aesop, Dior Beauty, Dyson styling tech, or LXNARIA custom blue tansy squalane elixir).
4. **DIETARY & WELLNESS MICRO-HABITS**: 2-3 advanced luxury tips (hydration schedules, antioxidant-rich teas, specialized sleep routines).

Keep the language incredibly professional, elegant, luxury-oriented, scientific, and beautiful. Do not use generic lists.`;

  const userQuery = `My biological details:
- Age: ${age || "Unspecified"}
- Skin Type/Concerns: ${skinType || "Normal"} / Concerns: ${concerns || "None specified"}
- Hair Type/Concerns: ${hairType || "Normal"}
- Primary Goals: ${goals || "Healthy glow and relaxation"}
- Budget Focus: ${budget || "Luxury tier"}
Please design my personalized aesthetic program.`;

  const aiClientInstance = getGeminiClient();

  if (aiClientInstance) {
    try {
      const result = await aiClientInstance.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userQuery,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      if (result.text) {
        return res.json({ recommendation: result.text, isRealAI: true });
      }
    } catch (error: any) {
      console.error("Gemini API error in Express server:", error);
      // Fallback to beautiful mock generator if API key fails or throttles
    }
  }

  // Graceful Fallback (Extremely rich, customized aesthetic guide matching premium expectations)
  const defaultRecommendation = `### **LXNARIA BESPOKE SKIN & HAIR REPORT**
*Crafted by LUNARIA Chief Aesthetic Council*

Thank you for trusting LXNARIA with your aesthetic journey. Based on your profile (Age: ${age || "28"}, Concerns: **${concerns || "Loss of radiance, light congestion"}**, and Goals: **${goals || "Ultimate cellular rejuvenation"}**), we have designed a cellular-active, luxury wellness program.

---

### **1. LUXURY BIO-ANALYSIS**
Your skin is exhibiting classic signs of *trans-epidermal water loss (TEWL)* coupled with mild environmental strain. The lipid corneum has become slightly desynchronized from its natural turnover cycle, causing micro-shadowing that manifests as dullness. 
For your hair profile (${hairType || "fine to medium texture"}), there is minor moisture fatigue along the cortical core, requiring a targeted infusion of essential lipids and amino acids to lock in high-gloss shine.

---

### **2. RECOMMENDED LXNARIA TREATMENTS**
We recommend combining the following in-salon therapies to reset your skin cycle:

*   **PRIMARY: The Really Good Facial ($140 | 60 Minutes)**
    *   *Why:* This clinical-luxury facial uses low-molecular hyaluronic peptides and high-performance lymph clearing to purge pollutants and plump deep cutaneous tissue. Olivia Westwood will personalize this with a collagen-boosting peptide veil.
*   **ACCENT: Cryo Globe Massage & Lift ($95 | 30 Minutes)**
    *   *Why:* Perfect for sealing the facial benefits. Cryogenic globes immediately constrict surface vascular lines, reducing puffiness and sculpting your jawline and cheek structures.

---

### **3. BESPOKE AT-HOME LUXURY REGIMEN**

**AM (Morning Shield & Plump):**
1.  **Cleanse:** *Aesop Gentle Purifying Milk* — respect the acid mantle, never strip.
2.  **Hydrate:** *LXNARIA Blue Squalane Elixir* — lightweight, barrier-identical lipid seal.
3.  **Shield:** *Dior Prestige Light-in-White UV Protector (SPF 50)* — defend from oxidative UV stressors.

**PM (Nighttime Cellular Synthesis):**
1.  **Purge:** *Aesop Parsley Seed Anti-Oxidant Facial Cleansing Oil* — lifts pollution and makeup effortlessly.
2.  **Target:** *LXNARIA Midnight Glow Botanical Oil* (Blue Tansy + Gold Peptides) — accelerates cellular division during sleep.
3.  **Seal:** *Dior Prestige La Crème* — dense, peptide-rich lipid locking cream.

---

### **4. DIETARY & WELLNESS MICRO-HABITS**
*   **The Antioxidant Infusion:** Incorporate cold-brewed white silver needle tea into your morning routine. Its polyphenols defend skin fibroblasts from within.
*   **Microcurrent Pillowcases:** Upgrade to an organic mulberry silk pillowcase (22 momme) to prevent physical fiber friction on your skin and hair cuticles.
*   **Hydration Staggering:** Sip water infused with organic cucumber and mint slowly throughout the day rather than chugging, allowing deeper cellular absorption.`;

  return res.json({
    recommendation: defaultRecommendation,
    isRealAI: false,
    message: "Using LUNARIA offline expert engine.",
  });
});

// 8. Admin SaaS / CRM Analytics Endpoint
app.get("/api/admin/analytics", (req, res) => {
  // Compute metrics dynamically from current state
  const confirmedBookings = bookings.filter(b => b.status !== "cancelled");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.price, 0) + 12450; // seeded core revenue
  const totalBookings = bookings.length + 84; // seeded starting scale

  // Popular Services counts
  const serviceCounts: Record<string, number> = {};
  bookings.forEach(b => {
    serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
  });

  const popularServices = Object.entries(serviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Peak Hours distribution
  const peakHours = [
    { hour: "09:00 AM", bookings: 12 },
    { hour: "10:00 AM", bookings: 19 },
    { hour: "11:00 AM", bookings: 25 },
    { hour: "12:00 PM", bookings: 14 },
    { hour: "01:00 PM", bookings: 8 },
    { hour: "02:30 PM", bookings: 18 },
    { hour: "04:00 PM", bookings: 22 },
  ];

  res.json({
    revenue: {
      today: confirmedBookings.filter(b => b.date === "2026-06-25").reduce((sum, b) => sum + b.price, 0) + 1450,
      monthly: totalRevenue,
      forecast: totalRevenue * 1.35,
    },
    bookingsCount: totalBookings,
    conversionRate: 4.85, // 4.85% visitor to booking rate (high conversion)
    retentionRate: 88, // 88% repeat luxury client retention
    popularServices: popularServices.length ? popularServices : [{ name: "The Really Good Facial", count: 28 }, { name: "Men's Royal Grooming", count: 18 }],
    peakHours,
    staffPerformance: [
      { name: "Olivia Westwood", bookings: 38, revenue: 5320, rating: 4.9 },
      { name: "Marcus Sterling", bookings: 29, revenue: 2755, rating: 4.9 },
      { name: "Clara Vance", bookings: 21, revenue: 5880, rating: 5.0 }
    ],
    bookingsHistory: bookings
  });
});

// Update coupon list
app.get("/api/coupons", (req, res) => {
  res.json(coupons);
});

// Apply coupon code validation
app.post("/api/coupons/validate", (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Coupon code required" });

  const match = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!match) return res.status(404).json({ error: "Invalid coupon code" });

  res.json({ success: true, coupon: match });
});


// -------------------------------------------------------------
// VITE DEV SERVER OR STATIC SERVING MIDDLEWARE
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server linked to Express middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LXNARIA Commercial Server booting gracefully on port ${PORT}`);
    console.log(`Live development environment active.`);
  });
}

startServer();
