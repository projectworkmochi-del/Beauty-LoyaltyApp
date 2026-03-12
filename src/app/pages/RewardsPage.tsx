import { useState } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { Gift, Tag, Percent, Clock, X, Star, ChevronRight, Lock } from "lucide-react";
import { useAppContext, VoucherEntry, TIERS } from "../context/AppContext";

type RewardMainTab = "vouchers" | "redeem" | "tier" | "history";

// ── Tab button ────────────────────────────────────────────────────────────────
function TabBtn({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-[12px] cursor-pointer transition-colors relative text-center ${isActive ? "" : "hover:bg-gray-50"}`}
    >
      {isActive && <div className="absolute bottom-0 left-[12px] right-[12px] h-[2px] bg-[#db43ae] rounded-full" />}
      <p className={`font-['Poppins:SemiBold',sans-serif] text-[11px] whitespace-nowrap ${isActive ? "text-[#db43ae]" : "text-[#92929d]"}`}>
        {label}
      </p>
    </button>
  );
}

// ── Voucher Card ──────────────────────────────────────────────────────────────
function VoucherCard({ voucher, points, onUse }: { voucher: VoucherEntry; points: number; onUse: (v: VoucherEntry) => void }) {
  const typeColors = {
    discount: { bg: "bg-[#fdf0fa]", text: "text-[#db43ae]", border: "border-[#f0c8e8]", icon: <Percent size={18} className="text-[#db43ae]" /> },
    free: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: <Gift size={18} className="text-green-600" /> },
    cashback: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: <Tag size={18} className="text-blue-600" /> },
  };
  const colors = typeColors[voucher.type];
  const isAvailable = voucher.status === "available";
  const hasEnough = !voucher.pointsCost || points >= voucher.pointsCost;
  const canUse = isAvailable && hasEnough;
  const isBirthday = voucher.title.toLowerCase().includes("birthday");

  return (
    <div className={`rounded-[14px] overflow-hidden border mb-[12px] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.06)] ${isAvailable ? "border-gray-100" : "border-gray-100 opacity-70"}`}>
      {isBirthday && isAvailable && (
        <div className="bg-gradient-to-r from-[#db43ae] to-[#e870cc] px-[12px] py-[4px] flex items-center gap-[6px]">
          <span className="text-[12px]">🎂</span>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white">Birthday Special — Valid this month!</p>
        </div>
      )}
      <div className="flex">
        <div className={`${colors.bg} ${colors.border} border-r flex items-center justify-center px-[16px] py-[20px] min-w-[80px]`}>
          <div className="text-center">
            {colors.icon}
            <p className={`font-['Poppins:Bold',sans-serif] text-[13px] ${colors.text} leading-[16px] text-center mt-[4px]`}>{voucher.discount}</p>
          </div>
        </div>
        <div className="flex-1 p-[12px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[3px]">{voucher.title}</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[4px]">{voucher.description}</p>
          {voucher.minSpend && <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[2px]">Min. spend: {voucher.minSpend}</p>}
          <div className="flex items-center gap-[3px]">
            <Clock size={11} className="text-[#92929d]" />
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">Expires {voucher.expiryDate}</p>
          </div>
          {voucher.pointsCost && (
            <p className={`font-['Poppins:Regular',sans-serif] text-[11px] mt-[2px] ${points < voucher.pointsCost ? "text-[#e74c3c]" : "text-[#db43ae]"}`}>
              Cost: {voucher.pointsCost} pts {points < voucher.pointsCost ? `(need ${voucher.pointsCost - points} more)` : ""}
            </p>
          )}
        </div>
      </div>
      {isAvailable && (
        <div className={`border-t border-dashed ${colors.border} px-[14px] py-[9px] flex items-center justify-between`}>
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">
            {canUse ? (voucher.pointsCost ? "Tap to redeem with points" : "Apply at checkout") : "Insufficient points"}
          </p>
          <button
            onClick={() => onUse(voucher)}
            disabled={!canUse}
            className={`rounded-full px-[14px] py-[5px] cursor-pointer transition-all ${canUse ? `${colors.bg} ${colors.text} hover:opacity-80` : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            <p className="font-['Poppins:SemiBold',sans-serif] text-[11px]">
              {!canUse ? "Insufficient pts" : voucher.pointsCost ? "Redeem pts" : "Use Now"}
            </p>
          </button>
        </div>
      )}
      {voucher.status === "redeemed" && (
        <div className="border-t border-dashed border-gray-200 px-[14px] py-[9px] bg-gray-50 text-center">
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">✓ Redeemed</p>
        </div>
      )}
      {voucher.status === "expired" && (
        <div className="border-t border-dashed border-gray-200 px-[14px] py-[9px] bg-gray-50 text-center">
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-red-400">✕ Expired</p>
        </div>
      )}
    </div>
  );
}

