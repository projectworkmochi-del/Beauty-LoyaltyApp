import { createContext, useContext, useState, ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PointsHistoryEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  points: number;
  type: "earned" | "used" | "expired";
}

export interface CreditsHistoryEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  amount: number;
  type: "topup" | "earned" | "used" | "expired";
}

export interface VoucherEntry {
  id: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  minSpend?: string;
  pointsCost?: number;
  type: "discount" | "free" | "cashback";
  status: "available" | "redeemed" | "expired";
}

export interface GiftCardTransaction {
  id: string;
  type: "sent" | "redeemed";
  design: string;
  designEmoji: string;
  amount: number;
  recipient?: string;
  message?: string;
  code?: string;
  date: string;
  time: string;
}

export interface BookedAppointment {
  id: string;
  service: string;
  branch: string;
  date: string;
  time: string;
  customer: string;
  status: "booked" | "pending" | "cancelled" | "noshow";
  section: "ongoing" | "upcoming" | "pending";
}

export interface TreatmentRecord {
  id: string;
  service: string;
  outlet: string;
  stylist: string;
  date: string;
  time: string;
  duration: string;
  productsUsed: string[];
  formulaNotes: string;
  pointsEarned: number;
  amount: number;
  status: "completed" | "noshow" | "cancelled";
  rated?: boolean;
  rating?: number;
}

// ── Tier system ────────────────────────────────────────────────────────────────
export interface TierInfo {
  name: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  minPoints: number;
  maxPoints: number | null;
  multiplier: number;
  discountPct: number;
  nextTier: string | null;
}

export const TIERS: TierInfo[] = [
  {
    name: "Rose",
    color: "#db43ae",
    gradientFrom: "#db43ae",
    gradientTo: "#e870cc",
    minPoints: 0,
    maxPoints: 499,
    multiplier: 1,
    discountPct: 0,
    nextTier: "Orchid",
  },
  {
    name: "Orchid",
    color: "#9b59b6",
    gradientFrom: "#9b59b6",
    gradientTo: "#c39bd3",
    minPoints: 500,
    maxPoints: 1499,
    multiplier: 1.5,
    discountPct: 5,
    nextTier: "Jasmine",
  },
  {
    name: "Jasmine",
    color: "#e67e22",
    gradientFrom: "#e67e22",
    gradientTo: "#f0a500",
    minPoints: 1500,
    maxPoints: 2999,
    multiplier: 2,
    discountPct: 10,
    nextTier: "Diamond",
  },
  {
    name: "Diamond",
    color: "#2980b9",
    gradientFrom: "#2980b9",
    gradientTo: "#5dade2",
    minPoints: 3000,
    maxPoints: null,
    multiplier: 3,
    discountPct: 15,
    nextTier: null,
  },
];

export function getTierInfo(totalPointsEarned: number): TierInfo {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (totalPointsEarned >= TIERS[i].minPoints) return TIERS[i];
  }
  return TIERS[0];
}

export function getTierProgress(totalPointsEarned: number): number {
  const tier = getTierInfo(totalPointsEarned);
  if (!tier.maxPoints) return 100;
  const range = tier.maxPoints - tier.minPoints + 1;
  const progress = totalPointsEarned - tier.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}

// ── Initial data ───────────────────────────────────────────────────────────────

const initialPointsHistory: PointsHistoryEntry[] = [
  { id: "ph1", title: "Hair Color Service", description: "Points earned from appointment", date: "2026-03-10", points: 200, type: "earned" },
  { id: "ph2", title: "Daily Check-In", description: "Points reward from Daily Check-In", date: "2026-03-09", points: 5, type: "earned" },
  { id: "ph3", title: "Special Discount Redeem", description: "Redeem for 10% discount voucher", date: "2026-03-08", points: -150, type: "used" },
  { id: "ph4", title: "Hair Treatment Package", description: "Points earned from package purchase", date: "2026-02-20", points: 150, type: "earned" },
  { id: "ph5", title: "Daily Check-In", description: "Points reward from Daily Check-In", date: "2026-02-15", points: 5, type: "earned" },
  { id: "ph6", title: "Welcome Bonus", description: "Points reward for new member", date: "2026-01-01", points: 100, type: "earned" },
  { id: "ph7", title: "Bonus Points Expired", description: "Points expired after 6 months", date: "2025-12-31", points: -20, type: "expired" },
];

