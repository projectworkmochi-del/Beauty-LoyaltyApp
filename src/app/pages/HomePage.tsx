import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Bell, QrCode, X, Share2, ChevronRight, Calendar, Star, Scissors, Gift } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAppContext, TIERS, getTierInfo, getTierProgress, BEAUTY_REMINDERS } from "../context/AppContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const PROMO_SLIDES = [
  {
    id: "p1",
    tag: "LIMITED TIME",
    title: "Double Points\nWeekend!",
    subtitle: "Earn 2x points on all services\nthis Sat & Sun only",
    cta: "Book Now",
    img: "https://images.unsplash.com/photo-1703222420506-992b9436a319?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gradient: "linear-gradient(135deg, #db43ae 0%, #9b1fa0 100%)",
  },
  {
    id: "p2",
    tag: "SPA SPECIAL",
    title: "Relax & Glow\nFacial Package",
    subtitle: "90-min facial + scalp massage\nfrom RM 188",
    cta: "Discover",
    img: "https://images.unsplash.com/photo-1761718210089-ba3bb5ccb54f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gradient: "linear-gradient(135deg, #9b59b6 0%, #6c3483 100%)",
  },
  {
    id: "p3",
    tag: "NEW ARRIVAL",
    title: "Spring Nail\nCollection",
    subtitle: "Fresh seasonal colours\nwith gel manicure from RM 68",
    cta: "Explore",
    img: "https://images.unsplash.com/photo-1759150467355-aaf623080766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gradient: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
  },
];

const NOTIFICATIONS = [
  { id: "1", title: "🎉 Welcome Bonus!", body: "You've received RM 30.00 welcome credits!", time: "Just now", unread: true },
  { id: "2", title: "📅 Appointment Reminder", body: "Hair Color appointment is tomorrow at 2:00 PM", time: "2h ago", unread: true },
  { id: "3", title: "🏷️ Birthday Voucher!", body: "30% OFF voucher added to your wallet — Happy Birthday! 🎂", time: "1d ago", unread: false },
  { id: "4", title: "⭐ Double Points Weekend", body: "Earn 2x points on all services this weekend!", time: "2d ago", unread: false },
];

export function HomePage() {
  const navigate = useNavigate();
  const { points, credits, vouchers, appointments, tier, tierProgress, totalPointsEarned, checkedInToday, doCheckIn } = useAppContext();

  const [showQr, setShowQr] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [copied, setCopied] = useState(false);
  const [activePromo, setActivePromo] = useState(0);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const availableVouchers = vouchers.filter((v) => v.status === "available").length;
  const nextAppointment = appointments.find((a) => a.section === "upcoming" || a.section === "pending");

  // Next tier info
  const nextTierInfo = TIERS.find((t) => t.name === tier.nextTier);
  const pointsToNextTier = nextTierInfo ? nextTierInfo.minPoints - totalPointsEarned : 0;

  const handleCopyReferral = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleCheckIn = () => {
    if (!checkedInToday) {
      doCheckIn();
      setCheckInSuccess(true);
      setTimeout(() => setCheckInSuccess(false), 2500);
    }
  };

  const urgencyColor = {
    urgent: { bg: "bg-[#fde8e8]", text: "text-[#e74c3c]", badge: "bg-[#e74c3c]" },
    soon: { bg: "bg-[#fff3e0]", text: "text-[#e67e22]", badge: "bg-[#e67e22]" },
    upcoming: { bg: "bg-[#e8f8f0]", text: "text-[#00b894]", badge: "bg-[#00b894]" },
  };

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-[#fafafa] relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden" data-name="Home">

        {/* Check-in success toast */}
        {checkInSuccess && (
          <div className="absolute top-[60px] left-[16px] right-[16px] z-50 bg-[#1b1c15] text-white rounded-[12px] px-[16px] py-[12px] flex items-center gap-[10px] shadow-lg animate-[slideDown_0.2s_ease]">
            <Star size={16} className="text-[#fbbf24] fill-[#fbbf24] shrink-0" />
            <p className="font-['Poppins:SemiBold',sans-serif] text-[13px]">+5 pts! Daily check-in claimed 🎉</p>
          </div>
        )}

        {/* Scrollable content */}
        <div ref={scrollRef} className="absolute inset-0 bottom-[80px] overflow-y-auto">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="bg-white px-[16px] pt-[50px] pb-[16px] flex items-center justify-between border-b border-[#f0f0f0]">
            <div>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] leading-none mb-[2px]">Good morning ☀️</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15] leading-none">Joanne Chan</p>
            </div>
            <div className="flex items-center gap-[12px]">
              {/* Daily check-in */}
              <button
                onClick={handleCheckIn}
                className={`flex items-center gap-[4px] px-[10px] py-[5px] rounded-full border cursor-pointer transition-all ${checkedInToday ? "border-[#e0e0e0] bg-[#f5f5f5]" : "border-[#db43ae] bg-[rgba(219,67,174,0.08)] hover:bg-[rgba(219,67,174,0.12)]"}`}
              >
                <Star size={12} className={checkedInToday ? "text-[#b0b0b0]" : "text-[#db43ae]"} fill={checkedInToday ? "#b0b0b0" : "none"} />
                <p className={`font-['Poppins:SemiBold',sans-serif] text-[10px] ${checkedInToday ? "text-[#b0b0b0]" : "text-[#db43ae]"}`}>
                  {checkedInToday ? "Checked In" : "Check In"}
                </p>
              </button>
              <button onClick={() => setShowNotifications(true)} className="relative cursor-pointer hover:opacity-70 transition-opacity">
                <Bell size={22} className="text-[#1b1c15]" strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <div className="absolute -top-[3px] -right-[3px] size-[14px] bg-[#ef4444] rounded-full flex items-center justify-center">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[8px] text-white">{unreadCount}</p>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* ── Loyalty Card ───────────────────────────────────────────── */}
          <div className="px-[16px] pt-[16px] pb-[4px]">
            <div
              className="rounded-[16px] overflow-hidden shadow-[0px_8px_32px_rgba(219,67,174,0.25)] relative"
              style={{ background: `linear-gradient(135deg, ${tier.gradientFrom} 0%, ${tier.gradientTo} 100%)` }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-[40px] -right-[40px] size-[140px] rounded-full bg-white/10" />
              <div className="absolute -bottom-[20px] -left-[20px] size-[100px] rounded-full bg-white/8" />

              <div className="relative z-10 p-[18px]">
                {/* Top row */}
                <div className="flex items-start justify-between mb-[14px]">
                  <div>
                    <div className="flex items-center gap-[6px] mb-[4px]">
                      <div className="w-[8px] h-[8px] rounded-full bg-white/80" />
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/80 uppercase tracking-[1px]">Luxe Locks</p>
                    </div>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-none">Joanne Chan</p>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <div className="bg-white/20 backdrop-blur-sm rounded-[8px] px-[10px] py-[4px]">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">{tier.name} Member</p>
                    </div>
                    <button onClick={() => setShowQr(true)} className="bg-white/20 rounded-[8px] p-[7px] cursor-pointer hover:bg-white/30 transition-colors">
                      <QrCode size={18} className="text-white" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Points */}
                <div className="mb-[14px]">
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/70 mb-[2px]">Available Points</p>
                  <div className="flex items-baseline gap-[6px]">
                    <p className="font-['Poppins:Bold',sans-serif] text-[32px] text-white leading-none">{points.toLocaleString()}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/80">pts</p>
                  </div>
                </div>

                {/* Progress to next tier */}
                {tier.nextTier && (
                  <div>
                    <div className="flex items-center justify-between mb-[6px]">
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/80">
                        {pointsToNextTier} pts to {tier.nextTier}
                      </p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">{tierProgress}%</p>
                    </div>
                    <div className="w-full h-[6px] bg-white/25 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-700"
                        style={{ width: `${tierProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {!tier.nextTier && (
                  <div className="flex items-center gap-[6px] bg-white/20 rounded-[8px] px-[10px] py-[6px]">
                    <span className="text-[14px]">💎</span>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">Diamond Member — Highest Tier!</p>
                  </div>
                )}
              </div>

              {/* Points expiry warning */}
              <div className="bg-black/20 px-[18px] py-[8px] flex items-center gap-[6px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.8"/><path d="M12 8v4l2 2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/90">
                  290 pts expiring on 31 Dec 2026 — use them before they expire!
                </p>
              </div>
            </div>
          </div>

          {/* ── Stats Strip ────────────────────────────────────────────── */}
          <div className="bg-white mx-[16px] mt-[12px] rounded-[12px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] flex items-center">
            {[
              { key: "credits", val: `RM ${credits.toFixed(0)}`, label: "Credits", path: "/credits", icon: "💳" },
              { key: "points", val: String(points), label: "Points", path: "/points", icon: "⭐" },
              { key: "vouchers", val: String(availableVouchers), label: "Vouchers", path: "/rewards", icon: "🎫" },
              { key: "package", val: "1", label: "Package", path: "/package", icon: "📦" },
            ].map((item, idx) => (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center py-[12px] gap-[3px] cursor-pointer hover:bg-[#fdf0fa] transition-colors rounded-[12px] ${idx < 3 ? "border-r border-[#f0f0f0]" : ""}`}
              >
                <span className="text-[18px] leading-none">{item.icon}</span>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">{item.val}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#92929d]">{item.label}</p>
              </button>
            ))}
          </div>

          {/* ── Quick Actions ───────────────────────────────────────────── */}
          <div className="px-[16px] mt-[16px]">
            <div className="grid grid-cols-4 gap-[10px]">
              {[
                { label: "Book Now", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#db43ae" strokeWidth="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#db43ae" strokeWidth="1.8" strokeLinecap="round"/></svg>, action: () => navigate("/appointment/book"), color: "bg-[#fdf0fa]" },
                { label: "My Visits", icon: <Calendar size={22} className="text-[#db43ae]" strokeWidth={1.5} />, action: () => navigate("/history"), color: "bg-[#fdf0fa]" },
                { label: "Scan QR", icon: <QrCode size={22} className="text-[#db43ae]" strokeWidth={1.5} />, action: () => setShowQr(true), color: "bg-[#fdf0fa]" },
                { label: "Refer", icon: <Share2 size={20} className="text-[#db43ae]" strokeWidth={1.5} />, action: () => setShowReferral(true), color: "bg-[#fdf0fa]" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center gap-[6px] cursor-pointer group"
                >
                  <div className={`${item.color} size-[52px] rounded-[14px] flex items-center justify-center shadow-[0px_2px_8px_rgba(219,67,174,0.12)] group-hover:shadow-[0px_4px_16px_rgba(219,67,174,0.2)] transition-shadow`}>
                    {item.icon}
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#555] text-center">{item.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Upcoming Appointment ────────────────────────────────────── */}
          {nextAppointment && (
            <div className="px-[16px] mt-[16px]">
              <div className="flex items-center justify-between mb-[8px]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">Upcoming Appointment</p>
                <button onClick={() => navigate("/appointment")} className="flex items-center gap-[2px] cursor-pointer hover:opacity-70">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">View All</p>
                  <ChevronRight size={14} className="text-[#db43ae]" />
                </button>
              </div>
              <button
                onClick={() => navigate("/appointment")}
                className="w-full bg-white border border-[#f0f0f0] rounded-[12px] px-[14px] py-[12px] flex items-center gap-[12px] cursor-pointer hover:bg-[#fdf9ff] transition-colors text-left shadow-[0px_2px_8px_rgba(0,0,0,0.05)]"
              >
                <div className="size-[42px] rounded-full bg-[rgba(219,67,174,0.1)] flex items-center justify-center shrink-0">
                  <Scissors size={20} className="text-[#db43ae]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[1px]">{nextAppointment.service}</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{nextAppointment.branch}</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{nextAppointment.date} · {nextAppointment.time}</p>
                </div>
                <div className={`px-[8px] py-[3px] rounded-full ${nextAppointment.status === "pending" ? "bg-[#fff3e0]" : "bg-[#e8f8f0]"}`}>
                  <p className={`font-['Poppins:SemiBold',sans-serif] text-[11px] ${nextAppointment.status === "pending" ? "text-[#e67e22]" : "text-[#00b894]"}`}>
                    {nextAppointment.status === "pending" ? "Pending" : "Confirmed"}
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* ── Promotions Carousel ─────────────────────────────────────── */}
          <div className="mt-[20px]">
            <div className="flex items-center justify-between px-[16px] mb-[10px]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15]">Special Offers</p>
              <div className="flex gap-[4px]">
                {PROMO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePromo(i)}
                    className={`rounded-full transition-all cursor-pointer ${i === activePromo ? "w-[16px] h-[6px] bg-[#db43ae]" : "size-[6px] bg-[#e0e0e0]"}`}
                  />
                ))}
              </div>
            </div>
            <div className="px-[16px]">
              <div className="relative rounded-[14px] overflow-hidden h-[140px] shadow-[0px_4px_20px_rgba(0,0,0,0.12)]">
                <ImageWithFallback
                  src={PROMO_SLIDES[activePromo].img}
                  alt={PROMO_SLIDES[activePromo].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: PROMO_SLIDES[activePromo].gradient, opacity: 0.82 }} />
                <div className="absolute inset-0 p-[16px] flex flex-col justify-between z-10">
                  <div className="bg-white/20 rounded-full px-[8px] py-[2px] self-start">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[9px] text-white tracking-[1px]">{PROMO_SLIDES[activePromo].tag}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-['Poppins:Bold',sans-serif] text-[18px] text-white leading-[22px] whitespace-pre-line">{PROMO_SLIDES[activePromo].title}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/85 mt-[2px] whitespace-pre-line">{PROMO_SLIDES[activePromo].subtitle}</p>
                    </div>
                    <button
                      onClick={() => navigate("/appointment/book")}
                      className="bg-white rounded-full px-[14px] py-[6px] cursor-pointer hover:bg-gray-100 transition-colors shrink-0"
                    >
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#db43ae]">{PROMO_SLIDES[activePromo].cta}</p>
                    </button>
                  </div>
                </div>
                {/* Swipe arrows */}
                <button
                  onClick={() => setActivePromo((p) => (p - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length)}
                  className="absolute left-[8px] top-1/2 -translate-y-1/2 z-20 size-[28px] bg-white/30 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </button>
                <button
                  onClick={() => setActivePromo((p) => (p + 1) % PROMO_SLIDES.length)}
                  className="absolute right-[8px] top-1/2 -translate-y-1/2 z-20 size-[28px] bg-white/30 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Beauty Reminders ────────────────────────────────────────── */}
          <div className="px-[16px] mt-[20px]">
            <div className="flex items-center justify-between mb-[10px]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15]">Beauty Reminders</p>
              <div className="flex items-center gap-[4px]">
                <div className="size-[8px] rounded-full bg-[#e74c3c] animate-pulse" />
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">3 due soon</p>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              {BEAUTY_REMINDERS.map((reminder) => {
                const colors = urgencyColor[reminder.urgency];
                return (
                  <button
                    key={reminder.id}
                    onClick={() => navigate("/appointment/book")}
                    className={`${colors.bg} rounded-[12px] px-[14px] py-[12px] flex items-center gap-[12px] w-full text-left cursor-pointer hover:opacity-90 transition-opacity`}
                  >
                    <span className="text-[22px] shrink-0">{reminder.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">{reminder.label}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#555] mt-[1px]">{reminder.tip}</p>
                    </div>
                    <div className={`${colors.badge} rounded-full px-[8px] py-[3px] shrink-0`}>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white">
                        {reminder.daysLeft}d
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Referral Banner ─────────────────────────────────────────── */}
          <div className="px-[16px] mt-[16px]">
            <button
              onClick={() => setShowReferral(true)}
              className="w-full bg-gradient-to-r from-[#fdf0fa] to-[#f5d5f0] rounded-[14px] px-[16px] py-[14px] flex items-center gap-[12px] cursor-pointer hover:opacity-90 transition-opacity text-left"
            >
              <div className="size-[44px] rounded-full bg-[rgba(219,67,174,0.15)] flex items-center justify-center shrink-0">
                <Gift size={22} className="text-[#db43ae]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">Invite Friends & Earn</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">You both earn RM 20 credits on sign-up ✨</p>
              </div>
              <ChevronRight size={16} className="text-[#db43ae] shrink-0" />
            </button>
          </div>

          {/* ── Tier Progress Teaser ─────────────────────────────────────── */}
          <div className="px-[16px] mt-[14px] mb-[24px]">
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-white border border-[#f0f0f0] rounded-[14px] px-[16px] py-[14px] flex items-center gap-[12px] cursor-pointer hover:bg-gray-50 transition-colors shadow-[0px_2px_8px_rgba(0,0,0,0.04)] text-left"
            >
              <div className="size-[44px] rounded-full flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${tier.gradientFrom}, ${tier.gradientTo})` }}>
                <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">{tier.name[0]}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">{tier.name} Member · {tier.multiplier}x Points</p>
                {tier.nextTier ? (
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">
                    {pointsToNextTier} pts to unlock {tier.nextTier} benefits
                  </p>
                ) : (
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">You've reached the highest tier 💎</p>
                )}
              </div>
              <ChevronRight size={16} className="text-[#92929d] shrink-0" />
            </button>
          </div>
        </div>

        {/* Bottom Nav */}
        <BottomNav active="home" />

        {/* ── QR Modal ─────────────────────────────────────────────────── */}
        {showQr && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-[20px] p-[24px] mx-[28px] w-full max-w-[300px]">
              <div className="flex justify-between items-center mb-[6px]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">My QR Code</p>
                <button onClick={() => setShowQr(false)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] text-center mb-[14px]">Show this at the counter to earn points</p>
              <div className="bg-gray-50 rounded-[12px] p-[16px] flex items-center justify-center mb-[12px] border border-[#f0f0f0]">
                <QrCode size={140} className="text-black" strokeWidth={0.8} />
              </div>
              <div className="flex flex-col items-center gap-[2px] mb-[16px]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">Joanne Chan</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">ID: LUXE-8302-JCHN</p>
                <div className="mt-[4px] px-[10px] py-[3px] rounded-full" style={{ background: `linear-gradient(135deg, ${tier.gradientFrom}, ${tier.gradientTo})` }}>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">{tier.name} Member</p>
                </div>
              </div>
              <button onClick={() => setShowQr(false)} className="w-full bg-[#db43ae] rounded-[10px] py-[12px] cursor-pointer hover:opacity-90 transition-opacity">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">Close</p>
              </button>
            </div>
          </div>
        )}

        {/* ── Notifications Panel ───────────────────────────────────────── */}
        {showNotifications && (
          <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-start">
            <div className="bg-white w-full rounded-b-[20px] shadow-xl max-h-[70%] flex flex-col">
              <div className="flex items-center justify-between px-[16px] pt-[16px] pb-[12px] border-b border-[#f0f0f0]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Notifications</p>
                <div className="flex items-center gap-[12px]">
                  <button onClick={markAllRead} className="cursor-pointer">
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#db43ae]">Mark all read</p>
                  </button>
                  <button onClick={() => setShowNotifications(false)} className="cursor-pointer">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-[16px] py-[14px] border-b border-[#f5f5f5] flex items-start gap-[12px] ${n.unread ? "bg-[rgba(219,67,174,0.04)]" : ""}`}>
                    <div className={`size-[8px] rounded-full mt-[5px] shrink-0 ${n.unread ? "bg-[#db43ae]" : "bg-transparent"}`} />
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

        {/* ── Referral Modal ────────────────────────────────────────────── */}
        {showReferral && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center px-[24px]">
            <div className="bg-white rounded-[20px] p-[24px] w-full">
              <div className="flex justify-end mb-[4px]">
                <button onClick={() => setShowReferral(false)} className="cursor-pointer"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="text-center mb-[20px]">
                <div className="text-[52px] mb-[10px]">🎁</div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15] mb-[6px]">Invite & Earn!</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">
                  Share your code — you both get RM 20 credits when they sign up!
                </p>
              </div>
              <div className="bg-[#fdf0fa] border border-[#f0c8e8] rounded-[12px] p-[16px] flex items-center justify-between mb-[12px]">
                <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-[#db43ae] tracking-[4px]">LUXE-JC88</p>
                <button onClick={handleCopyReferral} className="bg-[#db43ae] rounded-[8px] px-[14px] py-[8px] cursor-pointer hover:opacity-90 transition-opacity">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">{copied ? "Copied!" : "Copy"}</p>
                </button>
              </div>
              <div className="flex gap-[6px] mb-[16px]">
                {[{ emoji: "👫", count: "3", label: "Friends Referred" }, { emoji: "💰", count: "RM 60", label: "Credits Earned" }].map((stat) => (
                  <div key={stat.label} className="flex-1 bg-gray-50 rounded-[10px] p-[10px] text-center">
                    <p className="text-[20px] mb-[2px]">{stat.emoji}</p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">{stat.count}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#92929d]">{stat.label}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowReferral(false)}
                className="w-full flex items-center justify-center gap-[8px] bg-[#1b1c15] rounded-[12px] py-[14px] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Share2 size={16} className="text-white" />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Share with Friends</p>
              </button>
            </div>
          </div>
        )}

        {/* Gesture bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[4px] flex justify-center pointer-events-none">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}