// ── Redeem Sheet ──────────────────────────────────────────────────────────────
function RedeemSheet({ voucher, points, onClose, onConfirm }: { voucher: VoucherEntry; points: number; onClose: () => void; onConfirm: () => void }) {
  const [success, setSuccess] = useState(false);
  const handleConfirm = () => {
    setSuccess(true);
    onConfirm();
    setTimeout(() => onClose(), 1800);
  };
  const typeColors = {
    discount: { bg: "bg-[#fdf0fa]", text: "text-[#db43ae]", border: "border-[#f0c8e8]" },
    free: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    cashback: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  };
  const colors = typeColors[voucher.type];

  if (success) {
    return (
      <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
        <div className="bg-white w-full rounded-t-[20px] px-[24px] pt-[24px] pb-[40px] flex flex-col items-center gap-[12px]">
          <div className="size-[64px] bg-[#e8f8f0] rounded-full flex items-center justify-center">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00b894"/><path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15]">Voucher Redeemed! 🎉</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center">
            {voucher.title} has been added to your wallet.{voucher.pointsCost ? ` ${voucher.pointsCost} pts deducted.` : ""}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-[20px] px-[24px] pt-[20px] pb-[40px]">
        <div className="w-[40px] h-[4px] bg-gray-200 rounded-full mx-auto mb-[16px]" />
        <div className="flex items-center justify-between mb-[16px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Use Voucher</p>
          <button onClick={onClose} className="cursor-pointer size-[32px] flex items-center justify-center rounded-full hover:bg-gray-100"><X size={18} className="text-gray-500" /></button>
        </div>
        <div className={`rounded-[12px] border ${colors.border} overflow-hidden mb-[16px]`}>
          <div className="flex">
            <div className={`${colors.bg} flex items-center justify-center px-[16px] py-[16px] min-w-[80px]`}>
              {voucher.type === "discount" && <Percent size={20} className={colors.text} />}
              {voucher.type === "free" && <Gift size={20} className={colors.text} />}
              {voucher.type === "cashback" && <Tag size={20} className={colors.text} />}
            </div>
            <div className="flex-1 p-[12px]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[2px]">{voucher.title}</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{voucher.description}</p>
              {voucher.minSpend && <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">Min. spend: {voucher.minSpend}</p>}
              {voucher.pointsCost && <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#db43ae] mt-[2px]">Cost: {voucher.pointsCost} pts</p>}
            </div>
          </div>
        </div>
        {voucher.pointsCost && (
          <div className="flex items-center justify-between mb-[12px] bg-gray-50 rounded-[8px] px-[14px] py-[10px]">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">Points to deduct</p>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#db43ae]">- {voucher.pointsCost} pts</p>
          </div>
        )}
        {voucher.pointsCost && points < voucher.pointsCost && (
          <div className="mb-[12px] bg-[#fde8e8] rounded-[8px] px-[14px] py-[10px]">
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#e74c3c]">Insufficient points. You need {voucher.pointsCost - points} more pts.</p>
          </div>
        )}
        <div className="flex gap-[12px]">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-[10px] py-[14px] cursor-pointer hover:bg-gray-50">
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] text-center">Cancel</p>
          </button>
          <button
            onClick={handleConfirm}
            disabled={!!(voucher.pointsCost && points < voucher.pointsCost)}
            className="flex-1 rounded-[10px] py-[14px] cursor-pointer hover:opacity-90 disabled:cursor-not-allowed"
            style={{ background: (voucher.pointsCost && points < voucher.pointsCost) ? "#e0e0e0" : "#db43ae" }}
          >
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-center" style={{ color: (voucher.pointsCost && points < voucher.pointsCost) ? "#999" : "white" }}>
              Confirm Use
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Redeemable catalog ────────────────────────────────────────────────────────
const REDEEMABLE = [
  { id: "r1", emoji: "🎂", title: "Birthday Bonus Voucher", desc: "30% OFF any service", ptsRequired: 0, tag: "FREE on Birthday", special: true },
  { id: "r2", emoji: "💇‍♀️", title: "Free Hair Wash", desc: "Complimentary wash with booking", ptsRequired: 100, tag: "Popular" },
  { id: "r3", emoji: "🎫", title: "RM 15 Credits Cashback", desc: "Credits added to wallet instantly", ptsRequired: 150, tag: null },
  { id: "r4", emoji: "💅", title: "10% OFF Next Service", desc: "Min. spend RM 80", ptsRequired: 200, tag: "Best Value" },
  { id: "r5", emoji: "✨", title: "Free Scalp Treatment", desc: "30-min scalp analysis + serum", ptsRequired: 400, tag: null },
  { id: "r6", emoji: "🌹", title: "15% OFF Hair Treatment", desc: "Valid for colour or rebond", ptsRequired: 500, tag: "Orchid+" },
  { id: "r7", emoji: "💎", title: "VIP Priority Booking", desc: "Skip the queue, book first slots", ptsRequired: 800, tag: "Jasmine+" },
  { id: "r8", emoji: "🎁", title: "Free Monthly Hair Wash", desc: "1 complimentary wash per month", ptsRequired: 1200, tag: "Diamond+" },
];

// ── Tier ladder ────────────────────────────────────────────────────────────────
const TIER_BENEFITS = [
  {
    name: "Rose", minPts: 0, multiplier: "1×", color: "#db43ae", gradFrom: "#db43ae", gradTo: "#e870cc",
    benefits: ["Earn 1 pt per RM 1 spent", "Birthday voucher 30% OFF", "Access to basic rewards catalogue", "Digital membership card"],
  },
  {
    name: "Orchid", minPts: 500, multiplier: "1.5×", color: "#9b59b6", gradFrom: "#9b59b6", gradTo: "#c39bd3",
    benefits: ["Earn 1.5 pts per RM 1 spent", "5% tier discount on services", "Birthday voucher 35% OFF", "Priority customer support", "Monthly exclusive promos"],
  },
  {
    name: "Jasmine", minPts: 1500, multiplier: "2×", color: "#e67e22", gradFrom: "#e67e22", gradTo: "#f0a500",
    benefits: ["Earn 2 pts per RM 1 spent", "10% tier discount on services", "Birthday voucher 40% OFF", "Free monthly hair wash", "Priority booking slots", "Early access to new services"],
  },
  {
    name: "Diamond", minPts: 3000, multiplier: "3×", color: "#2980b9", gradFrom: "#2980b9", gradTo: "#5dade2",
    benefits: ["Earn 3 pts per RM 1 spent", "15% tier discount on services", "Birthday voucher 50% OFF", "Complimentary quarterly treatment", "VIP booking access", "Dedicated beauty consultant", "Annual anniversary gift"],
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export function RewardsPage() {
  const { vouchers, points, totalPointsEarned, deductPoints, redeemVoucher, pointsHistory } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RewardMainTab>("vouchers");
  const [voucherFilter, setVoucherFilter] = useState<"available" | "redeemed" | "expired">("available");
  const [redeemTarget, setRedeemTarget] = useState<VoucherEntry | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const available = vouchers.filter((v) => v.status === "available");
  const redeemed = vouchers.filter((v) => v.status === "redeemed");
  const expired = vouchers.filter((v) => v.status === "expired");

  const filteredVouchers = voucherFilter === "available" ? available : voucherFilter === "redeemed" ? redeemed : expired;

  const handleUse = (voucher: VoucherEntry) => {
    if (voucher.pointsCost) {
      setRedeemTarget(voucher);
    } else {
      navigate("/product", { state: { appliedVoucher: { id: voucher.id, title: voucher.title, discount: voucher.discount, type: voucher.type, description: voucher.description }, fromRewards: true } });
    }
  };

  const handleConfirmRedeem = () => {
    if (!redeemTarget) return;
    redeemVoucher(redeemTarget.id);
    if (redeemTarget.pointsCost) {
      deductPoints(redeemTarget.pointsCost, `Voucher: ${redeemTarget.title}`, `Redeemed ${redeemTarget.discount} voucher`);
    }
    setRedeemTarget(null);
  };

  const handleCatalogRedeem = (item: typeof REDEEMABLE[0]) => {
    if (item.ptsRequired === 0 || points >= item.ptsRequired) {
      setRedeemSuccess(item.title);
      if (item.ptsRequired > 0) {
        deductPoints(item.ptsRequired, `Redeemed: ${item.title}`, `Catalogue redemption`);
      }
      setTimeout(() => setRedeemSuccess(null), 2500);
    }
  };

  // Current tier
  const currentTierIdx = [...TIER_BENEFITS].reverse().findIndex((t) => totalPointsEarned >= t.minPts);
  const activeTierName = currentTierIdx >= 0 ? [...TIER_BENEFITS].reverse()[currentTierIdx].name : "Rose";

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col" data-name="Rewards">

        {/* Header */}
        <div className="shrink-0 bg-white border-b border-[#f0f0f0]">
          {/* Points banner */}
          <div className="bg-gradient-to-r from-[#db43ae] to-[#e870cc] px-[20px] pt-[52px] pb-[16px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/80">Available Points</p>
                <p className="font-['Poppins:Bold',sans-serif] text-[28px] text-white leading-none">{points.toLocaleString()} <span className="font-['Poppins:Regular',sans-serif] text-[14px]">pts</span></p>
              </div>
              <div className="flex flex-col items-end gap-[6px]">
                <div className="bg-white/20 rounded-[8px] px-[12px] py-[6px]">
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white">{available.length} Vouchers Active</p>
                </div>
                <button onClick={() => navigate("/points-history")} className="flex items-center gap-[3px]">
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/80">View History</p>
                  <ChevronRight size={12} className="text-white/80" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-[#f0f0f0]">
            <TabBtn label="My Vouchers" isActive={activeTab === "vouchers"} onClick={() => setActiveTab("vouchers")} />
            <TabBtn label="Redeem" isActive={activeTab === "redeem"} onClick={() => setActiveTab("redeem")} />
            <TabBtn label="Tier Benefits" isActive={activeTab === "tier"} onClick={() => setActiveTab("tier")} />
            <TabBtn label="Pts History" isActive={activeTab === "history"} onClick={() => setActiveTab("history")} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-[80px]">

          {/* ── MY VOUCHERS ──────────────────────────────────────────── */}
          {activeTab === "vouchers" && (
            <div>
              {/* Sub-filter */}
              <div className="flex items-center gap-[8px] px-[16px] py-[12px] border-b border-[#f5f5f5]">
                {(["available", "redeemed", "expired"] as const).map((f) => {
                  const count = f === "available" ? available.length : f === "redeemed" ? redeemed.length : expired.length;
                  return (
                    <button
                      key={f}
                      onClick={() => setVoucherFilter(f)}
                      className={`flex items-center gap-[5px] px-[12px] py-[5px] rounded-full border cursor-pointer transition-all capitalize ${voucherFilter === f ? "border-[#db43ae] bg-[rgba(219,67,174,0.08)] text-[#db43ae]" : "border-[#e0e0e0] text-[#92929d] hover:bg-gray-50"}`}
                    >
                      <p className="font-['Poppins:Regular',sans-serif] text-[12px]">{f}</p>
                      {count > 0 && <span className={`text-[10px] rounded-full px-[5px] py-[1px] ${voucherFilter === f ? "bg-[#db43ae] text-white" : "bg-gray-100 text-[#92929d]"}`}>{count}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="px-[16px] pt-[12px] pb-[8px]">
                {filteredVouchers.length === 0 ? (
                  <div className="py-[60px] text-center">
                    <div className="size-[60px] bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-[12px]">
                      <Gift size={28} className="text-[#92929d]" strokeWidth={1.5} />
                    </div>
                    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#92929d]">No {voucherFilter} vouchers</p>
                  </div>
                ) : (
                  filteredVouchers.map((v) => (
                    <VoucherCard key={v.id} voucher={v} points={points} onUse={handleUse} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── REDEEM CATALOG ───────────────────────────────────────── */}
          {activeTab === "redeem" && (
            <div className="px-[16px] pt-[14px]">
              {/* Success toast */}
              {redeemSuccess && (
                <div className="mb-[12px] bg-[#e8f8f0] border border-green-200 rounded-[10px] px-[14px] py-[10px] flex items-center gap-[8px]">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00b894"/><path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#00b894]">Redeemed: {redeemSuccess}!</p>
                </div>
              )}
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15] mb-[4px]">Rewards Catalogue</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[14px]">Spend your points on exclusive beauty rewards</p>
              <div className="flex flex-col gap-[10px]">
                {REDEEMABLE.map((item) => {
                  const canRedeem = item.ptsRequired === 0 || points >= item.ptsRequired;
                  return (
                    <div key={item.id} className={`bg-white rounded-[14px] border ${canRedeem ? "border-[#f0f0f0]" : "border-[#f5f5f5] opacity-75"} shadow-[0px_2px_10px_rgba(0,0,0,0.05)] flex items-center gap-[14px] px-[14px] py-[14px]`}>
                      <div className="size-[44px] rounded-[12px] bg-[#fdf0fa] flex items-center justify-center shrink-0">
                        <span className="text-[22px]">{item.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[6px] mb-[2px]">
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">{item.title}</p>
                          {item.tag && (
                            <span className={`text-[9px] rounded-full px-[6px] py-[1px] font-['Poppins:SemiBold',sans-serif] ${item.special ? "bg-[rgba(219,67,174,0.12)] text-[#db43ae]" : "bg-[#fdf0fa] text-[#db43ae]"}`}>{item.tag}</span>
                          )}
                        </div>
                        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{item.desc}</p>
                        <p className={`font-['Poppins:SemiBold',sans-serif] text-[12px] mt-[2px] ${canRedeem ? "text-[#db43ae]" : "text-[#b0b0b0]"}`}>
                          {item.ptsRequired === 0 ? "Free on Birthday 🎂" : `${item.ptsRequired} pts`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCatalogRedeem(item)}
                        disabled={!canRedeem}
                        className={`shrink-0 rounded-[8px] px-[12px] py-[7px] cursor-pointer transition-all ${canRedeem ? "bg-[#db43ae] hover:opacity-90" : "bg-[#e0e0e0] cursor-not-allowed"}`}
                      >
                        {canRedeem ? (
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">Redeem</p>
                        ) : (
                          <Lock size={14} className="text-[#999]" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TIER BENEFITS ────────────────────────────────────────── */}
          {activeTab === "tier" && (
            <div className="px-[16px] pt-[14px]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15] mb-[4px]">Loyalty Tiers</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[14px]">Earn more points, unlock better benefits</p>
              <div className="flex flex-col gap-[14px]">
                {TIER_BENEFITS.map((tier) => {
                  const isActive = tier.name === activeTierName;
                  const isUnlocked = totalPointsEarned >= tier.minPts;
                  return (
                    <div
                      key={tier.name}
                      className={`rounded-[16px] overflow-hidden border ${isActive ? "border-[rgba(219,67,174,0.3)] shadow-[0px_4px_20px_rgba(219,67,174,0.15)]" : "border-[#f0f0f0]"}`}
                    >
                      {/* Tier header */}
                      <div className="relative h-[70px] flex items-center px-[16px] gap-[12px]" style={{ background: `linear-gradient(135deg, ${tier.gradFrom}, ${tier.gradTo})` }}>
                        <div className="absolute -right-[10px] -top-[10px] size-[80px] rounded-full bg-white/10" />
                        <div className="size-[42px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-white">{tier.name[0]}</p>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-[8px]">
                            <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">{tier.name}</p>
                            {isActive && <span className="bg-white/30 rounded-full px-[8px] py-[2px]"><p className="font-['Poppins:SemiBold',sans-serif] text-[9px] text-white">YOUR TIER</p></span>}
                            {!isUnlocked && <Lock size={14} className="text-white/60" />}
                          </div>
                          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/80">
                            {tier.minPts === 0 ? "Starting tier" : `From ${tier.minPts.toLocaleString()} pts earned`} · {tier.multiplier} points
                          </p>
                        </div>
                      </div>
                      {/* Benefits list */}
                      <div className="bg-white p-[14px]">
                        <div className="flex flex-col gap-[7px]">
                          {tier.benefits.map((b, i) => (
                            <div key={i} className="flex items-start gap-[8px]">
                              <div className={`size-[16px] rounded-full flex items-center justify-center shrink-0 mt-[1px] ${isUnlocked ? "" : "opacity-40"}`} style={{ background: isUnlocked ? tier.gradFrom : "#e0e0e0" }}>
                                <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                              </div>
                              <p className={`font-['Poppins:Regular',sans-serif] text-[12px] ${isUnlocked ? "text-[#555]" : "text-[#b0b0b0]"}`}>{b}</p>
                            </div>
                          ))}
                        </div>
                        {!isUnlocked && (
                          <div className="mt-[10px] bg-gray-50 rounded-[8px] px-[12px] py-[8px] flex items-center gap-[6px]">
                            <Lock size={12} className="text-[#92929d]" />
                            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">
                              Earn {(tier.minPts - totalPointsEarned).toLocaleString()} more pts to unlock
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-[20px]" />
            </div>
          )}

          {/* ── POINTS HISTORY ───────────────────────────────────────── */}
          {activeTab === "history" && (
            <div>
              {/* Summary */}
              <div className="px-[16px] py-[12px] border-b border-[#f5f5f5]">
                <div className="flex gap-[8px]">
                  <div className="flex-1 bg-[#fdf0fa] rounded-[10px] p-[10px] text-center">
                    <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-[#db43ae]">{pointsHistory.filter(h => h.type === "earned").reduce((s, h) => s + h.points, 0)}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#92929d]">Total Earned</p>
                  </div>
                  <div className="flex-1 bg-[#fde8e8] rounded-[10px] p-[10px] text-center">
                    <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-[#e74c3c]">{Math.abs(pointsHistory.filter(h => h.type === "used").reduce((s, h) => s + h.points, 0))}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#92929d]">Total Used</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-[10px] p-[10px] text-center">
                    <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-[#1b1c15]">{points}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#92929d]">Balance</p>
                  </div>
                </div>
              </div>
              {/* History list */}
              <div className="pb-[8px]">
                {pointsHistory.map((entry) => (
                  <div key={entry.id} className="px-[16px] py-[14px] border-b border-[#f5f5f5] flex items-start gap-[12px]">
                    <div className={`size-[38px] rounded-full flex items-center justify-center shrink-0 ${entry.type === "earned" ? "bg-[#fdf0fa]" : entry.type === "used" ? "bg-[#fde8e8]" : "bg-gray-100"}`}>
                      {entry.type === "earned" && <Star size={16} className="text-[#db43ae]" strokeWidth={1.5} />}
                      {entry.type === "used" && <Gift size={16} className="text-[#e74c3c]" strokeWidth={1.5} />}
                      {entry.type === "expired" && <Clock size={16} className="text-[#92929d]" strokeWidth={1.5} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[1px]">{entry.title}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[2px]">{entry.description}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#b0b0b0]">{entry.date}</p>
                    </div>
                    <p className={`font-['Poppins:Bold',sans-serif] text-[14px] shrink-0 ${entry.points > 0 ? "text-[#db43ae]" : entry.type === "expired" ? "text-[#92929d]" : "text-[#e74c3c]"}`}>
                      {entry.points > 0 ? "+" : ""}{entry.points} pts
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <BottomNav active="rewards" />

        {/* Redeem sheet */}
        {redeemTarget && (
          <RedeemSheet
            voucher={redeemTarget}
            points={points}
            onClose={() => setRedeemTarget(null)}
            onConfirm={handleConfirmRedeem}
          />
        )}

        {/* Gesture bar */}
        <div className="absolute bottom-[2px] left-0 right-0 h-[4px] flex justify-center pointer-events-none">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}
