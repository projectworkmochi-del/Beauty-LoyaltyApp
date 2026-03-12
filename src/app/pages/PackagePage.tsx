import { useState } from "react";
import { AppBar } from "../components/AppBar";
import { ChevronRight, X, Calendar, Clock } from "lucide-react";

import imgProductImage from "figma:asset/f078135dfa64359d0bb3b8ab60f79eac919d2352.png";
import imgProductImage2 from "figma:asset/fc4a0f8791e9f26cf187a4b8c2adb930a31540d3.png";

type PackageTab = "active" | "used" | "expired";

type PackageItem = {
  id: string;
  name: string;
  description: string;
  sessions: string;
  purchaseDate: string;
  expiryDate: string;
  usedSessions: number;
  totalSessions: number;
  price: string;
  img: string;
  status: "active" | "used" | "expired";
};

const packageData: PackageItem[] = [
  {
    id: "1",
    name: "Package 1",
    description: "3 Laser Sessions + 1 Signature Facial",
    sessions: "3 Laser + 1 Facial",
    purchaseDate: "2025-07-15",
    expiryDate: "2026-07-15",
    usedSessions: 1,
    totalSessions: 4,
    price: "RM 120.00",
    img: imgProductImage,
    status: "active",
  },
  {
    id: "2",
    name: "Hair Care Set",
    description: "Premium Hair Treatment Package",
    sessions: "5 Treatments",
    purchaseDate: "2025-06-01",
    expiryDate: "2025-12-01",
    usedSessions: 5,
    totalSessions: 5,
    price: "RM 250.00",
    img: imgProductImage2,
    status: "used",
  },
];

function PackageTabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex-1 relative">
      {isActive && (
        <div
          aria-hidden="true"
          className="absolute border-[#db43ae] border-b-2 border-solid inset-0 pointer-events-none"
        />
      )}
      <button
        onClick={onClick}
        className="flex items-center justify-center py-[14px] w-full hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <p
          className={`leading-[18px] not-italic text-[14px] whitespace-nowrap ${
            isActive
              ? "font-['Poppins:Bold',sans-serif] text-[#db43ae]"
              : "font-['Poppins:Regular',sans-serif] text-[#696974]"
          }`}
        >
          {label}
        </p>
      </button>
    </div>
  );
}

// ── Package Details Sheet ────────────────────────────────────────────────────

function PackageDetailsSheet({ pkg, onClose }: { pkg: PackageItem; onClose: () => void }) {
  const progressPercent = (pkg.usedSessions / pkg.totalSessions) * 100;
  const remaining = pkg.totalSessions - pkg.usedSessions;

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-[20px] px-[20px] pt-[20px] pb-[40px]">
        <div className="w-[40px] h-[4px] bg-gray-200 rounded-full mx-auto mb-[16px]" />
        <div className="flex items-center justify-between mb-[16px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Package Details</p>
          <button onClick={onClose} className="cursor-pointer size-[32px] flex items-center justify-center rounded-full hover:bg-gray-100">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Image + name */}
        <div className="flex gap-[12px] mb-[16px]">
          <div className="size-[64px] rounded-[8px] overflow-hidden bg-gray-100 shrink-0">
            <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15] mb-[2px]">{pkg.name}</p>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[4px]">{pkg.description}</p>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#db43ae]">{pkg.price}</p>
          </div>
        </div>

        {/* Session progress */}
        <div className="mb-[14px]">
          <div className="flex items-center justify-between mb-[6px]">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">Sessions Used: {pkg.usedSessions}/{pkg.totalSessions}</p>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#db43ae]">{remaining} remaining</p>
          </div>
          <div className="w-full h-[8px] bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#db43ae] rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-[8px] mb-[16px]">
          <div className="flex items-center gap-[8px]">
            <Calendar size={14} className="text-[#92929d] shrink-0" />
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">Purchased: <span className="text-[#92929d]">{pkg.purchaseDate}</span></p>
          </div>
          <div className="flex items-center gap-[8px]">
            <Clock size={14} className="text-[#92929d] shrink-0" />
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">Expires: <span className="text-[#92929d]">{pkg.expiryDate}</span></p>
          </div>
        </div>

        {/* Use now button (only if active + sessions left) */}
        {pkg.status === "active" && remaining > 0 && (
          <button
            onClick={onClose}
            className="w-full bg-[#db43ae] py-[13px] rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">Book a Session</p>
          </button>
        )}
      </div>
    </div>
  );
}