const initialCreditsHistory: CreditsHistoryEntry[] = [
  { id: "ch1", title: "Top Up - Bank Transfer", description: "Credits top up via bank transfer", date: "2026-03-10", amount: 100, type: "topup" },
  { id: "ch2", title: "Hair Treatment Package", description: "Payment for Hair Treatment", date: "2026-03-08", amount: -50, type: "used" },
  { id: "ch3", title: "Welcome Bonus Credits", description: "Credits reward for new member", date: "2026-01-01", amount: 30, type: "earned" },
  { id: "ch4", title: "Referral Reward", description: "Credits earned from referral", date: "2026-02-25", amount: 20, type: "earned" },
  { id: "ch5", title: "Hair Color Service", description: "Payment for Hair Color", date: "2026-02-20", amount: -80, type: "used" },
  { id: "ch6", title: "Expired Credits", description: "Credits expired after 12 months", date: "2025-12-31", amount: -10, type: "expired" },
];

const initialVouchers: VoucherEntry[] = [
  { id: "v1", title: "10% Off Hair Treatment", description: "Valid for any hair treatment service", discount: "10% OFF", expiryDate: "31 Dec 2026", minSpend: "RM 80.00", type: "discount", status: "available" },
  { id: "v2", title: "Free Hair Wash", description: "Complimentary hair wash with any service", discount: "FREE", expiryDate: "30 Sep 2026", type: "free", status: "available" },
  { id: "v3", title: "RM 15 Cashback", description: "Cashback to credits wallet", discount: "RM 15 BACK", expiryDate: "30 Nov 2026", minSpend: "RM 100.00", pointsCost: 150, type: "cashback", status: "available" },
  { id: "v4", title: "Birthday Special - 30% Off", description: "Happy Birthday! Your special month discount", discount: "30% OFF", expiryDate: "31 Mar 2026", type: "discount", status: "available" },
  { id: "v5", title: "20% Off First Package", description: "Discount on your first package purchase", discount: "20% OFF", expiryDate: "31 Aug 2025", type: "discount", status: "redeemed" },
  { id: "v6", title: "Welcome Voucher 15% Off", description: "New member welcome discount", discount: "15% OFF", expiryDate: "31 Jul 2025", type: "discount", status: "expired" },
];

const initialGiftCardTransactions: GiftCardTransaction[] = [
  { id: "g1", type: "sent", design: "You're My Star", designEmoji: "✨", amount: 50, recipient: "Alice Tan", message: "Happy Birthday!", date: "2026-02-15", time: "10:00 AM" },
  { id: "g2", type: "redeemed", design: "Happy Birthday", designEmoji: "🎂", amount: 30, code: "LUXE30", date: "2026-02-16", time: "11:00 AM" },
];

const initialAppointments: BookedAppointment[] = [
  { id: "a1", service: "Hair Color + Treatment", branch: "Kuchai Lama Branch", date: "15 Mar 2026", time: "2:00 PM", customer: "Joanne Chan", status: "booked", section: "upcoming" },
  { id: "a2", service: "Facial Deep Cleansing", branch: "Bangsar Branch", date: "22 Mar 2026", time: "11:00 AM", customer: "Joanne Chan", status: "pending", section: "pending" },
];

const initialHistoryAppointments: BookedAppointment[] = [
  { id: "h1", service: "Hair Color", branch: "Kuchai Lama Branch", date: "10 Mar 2026", time: "3:00 PM", customer: "Joanne Chan", status: "booked", section: "upcoming" },
  { id: "h2", service: "Women's Haircut", branch: "Kuchai Lama Branch", date: "20 Feb 2026", time: "11:00 AM", customer: "Joanne Chan", status: "booked", section: "upcoming" },
  { id: "h3", service: "Hair Bleach", branch: "Bangsar Branch", date: "05 Jan 2026", time: "3:00 PM", customer: "Joanne Chan", status: "noshow", section: "upcoming" },
  { id: "h4", service: "Facial", branch: "Kuchai Lama Branch", date: "12 Dec 2025", time: "2:30 PM", customer: "Joanne Chan", status: "cancelled", section: "upcoming" },
];

