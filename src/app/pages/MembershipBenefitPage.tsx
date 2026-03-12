import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { BottomNav } from "../components/BottomNav";

type TierName = "Silver" | "Gold" | "Platinum" | "Diamond";

interface Tier {
  name: TierName;
  color: string;
  bg: string;
  tagColor: string;
  progress: number;
  progressPct: number;
  upgradeText: string | null;
  isCurrent: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Silver",
    color: "#A2A39B",
    bg: "#fafaf4",
    tagColor: "#A2A39B",
    progress: 44,
    progressPct: 44,
    upgradeText: "Spend RM 500.00 more upgrade to Gold",
    isCurrent: true,
  },
  {
    name: "Gold",
    color: "#d4a017",
    bg: "#fee9b2",
    tagColor: "#d4a017",
    progress: 60,
    progressPct: 60,
    upgradeText: "Spend RM 1,000.00 more upgrade to Platinum",
    isCurrent: false,
  },
  {
    name: "Platinum",
    color: "#F26B18",
    bg: "#fbd1b7",
    tagColor: "#F26B18",
    progress: 44,
    progressPct: 44,
    upgradeText: "Spend RM 5,000.00 more upgrade to Diamond",
    isCurrent: false,
  },
  {
    name: "Diamond",
    color: "#0D25D7",
    bg: "#c6cbef",
    tagColor: "#0D25D7",
    progress: 44,
    progressPct: 44,
    upgradeText: "Spend RM 2,000.00 more for exclusive rewards",
    isCurrent: false,
  },
];

interface Benefit {
  emoji: string;
  label: string;
  qty: number;
}

const TIER_BENEFITS: Record<TierName, Benefit[]> = {
  Silver: [
    { emoji: "🎁", label: "Gift Card", qty: 1 },
    { emoji: "🎟️", label: "15% OFF", qty: 1 },
  ],
  Gold: [
    { emoji: "🎁", label: "Gift Card", qty: 1 },
    { emoji: "🎟️", label: "15% OFF", qty: 1 },
    { emoji: "🎂", label: "Birthday Gift", qty: 1 },
  ],
  Platinum: [
    { emoji: "🎁", label: "Gift Card", qty: 5 },
    { emoji: "🎟️", label: "50% OFF", qty: 1 },
    { emoji: "🎂", label: "Birthday Gift", qty: 1 },
    { emoji: "🆓", label: "Free Service", qty: 1 },
  ],
  Diamond: [
    { emoji: "🎁", label: "Gift Card", qty: 10 },
    { emoji: "🎟️", label: "70% OFF", qty: 2 },
    { emoji: "🎂", label: "Birthday Gift", qty: 2 },
    { emoji: "🆓", label: "Free Service", qty: 2 },
    { emoji: "⭐", label: "VIP Access", qty: 1 },
  ],
};

function TrophyIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="13" r="7" stroke={color} strokeWidth="1.8" />
      <path d="M11 13c0 0-2 0-2-3V7h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M21 13c0 0 2 0 2-3V7h-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 27h10M16 22v5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 22l-2 5M19 22l2 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TierCard({
  tier,
  isActive,
  onSelect,
}: {
  tier: Tier;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full rounded-[10px] p-[14px] text-left shadow-[0px_2px_8px_0px_rgba(0,0,0,0.10)] transition-all shrink-0"
      style={{
        background: tier.bg,
        border: isActive ? `2px solid ${tier.color}` : "2px solid transparent",
      }}
    >
      <div className="flex items-center justify-between mb-[8px]">
        <div className="flex items-center gap-[8px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[16px]" style={{ color: tier.color }}>
            {tier.name}
          </p>
          {tier.isCurrent && (
            <div className="px-[7px] py-[2px] rounded-full bg-[rgba(219,67,174,0.12)]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[8px] text-[#db43ae]">Current Ranking</p>
            </div>
          )}
        </div>
        <TrophyIcon color={tier.color} />
      </div>

      {/* Progress */}
      <div className="relative h-[10px] mb-[6px]">
        <div className="absolute top-[4px] left-0 right-0 h-[2px] bg-[rgba(0,0,0,0.1)] rounded-full" />
        <div
          className="absolute top-[4px] left-0 h-[2px] rounded-full"
          style={{ width: `${tier.progressPct}%`, background: `linear-gradient(to right, #db43ae, ${tier.color})` }}
        />
        <div
          className="absolute top-[1px] size-[8px] rounded-full bg-[#db43ae] shadow-[0px_2px_6px_rgba(219,67,174,0.5)]"
          style={{ left: `${tier.progressPct}%`, transform: "translateX(-50%)" }}
        />
      </div>

      {tier.upgradeText && (
        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#696969]">{tier.upgradeText}</p>
      )}
    </button>
  );
}