function PackageCard({ pkg, onDetails }: { pkg: PackageItem; onDetails: (p: PackageItem) => void }) {
  const progressPercent = (pkg.usedSessions / pkg.totalSessions) * 100;
  const remaining = pkg.totalSessions - pkg.usedSessions;

  const statusColors: Record<PackageItem["status"], { bg: string; text: string; label: string }> = {
    active: { bg: "bg-green-50", text: "text-green-600", label: "Active" },
    used: { bg: "bg-gray-50", text: "text-gray-500", label: "Completed" },
    expired: { bg: "bg-red-50", text: "text-red-500", label: "Expired" },
  };

  const status = statusColors[pkg.status];

  return (
    <div className="bg-white border border-gray-100 rounded-[12px] p-[16px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] mb-[12px]">
      <div className="flex gap-[12px]">
        <div className="size-[70px] rounded-[8px] overflow-hidden bg-gray-100 shrink-0">
          <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-[4px]">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15] leading-[18px]">{pkg.name}</p>
            <span className={`text-[11px] font-['Poppins:Regular',sans-serif] px-[8px] py-[2px] rounded-full ${status.bg} ${status.text}`}>{status.label}</span>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[4px]">{pkg.description}</p>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#db43ae]">{pkg.price}</p>
        </div>
      </div>

      <div className="mt-[12px]">
        <div className="flex items-center justify-between mb-[6px]">
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">Sessions Used: {pkg.usedSessions}/{pkg.totalSessions}</p>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">{remaining} left</p>
        </div>
        <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#db43ae] rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-[12px] pt-[12px] border-t border-gray-50">
        <div>
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">Purchased: {pkg.purchaseDate}</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">Expires: {pkg.expiryDate}</p>
        </div>
        <button
          onClick={() => onDetails(pkg)}
          className="flex items-center gap-[4px] text-[#db43ae] cursor-pointer hover:opacity-70 transition-opacity"
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[12px]">Details</p>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function PackagePage() {
  const [activeTab, setActiveTab] = useState<PackageTab>("active");
  const [detailTarget, setDetailTarget] = useState<PackageItem | null>(null);

  const filteredPackages =
    activeTab === "active"
      ? packageData.filter((p) => p.status === "active")
      : activeTab === "used"
      ? packageData.filter((p) => p.status === "used")
      : packageData.filter((p) => p.status === "expired");

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden" data-name="My Package">
        <AppBar title="My Package" />

        {/* Summary Card */}
        <div className="absolute top-[96px] left-0 right-0 bg-gradient-to-r from-[#db43ae] to-[#e870cc] px-[20px] py-[16px]">
          <div className="flex items-center justify-between">
            <div><p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/80">Total Packages</p><p className="font-['Poppins:Bold',sans-serif] text-[28px] text-white">1</p></div>
            <div className="text-center"><p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/80">Active</p><p className="font-['Poppins:Bold',sans-serif] text-[28px] text-white">1</p></div>
            <div className="text-center"><p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/80">Completed</p><p className="font-['Poppins:Bold',sans-serif] text-[28px] text-white">1</p></div>
            <div className="text-center"><p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/80">Expired</p><p className="font-['Poppins:Bold',sans-serif] text-[28px] text-white">0</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="absolute left-0 right-0 top-[192px] flex items-center border-b border-gray-100 bg-white z-10">
          {(["active", "used", "expired"] as PackageTab[]).map((tab) => (
            <div key={tab} className="flex-1 relative">
              {activeTab === tab && <div aria-hidden="true" className="absolute border-[#db43ae] border-b-2 border-solid inset-0 pointer-events-none" />}
              <button onClick={() => setActiveTab(tab)} className="flex items-center justify-center py-[14px] w-full hover:bg-gray-50 transition-colors cursor-pointer">
                <p className={`leading-[18px] not-italic text-[14px] whitespace-nowrap ${activeTab === tab ? "font-['Poppins:Bold',sans-serif] text-[#db43ae]" : "font-['Poppins:Regular',sans-serif] text-[#696974]"}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </p>
              </button>
            </div>
          ))}
        </div>

        {/* Package List */}
        <div className="absolute left-0 top-[244px] w-full bottom-[24px] overflow-y-auto">
          <div className="px-[16px] pt-[12px] pb-[32px]">
            {filteredPackages.length === 0 ? (
              <div className="py-[60px] text-center">
                <div className="size-[60px] bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-[12px]">
                  <svg width="30" height="30" fill="none" viewBox="0 0 30 30"><rect x="3" y="9" width="24" height="18" rx="2" stroke="#92929d" strokeWidth="1.5"/><path d="M10 9V7a5 5 0 0 1 10 0v2" stroke="#92929d" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#92929d]">No packages found</p>
              </div>
            ) : (
              filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onDetails={setDetailTarget} />
              ))
            )}
          </div>
        </div>

        {/* Gesture bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[24px] bg-white flex items-center justify-center">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>

        {/* Details sheet */}
        {detailTarget && (
          <PackageDetailsSheet pkg={detailTarget} onClose={() => setDetailTarget(null)} />
        )}
      </div>
    </div>
  );
}