const initialTreatmentRecords: TreatmentRecord[] = [
  {
    id: "tr1",
    service: "Hair Color + Treatment",
    outlet: "Kuchai Lama Branch",
    stylist: "Sofia Grace",
    date: "10 Mar 2026",
    time: "3:00 PM",
    duration: "2h 30min",
    productsUsed: ["L'Oréal INOA 6.35 (Dark Blonde Gold)", "Olaplex No.3 Treatment", "Redken All Soft Shampoo"],
    formulaNotes: "Base: 6.35 + 10vol developer. Toner: 9.13 + 20vol for 15 mins. Client prefers warm golden tones. Avoid roots for 1cm.",
    pointsEarned: 200,
    amount: 200,
    status: "completed",
    rated: true,
    rating: 5,
  },
  {
    id: "tr2",
    service: "Women's Haircut & Blow-Dry",
    outlet: "Kuchai Lama Branch",
    stylist: "Amira Belle",
    date: "20 Feb 2026",
    time: "11:00 AM",
    duration: "1h 15min",
    productsUsed: ["Wella EIMI Thermal Image", "Kerastase Discipline Smoothing Fluid"],
    formulaNotes: "Mid-length layers, face-framing. Trim 2cm. Client has fine hair — avoid heavy products. C-curl blow-dry finish.",
    pointsEarned: 50,
    amount: 50,
    status: "completed",
    rated: false,
  },
  {
    id: "tr3",
    service: "Hair Treatment + Scalp Care",
    outlet: "Bangsar Branch",
    stylist: "Chloe Rivera",
    date: "20 Jan 2026",
    time: "1:00 PM",
    duration: "1h 45min",
    productsUsed: ["Olaplex No.1 Bond Multiplier", "Olaplex No.2 Bond Perfector", "Davines OI Shampoo"],
    formulaNotes: "Deep bond repair treatment. 3 rounds of Olaplex application. Scalp massage with tea tree serum. Follow-up in 4 weeks recommended.",
    pointsEarned: 150,
    amount: 150,
    status: "completed",
    rated: true,
    rating: 4,
  },
  {
    id: "tr4",
    service: "Hair Bleach + Toning",
    outlet: "Bangsar Branch",
    stylist: "Sofia Grace",
    date: "05 Jan 2026",
    time: "10:00 AM",
    duration: "3h 00min",
    productsUsed: ["Wella Blondor Multi Blonde", "Wella Color Touch 9/01 Toner", "Olaplex No.3 Home Care"],
    formulaNotes: "Full head bleach to Level 9. Blue/silver toner applied for 20 mins. Client should use purple shampoo weekly to maintain tone.",
    pointsEarned: 280,
    amount: 280,
    status: "completed",
    rated: false,
  },
];

export const BEAUTY_REMINDERS = [
  { id: "br1", icon: "💇‍♀️", label: "Hair Colour Touch-Up", daysLeft: 12, urgency: "soon" as const, tip: "Your colour was done 6 weeks ago. Time for a touch-up!" },
  { id: "br2", icon: "✨", label: "Facial Due", daysLeft: 25, urgency: "upcoming" as const, tip: "Monthly facial recommended for optimal skin health." },
  { id: "br3", icon: "👁️", label: "Lash Refill Due", daysLeft: 5, urgency: "urgent" as const, tip: "Lash fills are recommended every 2–3 weeks." },
];

// ── Context shape ──────────────────────────────────────────────────────────────

interface AppContextType {
  // Points
  points: number;
  totalPointsEarned: number;
  pointsHistory: PointsHistoryEntry[];
  addPoints: (amount: number, title: string, description: string) => void;
  deductPoints: (amount: number, title: string, description: string) => void;

  // Tier
  tier: TierInfo;
  tierProgress: number;

  // Credits
  credits: number;
  creditsHistory: CreditsHistoryEntry[];
  addCredits: (amount: number, title: string, description: string) => void;
  deductCredits: (amount: number, title: string, description: string) => void;

  // Vouchers
  vouchers: VoucherEntry[];
  redeemVoucher: (id: string) => void;

  // Gift Cards
  giftCardTransactions: GiftCardTransaction[];
  sendGiftCard: (design: string, designEmoji: string, amount: number, recipient: string, message: string) => void;
  redeemGiftCard: (code: string, amount: number) => void;

  // Appointments
  appointments: BookedAppointment[];
  historyAppointments: BookedAppointment[];
  addAppointment: (appt: Omit<BookedAppointment, "id">) => void;
  cancelAppointment: (id: string) => void;

  // Treatment History
  treatmentRecords: TreatmentRecord[];
  addTreatmentRecord: (record: Omit<TreatmentRecord, "id">) => void;
  rateTreatment: (id: string, rating: number) => void;

  // Check-in
  checkedInToday: boolean;
  doCheckIn: () => void;
}

