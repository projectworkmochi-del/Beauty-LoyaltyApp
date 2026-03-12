import { useState } from "react";
import { AppBar } from "../components/AppBar";
import { useAppContext } from "../context/AppContext";
import type { CreditsHistoryEntry } from "../context/AppContext";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  ShoppingBag,
  Clock,
  X,
  Plus,
  CreditCard,
  ArrowDown,
} from "lucide-react";

type CreditTab = "all" | "topup" | "earned" | "used" | "expired";
type ActionModalType = "topup" | "pay" | "withdraw" | null;

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-MY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

function groupByDate(items: CreditsHistoryEntry[]): Record<string, CreditsHistoryEntry[]> {
  return items.reduce<Record<string, CreditsHistoryEntry[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
}

// ── Transaction icon & color helpers ─────────────────────────────────────────
const typeConfig: Record<
  CreditsHistoryEntry["type"],
  { iconBg: string; iconColor: string; amountColor: string; badge: string; badgeBg: string }
> = {
  topup:   { iconBg: "bg-[rgba(219,67,174,0.1)]",  iconColor: "#db43ae", amountColor: "#db43ae", badge: "Top Up",  badgeBg: "bg-[rgba(219,67,174,0.1)] text-[#db43ae]" },
  earned:  { iconBg: "bg-[rgba(16,185,129,0.1)]",  iconColor: "#10b981", amountColor: "#10b981", badge: "Earned",  badgeBg: "bg-[rgba(16,185,129,0.1)] text-[#10b981]" },
  used:    { iconBg: "bg-[rgba(249,115,22,0.1)]",  iconColor: "#f97316", amountColor: "#f97316", badge: "Spent",   badgeBg: "bg-[rgba(249,115,22,0.1)] text-[#f97316]" },
  expired: { iconBg: "bg-[rgba(156,163,175,0.15)]", iconColor: "#9ca3af", amountColor: "#9ca3af", badge: "Expired", badgeBg: "bg-[rgba(156,163,175,0.15)] text-[#9ca3af]" },
};

function TxIcon({ type }: { type: CreditsHistoryEntry["type"] }) {
  const cfg = typeConfig[type];
  return (
    <div className={`size-[44px] rounded-full ${cfg.iconBg} flex items-center justify-center shrink-0`}>
      {type === "topup"   && <ArrowDownLeft  size={22} style={{ color: cfg.iconColor }} />}
      {type === "earned"  && <TrendingUp     size={20} style={{ color: cfg.iconColor }} />}
      {type === "used"    && <ShoppingBag    size={20} style={{ color: cfg.iconColor }} />}
      {type === "expired" && <Clock          size={20} style={{ color: cfg.iconColor }} />}
    </div>
  );
}

// ── Transaction Detail Sheet ──────────────────────────────────────────────────
function TxDetailSheet({
  item,
  onClose,
}: {
  item: CreditsHistoryEntry;
  onClose: () => void;
}) {
  const cfg = typeConfig[item.type];
  const isPositive = item.amount > 0;
  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-[24px] p-[24px]">
        <div className="w-[40px] h-[4px] bg-[#e0e0e0] rounded-full mx-auto mb-[20px]" />
        <div className={`size-[56px] rounded-full ${cfg.iconBg} flex items-center justify-center mx-auto mb-[14px]`}>
          <TxIcon type={item.type} />
        </div>
        <p className="font-['Poppins:Bold',sans-serif] text-[22px] text-[#1b1c15] text-center mb-[2px]">
          <span style={{ color: cfg.amountColor }}>
            {isPositive ? "+" : ""}RM {Math.abs(item.amount).toFixed(2)}
          </span>
        </p>
        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center mb-[20px]">
          {item.title}
        </p>
        <div className="bg-[#fafafa] rounded-[14px] p-[16px] flex flex-col gap-[12px] mb-[20px]">
          {[
            { l: "Transaction Type", v: cfg.badge },
            { l: "Description", v: item.description },
            { l: "Date", v: formatDate(item.date) },
            { l: "Amount", v: `${isPositive ? "+" : ""}RM ${Math.abs(item.amount).toFixed(2)}` },
            { l: "Status", v: item.type === "expired" ? "Expired" : isPositive ? "Credited" : "Debited" },
          ].map((row) => (
            <div key={row.l} className="flex justify-between items-start">
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">{row.l}</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] max-w-[200px] text-right">{row.v}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-[#db43ae] rounded-[12px] py-[13px] cursor-pointer hover:opacity-90"
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">Close</p>
        </button>
      </div>
    </div>
  );
}

// ── Action Modal ──────────────────────────────────────────────────────────────
function ActionModal({
  type,
  balance,
  onClose,
  onConfirm,
}: {
  type: ActionModalType;
  balance: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const config: Record<
    NonNullable<ActionModalType>,
    { title: string; btnLabel: string; btnColor: string; presets?: string[] }
  > = {
    topup:    { title: "Top Up Credits",    btnLabel: "Confirm Top Up",    btnColor: "#db43ae", presets: ["50","100","200","500"] },
    pay:      { title: "Pay with Credits",  btnLabel: "Confirm Payment",   btnColor: "#4a90e2" },
    withdraw: { title: "Withdraw Credits",  btnLabel: "Confirm Withdraw",  btnColor: "#47c363" },
  };

  const handleConfirm = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { setError("Please enter a valid amount."); return; }
    if ((type === "pay" || type === "withdraw") && val > balance) { setError("Insufficient balance."); return; }
    setError("");
    setSuccess(true);
    setTimeout(() => { onConfirm(type === "topup" ? val : -val); onClose(); }, 1500);
  };

  if (!type) return null;
  const cfg = config[type];

  if (success) {
    const newBal = type === "topup" ? balance + parseFloat(amount) : balance - parseFloat(amount);
    return (
      <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
        <div className="bg-white rounded-t-[20px] w-full p-[32px] flex flex-col items-center gap-[12px]">
          <div className="size-[60px] bg-[#e8f8f0] rounded-full flex items-center justify-center">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#00b894" />
              <path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">
            {type === "topup" ? `RM ${amount} topped up!` : type === "pay" ? `RM ${amount} paid!` : `RM ${amount} withdrawn!`}
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">
            New balance: RM {newBal.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-[20px] w-full p-[24px]">
        <div className="w-[40px] h-[4px] bg-gray-200 rounded-full mx-auto mb-[20px]" />
        <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15] text-center mb-[8px]">{cfg.title}</p>
        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center mb-[20px]">
          Available Balance: <span className="text-[#1b1c15]">RM {balance.toFixed(2)}</span>
        </p>
        <div className="mb-[16px]">
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] mb-[8px]">Amount (RM)</p>
          <div className="flex items-center border border-gray-200 rounded-[8px] px-[16px] py-[12px]">
            <span className="font-['Poppins:Regular',sans-serif] text-[16px] text-[#92929d] mr-[8px]">RM</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); }}
              placeholder="0.00"
              className="flex-1 font-['Poppins:Regular',sans-serif] text-[16px] text-[#1b1c15] outline-none bg-transparent"
            />
          </div>
          {error && <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#ef4444] mt-[6px]">{error}</p>}
        </div>
        {cfg.presets && (
          <div className="flex gap-[8px] mb-[16px] flex-wrap">
            {cfg.presets.map((val) => (
              <button
                key={val}
                onClick={() => { setAmount(val); setError(""); }}
                className={`px-[16px] py-[6px] rounded-full border cursor-pointer transition-colors ${
                  amount === val ? "border-[#db43ae] bg-[#fdf0fa] text-[#db43ae]" : "border-gray-200 text-[#92929d]"
                }`}
              >
                <p className="font-['Poppins:Regular',sans-serif] text-[13px]">+RM {val}</p>
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-[12px]">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-[8px] py-[14px] cursor-pointer hover:bg-gray-50">
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] text-center">Cancel</p>
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-[8px] py-[14px] cursor-pointer hover:opacity-90"
            style={{ background: cfg.btnColor }}
          >
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">{cfg.btnLabel}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tab Button ────────────────────────────────────────────────────────────────
function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <div className="flex-1 relative min-w-0">
      {isActive && <div aria-hidden="true" className="absolute border-[#db43ae] border-b-2 border-solid inset-0 pointer-events-none" />}
      <button onClick={onClick} className="flex items-center justify-center w-full hover:bg-gray-50 cursor-pointer px-[4px] py-[13px]">
        <p className={`text-[12px] whitespace-nowrap ${isActive ? "font-['Poppins:Bold',sans-serif] text-[#db43ae]" : "font-['Poppins:Regular',sans-serif] text-[#696974]"}`}>
          {label}
        </p>
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function CreditsPage() {
  const { credits, creditsHistory, addCredits, deductCredits } = useAppContext();
  const [activeTab, setActiveTab] = useState<CreditTab>("all");
  const [actionModal, setActionModal] = useState<ActionModalType>(null);
  const [selectedTx, setSelectedTx] = useState<CreditsHistoryEntry | null>(null);

  const filtered =
    activeTab === "all" ? creditsHistory : creditsHistory.filter((item) => item.type === activeTab);

  // Summary stats
  const totalEarned = creditsHistory
    .filter((i) => i.amount > 0 && i.type !== "expired")
    .reduce((s, i) => s + i.amount, 0);
  const totalSpent = creditsHistory
    .filter((i) => i.amount < 0 && i.type === "used")
    .reduce((s, i) => s + Math.abs(i.amount), 0);

  const handleConfirm = (delta: number) => {
    if (delta > 0) {
      addCredits(delta, "Top Up", "Credits top up");
    } else {
      deductCredits(
        Math.abs(delta),
        actionModal === "pay" ? "Payment" : "Withdrawal",
        actionModal === "pay" ? "Payment via credits" : "Credits withdrawal"
      );
    }
  };

  const grouped = groupByDate(filtered);
  const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col" data-name="Credits">
        <AppBar title="Credits" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto mt-[56px]">

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-[#db43ae] to-[#e870cc] px-[20px] pt-[16px] pb-[20px]">
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/80 mb-[2px]">Available Balance</p>
            <p className="font-['Poppins:Bold',sans-serif] text-[34px] text-white leading-none mb-[18px]">
              RM {credits.toFixed(2)}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-[10px]">
              <button
                onClick={() => setActionModal("topup")}
                className="flex-1 bg-white rounded-[12px] py-[11px] flex flex-col items-center gap-[5px] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="size-[28px] bg-[#fdf0fa] rounded-full flex items-center justify-center">
                  <Plus size={14} className="text-[#db43ae]" />
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#db43ae]">Top Up</p>
              </button>
              <button
                onClick={() => setActionModal("pay")}
                className="flex-1 bg-white rounded-[12px] py-[11px] flex flex-col items-center gap-[5px] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="size-[28px] bg-[#eff6ff] rounded-full flex items-center justify-center">
                  <CreditCard size={14} className="text-[#4a90e2]" />
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#4a90e2]">Pay</p>
              </button>
              <button
                onClick={() => setActionModal("withdraw")}
                className="flex-1 bg-white rounded-[12px] py-[11px] flex flex-col items-center gap-[5px] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="size-[28px] bg-[#f0faf4] rounded-full flex items-center justify-center">
                  <ArrowDown size={14} className="text-[#47c363]" />
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#47c363]">Withdraw</p>
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="flex gap-[10px] px-[16px] py-[14px]">
            <div className="flex-1 bg-[rgba(16,185,129,0.07)] rounded-[12px] p-[12px]">
              <div className="flex items-center gap-[6px] mb-[4px]">
                <ArrowDownLeft size={14} className="text-[#10b981]" />
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">Total Earned</p>
              </div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#10b981]">
                RM {totalEarned.toFixed(2)}
              </p>
            </div>
            <div className="flex-1 bg-[rgba(249,115,22,0.07)] rounded-[12px] p-[12px]">
              <div className="flex items-center gap-[6px] mb-[4px]">
                <ArrowUpRight size={14} className="text-[#f97316]" />
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">Total Spent</p>
              </div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#f97316]">
                RM {totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="flex-1 bg-[rgba(219,67,174,0.07)] rounded-[12px] p-[12px]">
              <div className="flex items-center gap-[6px] mb-[4px]">
                <Wallet size={14} className="text-[#db43ae]" />
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">Transactions</p>
              </div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#db43ae]">
                {creditsHistory.length}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#f5f5f5]" />

          {/* Tabs */}
          <div className="flex items-center border-b border-gray-100 bg-white sticky top-0 z-10">
            {(["all", "topup", "earned", "used", "expired"] as CreditTab[]).map((tab) => (
              <TabButton
                key={tab}
                label={tab === "topup" ? "Top Up" : tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>

          {/* Transaction list grouped by date */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[48px] px-[24px]">
              <div className="size-[52px] rounded-full bg-[rgba(219,67,174,0.08)] flex items-center justify-center mb-[12px]">
                <Wallet size={26} className="text-[#db43ae]" />
              </div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15] mb-[4px]">No transactions</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] text-center">
                No credit transactions found for this filter.
              </p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date}>
                {/* Date header */}
                <div className="px-[16px] py-[10px] bg-[#fafafa] border-b border-[#f0f0f0]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#92929d]">
                    {formatDate(date)}
                  </p>
                </div>
                {/* Items */}
                {grouped[date].map((item) => {
                  const cfg = typeConfig[item.type];
                  const isPositive = item.amount > 0;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedTx(item)}
                      className="w-full flex items-center gap-[14px] px-[16px] py-[14px] border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer transition-colors"
                    >
                      <TxIcon type={item.type} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-[6px] mb-[2px]">
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] truncate max-w-[140px]">
                            {item.title}
                          </p>
                          <span className={`px-[6px] py-[1px] rounded-[4px] text-[9px] font-['Poppins:SemiBold',sans-serif] shrink-0 ${cfg.badgeBg}`}>
                            {cfg.badge}
                          </span>
                        </div>
                        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] truncate max-w-[170px]">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className="font-['Poppins:SemiBold',sans-serif] text-[14px]"
                          style={{ color: cfg.amountColor }}
                        >
                          {isPositive ? "+" : ""}RM {Math.abs(item.amount).toFixed(2)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}

          <div className="h-[24px]" />
        </div>

        {/* Gesture bar */}
        <div className="h-[24px] bg-white flex items-center justify-center shrink-0">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>

        {/* Modals */}
        {actionModal && (
          <ActionModal type={actionModal} balance={credits} onClose={() => setActionModal(null)} onConfirm={handleConfirm} />
        )}
        {selectedTx && (
          <TxDetailSheet item={selectedTx} onClose={() => setSelectedTx(null)} />
        )}
      </div>
    </div>
  );
}