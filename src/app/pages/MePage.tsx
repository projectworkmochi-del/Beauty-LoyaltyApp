import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Settings, Bell, ChevronRight, QrCode,
  CreditCard, Star, Ticket, Package, Globe,
  Users, Gift, LogOut, HelpCircle, Lock,
  FileText, Phone, X, Share2, Check, ChevronLeft
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAppContext } from "../context/AppContext";

const MEMBERSHIP_TIERS = [
  { name: "Silver", color: "#A2A39B", bg: "#fafaf4", progress: 44, next: "Gold", spend: "RM 500.00" },
];

const NOTIFICATIONS = [
  { id: "1", title: "🎉 Welcome Bonus!", body: "You've received RM 30.00 welcome credits!", time: "Just now", unread: true },
  { id: "2", title: "📅 Appointment Reminder", body: "Your facial appointment is tomorrow at 3:00 PM", time: "2h ago", unread: true },
  { id: "3", title: "🏷️ New Voucher Available", body: "10% OFF Hair Treatment voucher added.", time: "1d ago", unread: false },
];

const LANGUAGES = ["English", "Bahasa Malaysia", "中文 (Chinese)", "Tamil"];

function TrophyIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
      <path d="M15 2L18.09 8.26L25 9.27L20 14.14L21.18 21.02L15 17.77L8.82 21.02L10 14.14L5 9.27L11.91 8.26L15 2Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15" cy="12" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M10 26h10M15 22v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MembershipCard({ tier, onViewBenefits }: { tier: typeof MEMBERSHIP_TIERS[0]; onViewBenefits: () => void }) {
  return (
    <div className="mx-[16px] rounded-[10px] p-[16px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.10)]" style={{ background: tier.bg }}>
      <div className="flex items-center justify-between mb-[10px]">
        <div className="flex items-center gap-[8px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[18px]" style={{ color: tier.color }}>{tier.name}</p>
          <div className="px-[8px] py-[2px] rounded-full" style={{ background: "rgba(219,67,174,0.12)" }}>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[9px] text-[#db43ae]">Current Ranking</p>
          </div>
        </div>
        <div className="flex items-center gap-[6px]">
          <button onClick={onViewBenefits} className="flex items-center gap-[4px] cursor-pointer hover:opacity-70 transition-opacity">
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#696969]">View Benefits</p>
            <ChevronRight size={14} className="text-[#696969]" />
          </button>
          <TrophyIcon color={tier.color} />
        </div>
      </div>
      <div className="relative h-[10px] mb-[6px]">
        <div className="absolute top-[4px] left-0 right-0 h-[2px] bg-[#e2e2ea] rounded-full" />
        <div className="absolute top-[4px] left-0 h-[2px] rounded-full" style={{ width: `${tier.progress}%`, background: "linear-gradient(to right, #db43ae, #e98ece)" }} />
        <div className="absolute top-[1px] size-[8px] rounded-full bg-[#db43ae] shadow-[0px_2px_6px_rgba(219,67,174,0.6)]" style={{ left: `${tier.progress}%`, transform: "translateX(-50%)" }} />
      </div>
      {tier.next && (
        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#696969]">
          Spend {tier.spend} more to upgrade to {tier.next}
        </p>
      )}
    </div>
  );
}

// ── Info Sheet (for Language, Contact, FAQ, T&C, Privacy) ─────────────────────
interface InfoSheetProps {
  type: "language" | "contact" | "faq" | "terms" | "privacy" | null;
  onClose: () => void;
  onSelectLanguage?: (lang: string) => void;
  selectedLanguage?: string;
}

function InfoSheet({ type, onClose, onSelectLanguage, selectedLanguage }: InfoSheetProps) {
  if (!type) return null;

  const titles: Record<NonNullable<typeof type>, string> = {
    language: "Select Language",
    contact: "Contact Us",
    faq: "FAQ",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
  };

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-[20px] max-h-[75%] flex flex-col">
        <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f0f0f0]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">{titles[type]}</p>
          <button onClick={onClose} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-[20px]">
          {type === "language" && (
            <div className="flex flex-col gap-[10px]">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { onSelectLanguage?.(lang); onClose(); }}
                  className="w-full flex items-center justify-between py-[14px] px-[16px] rounded-[10px] border cursor-pointer transition-all"
                  style={{ borderColor: selectedLanguage === lang ? "#db43ae" : "#e0e0e0", background: selectedLanguage === lang ? "rgba(219,67,174,0.06)" : "white" }}
                >
                  <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15]">{lang}</p>
                  {selectedLanguage === lang && <Check size={16} className="text-[#db43ae]" />}
                </button>
              ))}
            </div>
          )}
          {type === "contact" && (
            <div className="flex flex-col gap-[14px]">
              {[
                { icon: "📞", label: "Phone", val: "+60 3-7890 1234" },
                { icon: "✉️", label: "Email", val: "hello@luxelocks.com" },
                { icon: "🕐", label: "Operating Hours", val: "Mon–Sun: 10:00 AM – 9:00 PM" },
                { icon: "📍", label: "Main Branch", val: "Kuchai Lama, Kuala Lumpur" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-[12px] p-[14px] bg-[#fafafa] rounded-[10px]">
                  <span className="text-[22px]">{item.icon}</span>
                  <div>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[2px]">{item.label}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {type === "faq" && (
            <div className="flex flex-col gap-[12px]">
              {[
                { q: "How do I earn points?", a: "You earn 1 point for every RM 1 spent on services or products." },
                { q: "When do my credits expire?", a: "Credits expire 12 months after they are added to your wallet." },
                { q: "Can I cancel an appointment?", a: "Yes, you can cancel up to 24 hours before your appointment without any charge." },
                { q: "How do I redeem vouchers?", a: "Go to Rewards, select a voucher, and apply it at checkout." },
                { q: "How do I upgrade my membership?", a: "Membership upgrades automatically when you reach the spending threshold." },
              ].map((item, i) => (
                <div key={i} className="border border-[#eee] rounded-[10px] p-[14px]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#db43ae] mb-[6px]">Q: {item.q}</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#555] leading-[18px]">A: {item.a}</p>
                </div>
              ))}
            </div>
          )}
          {(type === "terms" || type === "privacy") && (
            <div>
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#555] leading-[22px]">
                {type === "terms"
                  ? `These Terms and Conditions govern your use of the Luxe Locks loyalty application. By using this app, you agree to be bound by these terms.\n\n1. Membership is free and open to all customers.\n2. Points are earned on qualifying purchases and cannot be transferred.\n3. Vouchers and credits have expiry dates as stated at issuance.\n4. Luxe Locks reserves the right to modify the rewards program at any time.\n5. Any misuse of the loyalty system may result in account suspension.\n\nFor full terms, visit our website or contact us.`
                  : `Your privacy is important to us. This policy explains how Luxe Locks collects, uses, and protects your personal information.\n\n1. We collect name, contact details, and transaction history to operate the loyalty program.\n2. Your data is never sold to third parties.\n3. We may use your data to send promotional communications (opt-out available).\n4. You may request deletion of your account data at any time.\n5. We use industry-standard security measures to protect your information.\n\nFor questions, contact privacy@luxelocks.com.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MePage() {
  const navigate = useNavigate();
  const { points, credits, vouchers } = useAppContext();
  const availableVouchers = vouchers.filter((v) => v.status === "available").length;

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [infoSheet, setInfoSheet] = useState<"language" | "contact" | "faq" | "terms" | "privacy" | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [giftUsed, setGiftUsed] = useState(false);

  // Settings toggles
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="h-[40px] shrink-0 flex items-center justify-between px-[16px] bg-white">
          <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)]">12:30</p>
          <div className="flex gap-[14px] items-center">
            {/* Settings */}
            <button onClick={() => setShowSettings(true)} className="cursor-pointer hover:opacity-70 transition-opacity">
              <Settings size={22} className="text-[#1b1c15]" />
            </button>
            {/* Notifications */}
            <button onClick={() => setShowNotifications(true)} className="cursor-pointer hover:opacity-70 transition-opacity relative">
              <Bell size={22} className="text-[#1b1c15]" />
              {unreadCount > 0 && (
                <div className="absolute -top-[4px] -right-[4px] size-[14px] bg-[#ef4444] rounded-full flex items-center justify-center">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[8px] text-white">{unreadCount}</p>
                </div>
              )}
            </button>
            {/* QR */}
            <button onClick={() => setShowQr(true)} className="cursor-pointer hover:opacity-70 transition-opacity">
              <QrCode size={22} className="text-[#1b1c15]" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pb-[100px]">
          {/* Profile row — tap to edit */}
          <button
            onClick={() => navigate("/signup-profile")}
            className="flex items-center gap-[14px] px-[16px] py-[14px] w-full text-left hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="size-[56px] rounded-full bg-[#db43ae] flex items-center justify-center shrink-0 shadow-[0px_2px_12px_rgba(219,67,174,0.35)]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="white" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15]">Joanne Chan</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#db43ae]">Tap to edit profile →</p>
            </div>
          </button>

          {/* Membership card */}
          <MembershipCard tier={MEMBERSHIP_TIERS[0]} onViewBenefits={() => navigate("/me/membership")} />

          {/* Stats tiles */}
          <div className="grid grid-cols-4 gap-[0px] mx-[16px] mt-[14px] mb-[14px]">
            {[
              { icon: <CreditCard size={22} className="text-[#db43ae]" />, value: credits.toFixed(2), label: "Credits", path: "/credits" },
              { icon: <Star size={22} className="text-[#db43ae]" />, value: String(points), label: "Points", path: "/points" },
              { icon: <Ticket size={22} className="text-[#db43ae]" />, value: String(availableVouchers), label: "Vouchers", path: "/rewards" },
              { icon: <Package size={22} className="text-[#db43ae]" />, value: "1", label: "Package", path: "/package" },
            ].map((tile) => (
              <button key={tile.label} onClick={() => navigate(tile.path)} className="flex flex-col items-center gap-[4px] py-[12px] cursor-pointer hover:bg-gray-50 rounded-[8px] transition-colors">
                <div className="size-[40px] rounded-[10px] bg-[rgba(219,67,174,0.1)] flex items-center justify-center mb-[2px]">{tile.icon}</div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">{tile.value}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{tile.label}</p>
              </button>
            ))}
          </div>

          {/* Survey banner */}
          <button
            onClick={() => navigate("/me/questionnaire")}
            className="mx-[16px] mb-[14px] rounded-[10px] bg-[rgba(219,67,174,0.08)] px-[16px] py-[12px] flex items-center justify-between cursor-pointer hover:bg-[rgba(219,67,174,0.12)] transition-colors w-[calc(100%-32px)]"
          >
            <div className="flex-1 text-left">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15] mb-[4px]">Help Us Serve You Better!</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] leading-[16px]">Complete the survey to earn bonus benefits</p>
            </div>
            <div className="text-[48px] ml-[12px] leading-none select-none">🎉</div>
          </button>

          {/* Especially For You */}
          <div className="mb-[14px]">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] px-[16px] mb-[8px]">Especially For You</p>
            {[
              { icon: <Users size={20} className="text-[#db43ae]" />, label: "Invite Your Friends", action: () => setShowInvite(true) },
              { icon: <Gift size={20} className="text-[#db43ae]" />, label: "Gift Cards", action: () => navigate("/me/gift-cards") },
            ].map((item) => (
              <button key={item.label} onClick={item.action} className="w-full flex items-center justify-between px-[16px] py-[14px] border-b border-[#f0f0f0] cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-[12px]">
                  <div className="size-[36px] rounded-full bg-[rgba(219,67,174,0.1)] flex items-center justify-center">{item.icon}</div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15]">{item.label}</p>
                </div>
                <ChevronRight size={18} className="text-[#92929d]" />
              </button>
            ))}
          </div>

          {/* General */}
          <div className="mb-[14px]">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] px-[16px] mb-[8px]">General</p>
            {[
              { icon: <Globe size={18} className="text-[#db43ae]" />, label: "Language", sub: selectedLanguage, action: () => setInfoSheet("language") },
              { icon: <Phone size={18} className="text-[#db43ae]" />, label: "Contact Us", sub: null, action: () => setInfoSheet("contact") },
              { icon: <HelpCircle size={18} className="text-[#db43ae]" />, label: "FAQ", sub: null, action: () => setInfoSheet("faq") },
              { icon: <FileText size={18} className="text-[#db43ae]" />, label: "Terms & Conditions", sub: null, action: () => setInfoSheet("terms") },
              { icon: <Lock size={18} className="text-[#db43ae]" />, label: "Privacy Policy", sub: null, action: () => setInfoSheet("privacy") },
              { icon: <LogOut size={18} className="text-[#ef4444]" />, label: "Logout", sub: null, action: () => navigate("/login") },
            ].map((item) => (
              <button key={item.label} onClick={item.action} className="w-full flex items-center justify-between px-[16px] py-[14px] border-b border-[#f0f0f0] cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-[12px]">
                  <div className="size-[36px] rounded-full bg-[rgba(219,67,174,0.08)] flex items-center justify-center">{item.icon}</div>
                  <div className="text-left">
                    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15]">{item.label}</p>
                    {item.sub && <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{item.sub}</p>}
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#92929d]" />
              </button>
            ))}
          </div>

          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#b0b0b0] text-center py-[8px]">Luxe Locks v1.0.0</p>
        </div>

        <BottomNav active="profile" />

        {/* ── QR Modal ───────────────────────────────────────────────────── */}
        {showQr && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-[16px] p-[24px] mx-[32px] w-full max-w-[300px]">
              <div className="flex justify-between items-center mb-[16px]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">My QR Code</p>
                <button onClick={() => setShowQr(false)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] text-center mb-[12px]">Show this at the counter to earn points</p>
              <div className="bg-gray-100 rounded-[8px] p-[16px] flex items-center justify-center mb-[12px]">
                <QrCode size={140} className="text-black" strokeWidth={1} />
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] text-center mb-[16px]">Member ID: LUXE-8302-JCHN</p>
              <button onClick={() => setShowQr(false)} className="w-full bg-[#db43ae] rounded-[8px] py-[12px] cursor-pointer hover:opacity-90">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">Close</p>
              </button>
            </div>
          </div>
        )}

        {/* ── Notifications Panel ────────────────────────────────────────── */}
        {showNotifications && (
          <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-start">
            <div className="bg-white w-full rounded-b-[20px] shadow-xl max-h-[65%] flex flex-col">
              <div className="flex items-center justify-between px-[16px] pt-[16px] pb-[12px] border-b border-[#f0f0f0]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Notifications</p>
                <div className="flex items-center gap-[12px]">
                  <button onClick={markAllRead} className="cursor-pointer">
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#db43ae]">Mark all read</p>
                  </button>
                  <button onClick={() => setShowNotifications(false)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-[16px] py-[14px] border-b border-[#f5f5f5] flex items-start gap-[12px] ${n.unread ? "bg-[rgba(219,67,174,0.04)]" : ""}`}>
                    {n.unread && <div className="size-[8px] bg-[#db43ae] rounded-full mt-[5px] shrink-0" />}
                    {!n.unread && <div className="size-[8px] shrink-0" />}
                    <div className="flex-1">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[2px]">{n.title}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[4px]">{n.body}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#b0b0b0]">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1" onClick={() => setShowNotifications(false)} />
          </div>
        )}

        {/* ── Settings Sheet ─────────────────────────────────────────────── */}
        {showSettings && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-[20px] pb-[36px]">
              <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f0f0f0]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Settings</p>
                <button onClick={() => setShowSettings(false)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="px-[20px] pt-[16px] flex flex-col gap-[0px]">
                {/* Toggle rows */}
                {[
                  { label: "Push Notifications", sub: "Appointment & promo alerts", val: notifEnabled, set: setNotifEnabled },
                  { label: "Promotional Emails", sub: "Offers & news from Luxe Locks", val: promoEnabled, set: setPromoEnabled },
                  { label: "Biometric Login", sub: "Use fingerprint / Face ID", val: biometricEnabled, set: setBiometricEnabled },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-[14px] border-b border-[#f5f5f5]">
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15]">{s.label}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{s.sub}</p>
                    </div>
                    <button
                      onClick={() => s.set(!s.val)}
                      className="relative inline-flex h-[28px] w-[48px] items-center rounded-full transition-colors cursor-pointer"
                      style={{ background: s.val ? "#db43ae" : "#e0e0e0" }}
                    >
                      <span
                        className="inline-block size-[20px] transform rounded-full bg-white shadow-sm transition-transform"
                        style={{ transform: s.val ? "translateX(24px)" : "translateX(4px)" }}
                      />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => { setShowSettings(false); navigate("/signup-profile"); }}
                  className="mt-[16px] w-full bg-[#db43ae] py-[12px] rounded-[10px] cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">Edit Profile</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Invite Modal ───────────────────────────────────────────────── */}
        {showInvite && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center px-[24px]">
            <div className="bg-white rounded-[20px] p-[24px] w-full">
              <div className="flex justify-end mb-[4px]">
                <button onClick={() => setShowInvite(false)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="text-center mb-[16px]">
                <div className="text-[48px] mb-[8px]">🎁</div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15] mb-[6px]">Invite & Earn!</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">Share your code — you both earn RM 20 credits!</p>
              </div>
              <div className="bg-[#fdf0fa] border border-[#f0c8e8] rounded-[10px] p-[14px] flex items-center justify-between mb-[16px]">
                <p className="font-['Poppins:Bold',sans-serif] text-[18px] text-[#db43ae] tracking-[3px]">LUXE-JC88</p>
                <button onClick={handleCopy} className="bg-[#db43ae] rounded-[6px] px-[12px] py-[6px] cursor-pointer hover:opacity-90">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">{copied ? "Copied!" : "Copy"}</p>
                </button>
              </div>
              <button
                onClick={() => setShowInvite(false)}
                className="w-full flex items-center justify-center gap-[8px] bg-[#1b1c15] rounded-[10px] py-[12px] cursor-pointer hover:opacity-90"
              >
                <Share2 size={16} className="text-white" />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Share with Friends</p>
              </button>
            </div>
          </div>
        )}

        {/* ── Gift Card Modal ────────────────────────────────────────────── */}
        {showGiftModal && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center px-[24px]">
            <div className="bg-white rounded-[20px] p-[28px] w-full flex flex-col items-center gap-[12px]">
              <div className="text-[64px] leading-none">{giftUsed ? "✅" : "🎁"}</div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15] text-center">
                {giftUsed ? "Gift Card Applied!" : "Here's a Gift Just For You!"}
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center">
                {giftUsed ? "RM 30.00 has been added to your credits wallet." : "1 × Free Gift Card — RM 30.00 credit value"}
              </p>
              {!giftUsed ? (
                <div className="flex gap-[12px] w-full mt-[8px]">
                  <button onClick={() => setShowGiftModal(false)} className="flex-1 h-[44px] border border-[#dedede] rounded-[8px] cursor-pointer hover:bg-gray-50 transition-colors">
                    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15]">Save For Later</p>
                  </button>
                  <button onClick={() => setGiftUsed(true)} className="flex-1 h-[44px] bg-[#db43ae] rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Use It Now!</p>
                  </button>
                </div>
              ) : (
                <button onClick={() => { setShowGiftModal(false); setGiftUsed(false); }} className="w-full h-[44px] bg-[#db43ae] rounded-[8px] cursor-pointer hover:opacity-90">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Done</p>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Info Sheet (Language / Contact / FAQ / T&C / Privacy) ──────── */}
        <InfoSheet
          type={infoSheet}
          onClose={() => setInfoSheet(null)}
          onSelectLanguage={setSelectedLanguage}
          selectedLanguage={selectedLanguage}
        />

        {/* Gesture bar */}
        <div className="absolute bottom-[6px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}