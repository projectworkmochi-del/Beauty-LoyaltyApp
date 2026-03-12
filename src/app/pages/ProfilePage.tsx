import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Settings, Bell, ChevronRight, QrCode,
  Globe, Users, Gift, LogOut, HelpCircle, Lock,
  FileText, Phone, X, Share2, Check, MapPin,
  Scissors, Heart, Edit3
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAppContext, getTierInfo, getTierProgress, TIERS } from "../context/AppContext";

const LANGUAGES = ["English", "Bahasa Malaysia", "中文 (Chinese)", "Tamil"];
const OUTLETS = ["Kuchai Lama Branch", "Bangsar Branch", "Mont Kiara Branch", "Damansara Branch"];
const STYLISTS = ["Any Available", "Sofia Grace", "Chloe Rivera", "Amira Belle"];
const SKIN_TYPES = ["Normal", "Dry", "Oily", "Combination", "Sensitive"];
const HAIR_TYPES = ["Fine", "Medium", "Thick", "Curly", "Wavy", "Straight"];
const ALLERGY_OPTIONS = ["Ammonia", "PPD (Hair Dye)", "Peroxide", "Formaldehyde", "Fragrances", "Latex"];

type SheetType = "language" | "outlet" | "stylist" | "beauty" | "contact" | "faq" | "terms" | "privacy" | null;

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative inline-flex h-[26px] w-[46px] items-center rounded-full transition-colors cursor-pointer"
      style={{ background: value ? "#db43ae" : "#e0e0e0" }}
    >
      <span
        className="inline-block size-[20px] transform rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: value ? "translateX(22px)" : "translateX(3px)" }}
      />
    </button>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { points, credits, vouchers, totalPointsEarned } = useAppContext();
  const availableVouchers = vouchers.filter((v) => v.status === "available").length;
  const tier = getTierInfo(totalPointsEarned);
  const tierProgress = getTierProgress(totalPointsEarned);
  const nextTier = TIERS.find((t) => t.name === tier.nextTier);

  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [showQr, setShowQr] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Profile fields
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [preferredOutlet, setPreferredOutlet] = useState("Kuchai Lama Branch");
  const [favStylist, setFavStylist] = useState("Sofia Grace");

  // Beauty profile
  const [skinType, setSkinType] = useState("Combination");
  const [hairType, setHairType] = useState("Fine");
  const [allergies, setAllergies] = useState<string[]>(["Ammonia"]);
  const [preferredStyle, setPreferredStyle] = useState("Warm tones, C-curl blowdry");
  const [beautyNotes, setBeautyNotes] = useState("Sensitive scalp, avoid strong chemicals near roots.");

  // Settings
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [beautyReminders, setBeautyReminders] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const [copied, setCopied] = useState(false);

  const toggleAllergy = (a: string) => {
    setAllergies((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-[#fafafa] relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col" data-name="Profile">

        {/* Header */}
        <div className="shrink-0 bg-white border-b border-[#f0f0f0] px-[16px] pt-[50px] pb-[14px] flex items-center justify-between">
          <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-[#1b1c15]">My Profile</p>
          <div className="flex items-center gap-[14px]">
            <button onClick={() => setShowSettings(true)} className="cursor-pointer hover:opacity-70"><Settings size={22} className="text-[#1b1c15]" strokeWidth={1.5} /></button>
            <button onClick={() => setShowQr(true)} className="cursor-pointer hover:opacity-70"><QrCode size={22} className="text-[#1b1c15]" strokeWidth={1.5} /></button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pb-[100px]">

          {/* ── Avatar + Name ───────────────────────────────────────── */}
          <div className="bg-white px-[16px] py-[20px] flex items-center gap-[16px] border-b border-[#f0f0f0]">
            <div className="size-[64px] rounded-full flex items-center justify-center shrink-0 shadow-[0px_4px_16px_rgba(219,67,174,0.25)]" style={{ background: `linear-gradient(135deg, ${tier.gradientFrom}, ${tier.gradientTo})` }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="white" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15]">Joanne Chan</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">joanne.chan@email.com · +60 12-345 6789</p>
              <div className="mt-[4px] inline-flex items-center gap-[5px] px-[8px] py-[2px] rounded-full" style={{ background: `linear-gradient(135deg, ${tier.gradientFrom}, ${tier.gradientTo})` }}>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white">{tier.name} Member</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/signup-profile")}
              className="size-[36px] rounded-full bg-[#fdf0fa] flex items-center justify-center cursor-pointer hover:bg-[rgba(219,67,174,0.12)] transition-colors"
            >
              <Edit3 size={16} className="text-[#db43ae]" />
            </button>
          </div>

          {/* ── Tier Progress Card ─────────────────────────────────── */}
          <div className="mx-[16px] mt-[14px] rounded-[14px] overflow-hidden shadow-[0px_4px_16px_rgba(219,67,174,0.15)]" style={{ background: `linear-gradient(135deg, ${tier.gradientFrom}, ${tier.gradientTo})` }}>
            <div className="p-[14px]">
              <div className="flex items-center justify-between mb-[10px]">
                <div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/80">Current Tier</p>
                  <p className="font-['Poppins:Bold',sans-serif] text-[18px] text-white">{tier.name}</p>
                </div>
                <button onClick={() => navigate("/me/membership")} className="bg-white/20 rounded-[8px] px-[10px] py-[5px] cursor-pointer hover:bg-white/30 transition-colors">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">View Benefits</p>
                </button>
              </div>
              {nextTier && (
                <>
                  <div className="flex items-center justify-between mb-[5px]">
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/80">
                      {nextTier.minPoints - totalPointsEarned} pts to {nextTier.name}
                    </p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">{tierProgress}%</p>
                  </div>
                  <div className="w-full h-[6px] bg-white/25 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${tierProgress}%` }} />
                  </div>
                </>
              )}
              {!nextTier && (
                <div className="flex items-center gap-[6px] bg-white/20 rounded-[8px] px-[10px] py-[5px]">
                  <span className="text-[14px]">💎</span>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">Highest tier achieved!</p>
                </div>
              )}
            </div>
            <div className="flex border-t border-white/20">
              {[
                { val: String(points), label: "Points" },
                { val: `RM ${credits.toFixed(0)}`, label: "Credits" },
                { val: String(availableVouchers), label: "Vouchers" },
              ].map((stat, idx) => (
                <div key={stat.label} className={`flex-1 py-[10px] text-center ${idx < 2 ? "border-r border-white/20" : ""}`}>
                  <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white">{stat.val}</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Preferences ────────────────────────────────────────── */}
          <div className="mx-[16px] mt-[16px] bg-white rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.05)]">
            <div className="px-[16px] py-[12px] border-b border-[#f0f0f0]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">My Preferences</p>
            </div>
            {[
              { icon: <MapPin size={16} className="text-[#db43ae]" />, label: "Preferred Outlet", value: preferredOutlet, action: () => setActiveSheet("outlet") },
              { icon: <Scissors size={16} className="text-[#db43ae]" />, label: "Favourite Stylist", value: favStylist, action: () => setActiveSheet("stylist") },
              { icon: <Globe size={16} className="text-[#db43ae]" />, label: "Language", value: selectedLanguage, action: () => setActiveSheet("language") },
            ].map((item) => (
              <button key={item.label} onClick={item.action} className="w-full flex items-center px-[16px] py-[13px] border-b border-[#f5f5f5] last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="size-[34px] rounded-full bg-[rgba(219,67,174,0.1)] flex items-center justify-center mr-[12px] shrink-0">{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">{item.label}</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{item.value}</p>
                </div>
                <ChevronRight size={16} className="text-[#b0b0b0] shrink-0" />
              </button>
            ))}
          </div>

          {/* ── Beauty Profile ─────────────────────────────────────── */}
          <div className="mx-[16px] mt-[14px] bg-white rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.05)]">
            <button
              onClick={() => setActiveSheet("beauty")}
              className="w-full flex items-center justify-between px-[16px] py-[14px] border-b border-[#f0f0f0] cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-[12px]">
                <div className="size-[34px] rounded-full bg-[rgba(219,67,174,0.1)] flex items-center justify-center">
                  <Heart size={16} className="text-[#db43ae]" />
                </div>
                <div className="text-left">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">Beauty Profile</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{skinType} skin · {hairType} hair · {allergies.length} allergy note{allergies.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#b0b0b0] shrink-0" />
            </button>
            {/* Quick preview */}
            <div className="px-[16px] py-[12px]">
              <div className="flex gap-[8px] flex-wrap">
                <div className="flex items-center gap-[4px] bg-[#fdf0fa] rounded-full px-[10px] py-[4px]">
                  <span className="text-[11px]">🧴</span>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#db43ae]">{skinType} skin</p>
                </div>
                <div className="flex items-center gap-[4px] bg-[#fdf0fa] rounded-full px-[10px] py-[4px]">
                  <span className="text-[11px]">💇‍♀️</span>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#db43ae]">{hairType} hair</p>
                </div>
                {allergies.slice(0, 2).map((a) => (
                  <div key={a} className="flex items-center gap-[4px] bg-[#fde8e8] rounded-full px-[10px] py-[4px]">
                    <span className="text-[11px]">⚠️</span>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#e74c3c]">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Especially For You ─────────────────────────────────── */}
          <div className="mx-[16px] mt-[14px] bg-white rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.05)]">
            <div className="px-[16px] py-[12px] border-b border-[#f0f0f0]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">Especially For You</p>
            </div>
            {[
              { icon: <Users size={16} className="text-[#db43ae]" />, label: "Invite Friends", sub: "Earn RM 20 credits per referral", action: () => setShowInvite(true) },
              { icon: <Gift size={16} className="text-[#db43ae]" />, label: "Gift Cards", sub: "Send & redeem gift cards", action: () => navigate("/me/gift-cards") },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="#db43ae" strokeWidth="1.8" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="#db43ae" strokeWidth="1.8"/></svg>, label: "My Questionnaire", sub: "Help us serve you better", action: () => navigate("/me/questionnaire") },
            ].map((item) => (
              <button key={item.label} onClick={item.action} className="w-full flex items-center px-[16px] py-[13px] border-b border-[#f5f5f5] last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="size-[34px] rounded-full bg-[rgba(219,67,174,0.1)] flex items-center justify-center mr-[12px] shrink-0">{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">{item.label}</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{item.sub}</p>
                </div>
                <ChevronRight size={16} className="text-[#b0b0b0] shrink-0" />
              </button>
            ))}
          </div>

          {/* ── Support & Legal ────────────────────────────────────── */}
          <div className="mx-[16px] mt-[14px] bg-white rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.05)]">
            <div className="px-[16px] py-[12px] border-b border-[#f0f0f0]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">Support</p>
            </div>
            {[
              { icon: <Phone size={16} className="text-[#db43ae]" />, label: "Contact Us", action: () => setActiveSheet("contact") },
              { icon: <HelpCircle size={16} className="text-[#db43ae]" />, label: "FAQ", action: () => setActiveSheet("faq") },
              { icon: <FileText size={16} className="text-[#db43ae]" />, label: "Terms & Conditions", action: () => setActiveSheet("terms") },
              { icon: <Lock size={16} className="text-[#db43ae]" />, label: "Privacy Policy", action: () => setActiveSheet("privacy") },
              { icon: <LogOut size={16} className="text-[#ef4444]" />, label: "Logout", action: () => navigate("/login") },
            ].map((item) => (
              <button key={item.label} onClick={item.action} className="w-full flex items-center px-[16px] py-[13px] border-b border-[#f5f5f5] last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="size-[34px] rounded-full bg-[rgba(219,67,174,0.06)] flex items-center justify-center mr-[12px] shrink-0">{item.icon}</div>
                <p className="flex-1 text-left font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">{item.label}</p>
                <ChevronRight size={16} className="text-[#b0b0b0] shrink-0" />
              </button>
            ))}
          </div>

          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#b0b0b0] text-center py-[12px]">Luxe Locks v2.0.0</p>
        </div>

        <BottomNav active="profile" />

        {/* ── QR Modal ──────────────────────────────────────────────── */}
        {showQr && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-[20px] p-[24px] mx-[28px] w-full max-w-[300px]">
              <div className="flex justify-between items-center mb-[6px]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">My QR Code</p>
                <button onClick={() => setShowQr(false)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] text-center mb-[12px]">Show at counter to earn points</p>
              <div className="bg-gray-50 rounded-[12px] p-[16px] flex items-center justify-center mb-[12px] border border-[#f0f0f0]">
                <QrCode size={140} className="text-black" strokeWidth={0.8} />
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] text-center mb-[4px]">Joanne Chan · ID: LUXE-8302-JCHN</p>
              <div className="flex justify-center mb-[14px]">
                <div className="px-[10px] py-[3px] rounded-full" style={{ background: `linear-gradient(135deg, ${tier.gradientFrom}, ${tier.gradientTo})` }}>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">{tier.name} Member</p>
                </div>
              </div>
              <button onClick={() => setShowQr(false)} className="w-full bg-[#db43ae] rounded-[10px] py-[12px] cursor-pointer hover:opacity-90">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">Close</p>
              </button>
            </div>
          </div>
        )}

        {/* ── Settings Sheet ─────────────────────────────────────────── */}
        {showSettings && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-[20px] pb-[40px] max-h-[75%] overflow-y-auto">
              <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f0f0f0]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Settings</p>
                <button onClick={() => setShowSettings(false)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="px-[20px] pt-[12px]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#92929d] mb-[8px] uppercase tracking-[0.5px]">Notifications</p>
                {[
                  { label: "Push Notifications", sub: "Appointment & promo alerts", val: notifEnabled, set: setNotifEnabled },
                  { label: "Promotional Emails", sub: "Offers & news from Luxe Locks", val: promoEnabled, set: setPromoEnabled },
                  { label: "Beauty Reminders", sub: "Hair, skin, lash care reminders", val: beautyReminders, set: setBeautyReminders },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-[13px] border-b border-[#f5f5f5]">
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15]">{s.label}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{s.sub}</p>
                    </div>
                    <Toggle value={s.val} onChange={() => s.set(!s.val)} />
                  </div>
                ))}
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#92929d] mb-[8px] mt-[14px] uppercase tracking-[0.5px]">Security</p>
                <div className="flex items-center justify-between py-[13px] border-b border-[#f5f5f5]">
                  <div>
                    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15]">Biometric Login</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">Use fingerprint / Face ID</p>
                  </div>
                  <Toggle value={biometric} onChange={() => setBiometric(!biometric)} />
                </div>
                <button
                  onClick={() => { setShowSettings(false); navigate("/signup-profile"); }}
                  className="mt-[16px] w-full bg-[#db43ae] py-[13px] rounded-[12px] cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">Edit Profile</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Beauty Profile Sheet ───────────────────────────────────── */}
        {activeSheet === "beauty" && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-[20px] pb-[40px] max-h-[85%] flex flex-col">
              <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f0f0f0] shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">My Beauty Profile</p>
                <button onClick={() => setActiveSheet(null)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="overflow-y-auto flex-1 px-[20px] pt-[14px]">
                {/* Skin type */}
                <div className="mb-[16px]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[8px]">🧴 Skin Type</p>
                  <div className="flex flex-wrap gap-[8px]">
                    {SKIN_TYPES.map((s) => (
                      <button key={s} onClick={() => setSkinType(s)} className={`px-[14px] py-[6px] rounded-full border cursor-pointer transition-all ${skinType === s ? "border-[#db43ae] bg-[rgba(219,67,174,0.1)] text-[#db43ae]" : "border-[#e0e0e0] text-[#555] hover:border-[#db43ae]"}`}>
                        <p className="font-['Poppins:Regular',sans-serif] text-[12px]">{s}</p>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Hair type */}
                <div className="mb-[16px]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[8px]">💇‍♀️ Hair Type</p>
                  <div className="flex flex-wrap gap-[8px]">
                    {HAIR_TYPES.map((h) => (
                      <button key={h} onClick={() => setHairType(h)} className={`px-[14px] py-[6px] rounded-full border cursor-pointer transition-all ${hairType === h ? "border-[#db43ae] bg-[rgba(219,67,174,0.1)] text-[#db43ae]" : "border-[#e0e0e0] text-[#555] hover:border-[#db43ae]"}`}>
                        <p className="font-['Poppins:Regular',sans-serif] text-[12px]">{h}</p>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Allergies */}
                <div className="mb-[16px]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[8px]">⚠️ Known Allergies / Sensitivities</p>
                  <div className="flex flex-col gap-[8px]">
                    {ALLERGY_OPTIONS.map((a) => (
                      <button key={a} onClick={() => toggleAllergy(a)} className={`flex items-center justify-between w-full px-[14px] py-[11px] rounded-[10px] border cursor-pointer transition-all ${allergies.includes(a) ? "border-[#e74c3c] bg-[#fde8e8]" : "border-[#e0e0e0] bg-white hover:border-[#db43ae]"}`}>
                        <p className={`font-['Poppins:Regular',sans-serif] text-[13px] ${allergies.includes(a) ? "text-[#e74c3c]" : "text-[#1b1c15]"}`}>{a}</p>
                        {allergies.includes(a) && <Check size={16} className="text-[#e74c3c]" />}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Preferred style */}
                <div className="mb-[16px]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[8px]">🎨 Preferred Colour / Style</p>
                  <input
                    value={preferredStyle}
                    onChange={(e) => setPreferredStyle(e.target.value)}
                    className="w-full border border-[#e0e0e0] rounded-[10px] px-[14px] py-[11px] font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15] outline-none focus:border-[#db43ae] transition-colors"
                    placeholder="e.g. Warm tones, balayage, C-curl..."
                  />
                </div>
                {/* Notes */}
                <div className="mb-[16px]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[8px]">📝 Additional Notes for Stylist</p>
                  <textarea
                    value={beautyNotes}
                    onChange={(e) => setBeautyNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-[#e0e0e0] rounded-[10px] px-[14px] py-[11px] font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15] outline-none focus:border-[#db43ae] transition-colors resize-none"
                    placeholder="Any special requests or notes for your stylist..."
                  />
                </div>
                <button
                  onClick={() => setActiveSheet(null)}
                  className="w-full bg-[#db43ae] py-[14px] rounded-[12px] cursor-pointer hover:opacity-90 transition-opacity mb-[8px]"
                >
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">Save Beauty Profile</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Outlet / Stylist / Language Selection Sheets ───────────── */}
        {(activeSheet === "outlet" || activeSheet === "stylist" || activeSheet === "language") && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-[20px] max-h-[60%] flex flex-col">
              <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f0f0f0]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">
                  {activeSheet === "outlet" ? "Preferred Outlet" : activeSheet === "stylist" ? "Favourite Stylist" : "Select Language"}
                </p>
                <button onClick={() => setActiveSheet(null)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="overflow-y-auto flex-1 p-[20px]">
                <div className="flex flex-col gap-[8px]">
                  {(activeSheet === "outlet" ? OUTLETS : activeSheet === "stylist" ? STYLISTS : LANGUAGES).map((option) => {
                    const isSelected = activeSheet === "outlet" ? preferredOutlet === option : activeSheet === "stylist" ? favStylist === option : selectedLanguage === option;
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          if (activeSheet === "outlet") setPreferredOutlet(option);
                          else if (activeSheet === "stylist") setFavStylist(option);
                          else setSelectedLanguage(option);
                          setActiveSheet(null);
                        }}
                        className={`w-full flex items-center justify-between py-[13px] px-[16px] rounded-[10px] border cursor-pointer transition-all ${isSelected ? "border-[#db43ae] bg-[rgba(219,67,174,0.06)]" : "border-[#e0e0e0] hover:bg-gray-50"}`}
                      >
                        <p className={`font-['Poppins:Regular',sans-serif] text-[14px] ${isSelected ? "text-[#db43ae]" : "text-[#1b1c15]"}`}>{option}</p>
                        {isSelected && <Check size={16} className="text-[#db43ae]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Support Sheets (Contact, FAQ, Terms, Privacy) ─────────── */}
        {(activeSheet === "contact" || activeSheet === "faq" || activeSheet === "terms" || activeSheet === "privacy") && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-[20px] max-h-[75%] flex flex-col">
              <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f0f0f0]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">
                  {activeSheet === "contact" ? "Contact Us" : activeSheet === "faq" ? "FAQ" : activeSheet === "terms" ? "Terms & Conditions" : "Privacy Policy"}
                </p>
                <button onClick={() => setActiveSheet(null)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="overflow-y-auto flex-1 p-[20px]">
                {activeSheet === "contact" && (
                  <div className="flex flex-col gap-[12px]">
                    {[
                      { icon: "📞", label: "Phone", val: "+60 3-7890 1234" },
                      { icon: "✉️", label: "Email", val: "hello@luxelocks.com" },
                      { icon: "🕐", label: "Hours", val: "Mon–Sun: 10:00 AM – 9:00 PM" },
                      { icon: "📍", label: "Main Branch", val: "Kuchai Lama, Kuala Lumpur" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-[12px] p-[14px] bg-[#fafafa] rounded-[12px]">
                        <span className="text-[22px]">{item.icon}</span>
                        <div>
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[2px]">{item.label}</p>
                          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">{item.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeSheet === "faq" && (
                  <div className="flex flex-col gap-[10px]">
                    {[
                      { q: "How do I earn points?", a: "You earn 1 point (or more based on your tier) for every RM 1 spent on services or products." },
                      { q: "When do my credits expire?", a: "Credits expire 12 months after they are added to your wallet." },
                      { q: "Can I cancel an appointment?", a: "Yes, you can cancel up to 24 hours before your appointment without any charge." },
                      { q: "How do loyalty tiers work?", a: "Tiers are based on total points earned: Rose (0+), Orchid (500+), Jasmine (1500+), Diamond (3000+). Higher tiers earn more points per ringgit spent." },
                      { q: "How do I redeem vouchers?", a: "Go to Rewards > My Vouchers and tap 'Use Now' or 'Redeem pts' to apply your voucher." },
                    ].map((item, i) => (
                      <div key={i} className="border border-[#eee] rounded-[12px] p-[14px]">
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae] mb-[6px]">Q: {item.q}</p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#555] leading-[18px]">A: {item.a}</p>
                      </div>
                    ))}
                  </div>
                )}
                {(activeSheet === "terms" || activeSheet === "privacy") && (
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#555] leading-[22px]">
                    {activeSheet === "terms"
                      ? "These Terms and Conditions govern your use of the Luxe Locks loyalty application.\n\n1. Membership is free and open to all customers.\n2. Points are earned on qualifying purchases and cannot be transferred.\n3. Vouchers and credits have expiry dates as stated at issuance.\n4. Tier upgrades are automatic based on total points earned.\n5. Luxe Locks reserves the right to modify the rewards program at any time.\n6. Any misuse of the loyalty system may result in account suspension.\n\nFor full terms, visit our website or contact us."
                      : "Your privacy is important to us.\n\n1. We collect name, contact details, beauty profile, and transaction history to operate the loyalty program.\n2. Your beauty profile data (skin type, allergies, preferences) is used only to improve your service experience.\n3. Your data is never sold to third parties.\n4. We may use your data to send promotional communications (opt-out available in Settings).\n5. You may request deletion of your account data at any time.\n6. We use industry-standard security measures to protect your information.\n\nFor questions, contact privacy@luxelocks.com."}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Invite Modal ──────────────────────────────────────────── */}
        {showInvite && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center px-[24px]">
            <div className="bg-white rounded-[20px] p-[24px] w-full">
              <div className="flex justify-end mb-[4px]">
                <button onClick={() => setShowInvite(false)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="text-center mb-[20px]">
                <div className="text-[52px] mb-[10px]">🎁</div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15] mb-[6px]">Invite & Earn!</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">You both earn RM 20 credits when they sign up!</p>
              </div>
              <div className="bg-[#fdf0fa] border border-[#f0c8e8] rounded-[12px] p-[16px] flex items-center justify-between mb-[16px]">
                <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-[#db43ae] tracking-[4px]">LUXE-JC88</p>
                <button onClick={() => setCopied(true)} className="bg-[#db43ae] rounded-[8px] px-[14px] py-[8px] cursor-pointer hover:opacity-90">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">{copied ? "Copied!" : "Copy"}</p>
                </button>
              </div>
              <button onClick={() => setShowInvite(false)} className="w-full flex items-center justify-center gap-[8px] bg-[#1b1c15] rounded-[12px] py-[14px] cursor-pointer hover:opacity-90">
                <Share2 size={16} className="text-white" />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Share with Friends</p>
              </button>
            </div>
          </div>
        )}

        {/* Gesture bar */}
        <div className="absolute bottom-[2px] left-0 right-0 h-[4px] flex justify-center pointer-events-none">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}