export function MembershipBenefitPage() {
  const navigate = useNavigate();
  const [activeTier, setActiveTier] = useState<TierName>("Silver");

  const benefits = TIER_BENEFITS[activeTier];

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="h-[40px] shrink-0 flex items-center justify-between px-[16px] bg-white">
          <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)]">12:30</p>
          <div className="flex gap-[6px] items-center">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 9h2v3H1zM4.5 6h2v6h-2zM8 3h2v9H8zM11.5 0h2v12h-2z" fill="black" fillOpacity="0.9"/></svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="0" y="1" width="20" height="10" rx="2" stroke="black" strokeOpacity="0.35" strokeWidth="1"/><rect x="1" y="2" width="16" height="8" rx="1" fill="black" fillOpacity="0.9"/></svg>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-[8px] px-[8px] py-[10px] shrink-0 border-b border-[#f0f0f0]">
          <button
            onClick={() => navigate(-1)}
            className="size-[36px] flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <ChevronLeft size={22} className="text-[#1b1c15]" />
          </button>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Membership Benefits</p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-[100px]">
          {/* Tier selector — horizontal scroll */}
          <div className="overflow-x-auto no-scrollbar px-[16px] py-[14px]">
            <div className="flex gap-[10px]" style={{ width: "max-content" }}>
              {TIERS.map((tier) => (
                <div key={tier.name} style={{ width: "280px" }}>
                  <TierCard
                    tier={tier}
                    isActive={activeTier === tier.name}
                    onSelect={() => setActiveTier(tier.name)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tier tab pills */}
          <div className="flex gap-[8px] px-[16px] mb-[16px] overflow-x-auto no-scrollbar">
            {TIERS.map((tier) => (
              null
            ))}
          </div>

          {/* Benefits section */}
          <div className="px-[16px]">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[14px]">
              Benefit to You
            </p>

            <div className="grid grid-cols-3 gap-[16px]">
              {benefits.map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-[6px]">
                  <div className="relative">
                    <div className="size-[60px] rounded-[12px] bg-[#f5f5f5] flex items-center justify-center text-[32px] leading-none">
                      {b.emoji}
                    </div>
                    {/* Badge */}
                    <div className="absolute -top-[6px] -right-[6px] bg-[#db43ae] rounded-full px-[5px] py-[2px] min-w-[22px] flex items-center justify-center">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[9px] text-white">X {b.qty}</p>
                    </div>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#1b1c15] text-center">{b.label}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="mt-[24px] border-t border-[#f0f0f0] pt-[16px]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15] mb-[12px]">
                How to upgrade?
              </p>
              <div className="flex flex-col gap-[10px]">
                {[
                  { step: "1", text: "Earn points from every purchase and appointment" },
                  { step: "2", text: "Accumulate spending to reach the next tier" },
                  { step: "3", text: "Enjoy exclusive perks and benefits at each level" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-[10px]">
                    <div className="size-[24px] rounded-full bg-[#db43ae] flex items-center justify-center shrink-0 mt-[1px]">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">{s.step}</p>
                    </div>
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#555] leading-[20px]">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <BottomNav active="profile" />

        {/* Gesture bar */}
        <div className="absolute bottom-[6px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}