// ── Context & Provider ─────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(290);
  const [totalPointsEarned, setTotalPointsEarned] = useState(510);
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryEntry[]>(initialPointsHistory);

  const [credits, setCredits] = useState(120);
  const [creditsHistory, setCreditsHistory] = useState<CreditsHistoryEntry[]>(initialCreditsHistory);

  const [vouchers, setVouchers] = useState<VoucherEntry[]>(initialVouchers);
  const [giftCardTransactions, setGiftCardTransactions] = useState<GiftCardTransaction[]>(initialGiftCardTransactions);
  const [appointments, setAppointments] = useState<BookedAppointment[]>(initialAppointments);
  const [historyAppointments, setHistoryAppointments] = useState<BookedAppointment[]>(initialHistoryAppointments);
  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentRecord[]>(initialTreatmentRecords);
  const [checkedInToday, setCheckedInToday] = useState(false);

  const tier = getTierInfo(totalPointsEarned);
  const tierProgress = getTierProgress(totalPointsEarned);

  const today = new Date().toISOString().split("T")[0];

  const addPoints = (amount: number, title: string, description: string) => {
    setPoints((p) => p + amount);
    setTotalPointsEarned((t) => t + amount);
    setPointsHistory((h) => [
      { id: `ph${Date.now()}`, title, description, date: today, points: amount, type: "earned" },
      ...h,
    ]);
  };

  const deductPoints = (amount: number, title: string, description: string) => {
    setPoints((p) => Math.max(0, p - amount));
    setPointsHistory((h) => [
      { id: `ph${Date.now()}`, title, description, date: today, points: -amount, type: "used" },
      ...h,
    ]);
  };

  const addCredits = (amount: number, title: string, description: string) => {
    setCredits((c) => c + amount);
    setCreditsHistory((h) => [
      { id: `ch${Date.now()}`, title, description, date: today, amount, type: "topup" },
      ...h,
    ]);
  };

  const deductCredits = (amount: number, title: string, description: string) => {
    setCredits((c) => Math.max(0, c - amount));
    setCreditsHistory((h) => [
      { id: `ch${Date.now()}`, title, description, date: today, amount: -amount, type: "used" },
      ...h,
    ]);
  };

  const redeemVoucher = (id: string) => {
    setVouchers((vs) =>
      vs.map((v) => (v.id === id ? { ...v, status: "redeemed" as const } : v))
    );
  };

  const sendGiftCard = (design: string, designEmoji: string, amount: number, recipient: string, message: string) => {
    const now = new Date();
    setGiftCardTransactions((prev) => [
      {
        id: `g${Date.now()}`,
        type: "sent",
        design,
        designEmoji,
        amount,
        recipient,
        message,
        date: today,
        time: now.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);
  };

  const redeemGiftCard = (code: string, amount: number) => {
    const now = new Date();
    setGiftCardTransactions((prev) => [
      {
        id: `g${Date.now()}`,
        type: "redeemed",
        design: "Gift Card",
        designEmoji: "🎁",
        amount,
        code,
        date: today,
        time: now.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);
  };

  const addAppointment = (appt: Omit<BookedAppointment, "id">) => {
    const newAppt: BookedAppointment = { ...appt, id: `a${Date.now()}` };
    setAppointments((prev) => [newAppt, ...prev]);
  };

  const cancelAppointment = (id: string) => {
    const appt = appointments.find((a) => a.id === id);
    if (appt) {
      setHistoryAppointments((h) => [{ ...appt, status: "cancelled" as const }, ...h]);
    }
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const addTreatmentRecord = (record: Omit<TreatmentRecord, "id">) => {
    const newRecord: TreatmentRecord = { ...record, id: `tr${Date.now()}` };
    setTreatmentRecords((prev) => [newRecord, ...prev]);
  };

  const rateTreatment = (id: string, rating: number) => {
    setTreatmentRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rated: true, rating } : r))
    );
  };

  const doCheckIn = () => {
    if (!checkedInToday) {
      setCheckedInToday(true);
      addPoints(5, "Daily Check-In", "Points reward from Daily Check-In");
    }
  };

  return (
    <AppContext.Provider
      value={{
        points, totalPointsEarned, pointsHistory, addPoints, deductPoints,
        tier, tierProgress,
        credits, creditsHistory, addCredits, deductCredits,
        vouchers, redeemVoucher,
        giftCardTransactions, sendGiftCard, redeemGiftCard,
        appointments, historyAppointments, addAppointment, cancelAppointment,
        treatmentRecords, addTreatmentRecord, rateTreatment,
        checkedInToday, doCheckIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
