import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, HelpCircle, Send, CheckCircle, X, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import type { GiftCardTransaction } from "../context/AppContext";

// ── Card design data ──────────────────────────────────────────────────────────
const CARD_DESIGNS = [
  {
    id: "star",
    label: "You're My Star",
    bg: "linear-gradient(135deg, #db43ae 0%, #9b1f7a 100%)",
    emoji: "✨",
    tagline: "YOU'RE MY STAR",
    sub: "A gift from the heart",
    imgUrl: "https://images.unsplash.com/photo-1617118601021-4992c028fe5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    useImg: false,
  },
  {
    id: "birthday",
    label: "Happy Birthday",
    bg: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    emoji: "🎂",
    tagline: "HAPPY BIRTHDAY!",
    sub: "Wishing you a beautiful day",
    imgUrl: "https://images.unsplash.com/photo-1736959574670-a8ace9856e1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    useImg: true,
  },
  {
    id: "lucky",
    label: "Lucky To Have You",
    bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    emoji: "🍀",
    tagline: "LUCKY TO HAVE YOU",
    sub: "You mean the world to me",
    imgUrl: "https://images.unsplash.com/photo-1630595633877-9918ee257288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    useImg: true,
  },
  {
    id: "love",
    label: "With Love",
    bg: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    emoji: "🌸",
    tagline: "WITH LOVE",
    sub: "A little luxury, just for you",
    imgUrl: "https://images.unsplash.com/photo-1771527537408-537e1105a550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    useImg: true,
  },
];

const AMOUNT_PRESETS = [30, 50, 100, 150, 200, 300];

// ── Gift Card Visual ──────────────────────────────────────────────────────────
function GiftCardVisual({
  design,
  amount,
  large = true,
}: {
  design: (typeof CARD_DESIGNS)[0];
  amount: number | null;
  large?: boolean;
}) {
  const h = large ? "h-[190px]" : "h-[64px]";
  const w = large ? "w-full" : "w-[102px]";
  return (
    <div
      className={`${w} ${h} rounded-[14px] overflow-hidden relative shrink-0`}
      style={{
        background: design.bg,
        boxShadow: large ? "0 8px 32px rgba(0,0,0,0.22)" : "none",
      }}
    >
      {design.useImg && (
        <>
          <ImageWithFallback
            src={design.imgUrl}
            alt={design.label}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/20" />
        </>
      )}
      <div className="absolute -top-[20px] -right-[20px] w-[80px] h-[80px] rounded-full bg-white/10" />
      <div className="absolute -bottom-[30px] -left-[20px] w-[100px] h-[100px] rounded-full bg-white/10" />

      {/* Watermark */}
      <div className="absolute top-[10px] left-[12px] flex items-center gap-[5px]">
        <div className="size-[20px] bg-white/25 rounded-full flex items-center justify-center">
          <svg width="11" height="13" fill="none" viewBox="0 0 18 22">
            <path d="M9 0 C9 0 2 5 2 12 a7 7 0 0 0 14 0 C16 5 9 0 9 0Z" fill="white" opacity="0.9" />
          </svg>
        </div>
        {large && (
          <p className="font-['Poppins:Bold',sans-serif] text-white/90 text-[9px]">Luxe Locks</p>
        )}
      </div>

      {large && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-['Poppins:Bold',sans-serif] text-white text-[26px] leading-[30px] text-center drop-shadow-lg px-[16px]">
            {design.tagline}
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-white/80 text-[12px] mt-[6px]">
            {design.sub}
          </p>
          {amount && (
            <div className="mt-[10px] bg-white/25 rounded-full px-[14px] py-[4px]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-white text-[13px]">
                RM {amount}.00
              </p>
            </div>
          )}
        </div>
      )}

      {!large && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[22px]">{design.emoji}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
    </div>
  );
}

// ── Help Modal ────────────────────────────────────────────────────────────────
function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center px-[24px]">
      <div className="bg-white rounded-[20px] p-[24px] w-full">
        <div className="flex justify-between items-center mb-[16px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">
            How Gift Cards Work
          </p>
          <button onClick={onClose} className="cursor-pointer">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        {[
          {
            icon: "🎁",
            t: "Send a Gift Card",
            d: "Choose a design, set an amount (RM10–RM300), add recipient details and a personal message.",
          },
          {
            icon: "📲",
            t: "Recipient Gets a Code",
            d: "Your recipient receives a unique gift card code via SMS or email.",
          },
          {
            icon: "💳",
            t: "Redeem for Credits",
            d: "Enter the code in the Redeem tab to load the value into the Luxe Locks credits wallet.",
          },
          {
            icon: "✨",
            t: "Credits Never Expire",
            d: "Gift card credits are valid for 24 months from the date of redemption.",
          },
        ].map((item) => (
          <div key={item.t} className="flex items-start gap-[12px] mb-[14px]">
            <span className="text-[24px] shrink-0">{item.icon}</span>
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[2px]">
                {item.t}
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] leading-[18px]">
                {item.d}
              </p>
            </div>
          </div>
        ))}
        <button
          onClick={onClose}
          className="w-full bg-[#db43ae] rounded-[10px] py-[12px] cursor-pointer hover:opacity-90 mt-[4px]"
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">
            Got It!
          </p>
        </button>
      </div>
    </div>
  );
}

// ── Transaction Detail Sheet ──────────────────────────────────────────────────
function TransactionDetail({
  tx,
  onClose,
}: {
  tx: GiftCardTransaction;
  onClose: () => void;
}) {
  const isSent = tx.type === "sent";
  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-[24px] p-[24px]">
        {/* Handle */}
        <div className="w-[40px] h-[4px] bg-[#e0e0e0] rounded-full mx-auto mb-[20px]" />
        {/* Icon */}
        <div
          className="size-[56px] rounded-full flex items-center justify-center mx-auto mb-[14px]"
          style={{
            background: isSent ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
          }}
        >
          {isSent ? (
            <ArrowUpRight size={28} className="text-[#ef4444]" />
          ) : (
            <ArrowDownLeft size={28} className="text-[#10b981]" />
          )}
        </div>
        <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-[#1b1c15] text-center mb-[2px]">
          {isSent ? `−RM ${tx.amount}.00` : `+RM ${tx.amount}.00`}
        </p>
        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center mb-[20px]">
          {isSent ? "Gift Card Sent" : "Gift Card Redeemed"}
        </p>

        {/* Details */}
        <div className="bg-[#fafafa] rounded-[14px] p-[16px] flex flex-col gap-[12px] mb-[20px]">
          {[
            { l: "Type", v: isSent ? "Sent" : "Redeemed" },
            { l: "Design", v: `${tx.designEmoji} ${tx.design}` },
            ...(isSent
              ? [
                  { l: "Recipient", v: tx.recipient ?? "—" },
                  { l: "Message", v: tx.message || "No message" },
                ]
              : [{ l: "Code", v: tx.code ?? "—" }]),
            { l: "Date", v: tx.date },
            { l: "Time", v: tx.time },
          ].map((row) => (
            <div key={row.l} className="flex justify-between items-start">
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">
                {row.l}
              </p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] max-w-[200px] text-right">
                {row.v}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#db43ae] rounded-[12px] py-[13px] cursor-pointer hover:opacity-90"
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">
            Close
          </p>
        </button>
      </div>
    </div>
  );
}

// ── History Tab ───────────────────────────────────────────────────────────────
function HistoryTab() {
  const { giftCardTransactions } = useAppContext();
  const [filter, setFilter] = useState<"all" | "sent" | "redeemed">("all");
  const [selectedTx, setSelectedTx] = useState<GiftCardTransaction | null>(null);

  const filtered =
    filter === "all"
      ? giftCardTransactions
      : giftCardTransactions.filter((t) => t.type === filter);

  // Group by date
  const groups = filtered.reduce<Record<string, GiftCardTransaction[]>>((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-MY", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Summary strip */}
        <div className="flex gap-[10px] px-[20px] pt-[16px] pb-[14px]">
          <div className="flex-1 bg-[rgba(239,68,68,0.07)] rounded-[12px] p-[12px]">
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[2px]">Total Sent</p>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#ef4444]">
              RM{" "}
              {giftCardTransactions
                .filter((t) => t.type === "sent")
                .reduce((s, t) => s + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="flex-1 bg-[rgba(16,185,129,0.07)] rounded-[12px] p-[12px]">
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[2px]">Total Redeemed</p>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#10b981]">
              RM{" "}
              {giftCardTransactions
                .filter((t) => t.type === "redeemed")
                .reduce((s, t) => s + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="flex-1 bg-[rgba(219,67,174,0.07)] rounded-[12px] p-[12px]">
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[2px]">Transactions</p>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#db43ae]">
              {giftCardTransactions.length}
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-[8px] px-[20px] pb-[14px]">
          {(["all", "sent", "redeemed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-[14px] py-[6px] rounded-full border cursor-pointer transition-all"
              style={{
                background: filter === f ? "#db43ae" : "white",
                borderColor: filter === f ? "#db43ae" : "#e0e0e0",
              }}
            >
              <p
                className="font-['Poppins:SemiBold',sans-serif] text-[12px] capitalize"
                style={{ color: filter === f ? "white" : "#92929d" }}
              >
                {f === "all" ? "All" : f === "sent" ? "Sent" : "Redeemed"}
              </p>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#f0f0f0] mx-[20px] mb-[4px]" />

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[48px] px-[24px]">
            <div className="size-[56px] rounded-full bg-[rgba(219,67,174,0.08)] flex items-center justify-center mb-[12px]">
              <Clock size={28} className="text-[#db43ae]" />
            </div>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15] mb-[6px]">
              No transactions yet
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] text-center">
              Send or redeem a gift card to see your history here.
            </p>
          </div>
        ) : (
          Object.keys(groups)
            .sort((a, b) => (a < b ? 1 : -1))
            .map((date) => (
              <div key={date}>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#92929d] px-[20px] py-[10px] bg-[#fafafa]">
                  {formatDate(date)}
                </p>
                {groups[date].map((tx) => {
                  const isSent = tx.type === "sent";
                  return (
                    <button
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="w-full flex items-center gap-[14px] px-[20px] py-[14px] border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer transition-colors"
                    >
                      {/* Icon */}
                      <div
                        className="size-[44px] rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: isSent
                            ? "rgba(239,68,68,0.1)"
                            : "rgba(16,185,129,0.1)",
                        }}
                      >
                        {isSent ? (
                          <ArrowUpRight size={22} className="text-[#ef4444]" />
                        ) : (
                          <ArrowDownLeft size={22} className="text-[#10b981]" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 text-left">
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">
                          {isSent ? "Gift Card Sent" : "Gift Card Redeemed"}
                        </p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mt-[2px]">
                          {isSent
                            ? `To: ${tx.recipient ?? "—"} • ${tx.designEmoji} ${tx.design}`
                            : `Code: ${tx.code ?? "—"} • ${tx.designEmoji} ${tx.design}`}
                        </p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#b0b0b0] mt-[2px]">
                          {tx.time}
                        </p>
                      </div>

                      {/* Amount */}
                      <p
                        className="font-['Poppins:SemiBold',sans-serif] text-[14px] shrink-0"
                        style={{ color: isSent ? "#ef4444" : "#10b981" }}
                      >
                        {isSent ? "−" : "+"}RM {tx.amount}.00
                      </p>
                    </button>
                  );
                })}
              </div>
            ))
        )}
        <div className="h-[24px]" />
      </div>

      {/* Detail sheet */}
      {selectedTx && (
        <TransactionDetail tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </>
  );
}

// ── Send Flow ─────────────────────────────────────────────────────────────────
function SendTab({ onSwitchHistory }: { onSwitchHistory: () => void }) {
  const { sendGiftCard } = useAppContext();
  const [selectedDesign, setSelectedDesign] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [error, setError] = useState("");

  const design = CARD_DESIGNS[selectedDesign];
  const amount = selectedPreset ?? (customAmount ? parseInt(customAmount) : null);

  const validate = () => {
    if (!amount || amount < 10 || amount > 300) {
      setError("Please enter an amount between RM10 and RM300.");
      return false;
    }
    if (!recipient.trim()) {
      setError("Please enter a recipient phone number or email.");
      return false;
    }
    setError("");
    return true;
  };

  const handleConfirmSend = () => {
    if (amount) {
      sendGiftCard(design.label, design.emoji, amount, recipient, message);
    }
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center px-[24px] py-[40px] text-center">
        <div className="size-[80px] rounded-full bg-[rgba(219,67,174,0.12)] flex items-center justify-center mb-[20px]">
          <CheckCircle size={44} className="text-[#db43ae]" />
        </div>
        <p className="font-['Poppins:Bold',sans-serif] text-[22px] text-[#1b1c15] mb-[8px]">
          Gift Card Sent! 🎉
        </p>
        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] mb-[6px]">
          Your RM {amount}.00 gift card has been sent to
        </p>
        <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#db43ae] mb-[28px]">
          {recipient}
        </p>
        <div className="w-full mb-[24px]">
          <GiftCardVisual design={design} amount={amount} large={true} />
        </div>
        <div className="flex gap-[10px] w-full">
          <button
            onClick={() => {
              setStep("form");
              setRecipient("");
              setMessage("");
              setSelectedPreset(null);
              setCustomAmount("");
            }}
            className="flex-1 border border-[#e0e0e0] rounded-[12px] py-[13px] cursor-pointer hover:bg-gray-50"
          >
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] text-center">
              Send Another
            </p>
          </button>
          <button
            onClick={onSwitchHistory}
            className="flex-1 bg-[#db43ae] rounded-[12px] py-[13px] cursor-pointer hover:opacity-90"
          >
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">
              View History
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="flex flex-col px-[20px] py-[20px] gap-[16px]">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">
          Review & Confirm
        </p>
        <GiftCardVisual design={design} amount={amount} large={true} />
        <div className="bg-[#fafafa] rounded-[12px] p-[16px] flex flex-col gap-[10px]">
          {[
            { l: "Design", v: `${design.emoji} ${design.label}` },
            { l: "Amount", v: `RM ${amount}.00` },
            { l: "Recipient", v: recipient },
            { l: "Message", v: message || "—" },
          ].map((r) => (
            <div key={r.l} className="flex justify-between">
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">
                {r.l}
              </p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] max-w-[180px] text-right truncate">
                {r.v}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-[10px]">
          <button
            onClick={() => setStep("form")}
            className="flex-1 border border-[#e0e0e0] rounded-[12px] py-[13px] cursor-pointer hover:bg-gray-50"
          >
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] text-center">
              Edit
            </p>
          </button>
          <button
            onClick={handleConfirmSend}
            className="flex-1 bg-[#db43ae] rounded-[12px] py-[13px] cursor-pointer hover:opacity-90 flex items-center justify-center gap-[8px]"
          >
            <Send size={16} className="text-white" />
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
              Confirm & Send
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Large card preview */}
      <div className="px-[20px] pt-[16px] pb-[14px]">
        <GiftCardVisual
          design={design}
          amount={selectedPreset ?? (customAmount ? parseInt(customAmount) : null)}
          large={true}
        />
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-[10px] px-[20px] pb-[16px] overflow-x-auto scrollbar-hide">
        {CARD_DESIGNS.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setSelectedDesign(i)}
            className="shrink-0 cursor-pointer"
            style={{
              borderRadius: 10,
              padding: 2,
              border:
                selectedDesign === i
                  ? "2.5px solid #db43ae"
                  : "2.5px solid transparent",
            }}
          >
            <GiftCardVisual design={d} amount={null} large={false} />
          </button>
        ))}
      </div>

      <div className="h-[8px] bg-[#f5f5f5]" />

      {/* Gift Amount */}
      <div className="px-[20px] pt-[16px] pb-[14px]">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15] mb-[4px]">
          Gift Amount
        </p>
        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[12px]">
          Enter the whole amount between RM10 and RM300
        </p>
        <div className="grid grid-cols-3 gap-[8px] mb-[12px]">
          {AMOUNT_PRESETS.map((a) => (
            <button
              key={a}
              onClick={() => {
                setSelectedPreset(a === selectedPreset ? null : a);
                setCustomAmount("");
              }}
              className="py-[10px] rounded-[10px] border cursor-pointer transition-all"
              style={{
                background: selectedPreset === a ? "#db43ae" : "white",
                borderColor: selectedPreset === a ? "#db43ae" : "#e0e0e0",
              }}
            >
              <p
                className="font-['Poppins:SemiBold',sans-serif] text-[14px]"
                style={{ color: selectedPreset === a ? "white" : "#1b1c15" }}
              >
                RM {a}
              </p>
            </button>
          ))}
        </div>
        <div
          className="flex items-center gap-[10px] border rounded-[10px] px-[14px] py-[12px]"
          style={{ borderColor: customAmount ? "#db43ae" : "#e0e0e0" }}
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#92929d]">
            RM
          </p>
          <input
            type="number"
            min={10}
            max={300}
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedPreset(null);
            }}
            className="flex-1 outline-none font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] bg-transparent"
          />
        </div>
      </div>

      <div className="h-[8px] bg-[#f5f5f5]" />

      {/* Recipient */}
      <div className="px-[20px] pt-[16px] pb-[14px]">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15] mb-[4px]">
          Send To
        </p>
        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[10px]">
          Enter recipient's phone number or email
        </p>
        <input
          type="text"
          placeholder="+60 12-345 6789 or email@example.com"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full border rounded-[10px] px-[14px] py-[12px] outline-none font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]"
          style={{ borderColor: recipient ? "#db43ae" : "#e0e0e0" }}
        />
      </div>

      {/* Personal Message */}
      <div className="px-[20px] pb-[16px]">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15] mb-[10px]">
          Personal Message{" "}
          <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b0b0b0]">
            (optional)
          </span>
        </p>
        <textarea
          placeholder="Write a heartfelt message..."
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={150}
          className="w-full border rounded-[10px] px-[14px] py-[12px] outline-none font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15] resize-none"
          style={{ borderColor: message ? "#db43ae" : "#e0e0e0" }}
        />
        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#b0b0b0] text-right mt-[4px]">
          {message.length}/150
        </p>
      </div>

      {error && (
        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#ef4444] px-[20px] mb-[10px]">
          {error}
        </p>
      )}

      <div className="px-[20px] pb-[24px]">
        <button
          onClick={() => {
            if (validate()) setStep("confirm");
          }}
          className="w-full bg-[#db43ae] rounded-[12px] py-[14px] cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-[8px]"
        >
          <Send size={18} className="text-white" />
          <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
            Continue
          </p>
        </button>
      </div>
    </div>
  );
}

// ── Redeem Flow ───────────────────────────────────────────────────────────────
function RedeemTab({ onSwitchHistory }: { onSwitchHistory: () => void }) {
  const { addCredits, redeemGiftCard } = useAppContext();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [redeemedAmount, setRedeemedAmount] = useState(0);

  const VALID_CODES: Record<string, number> = {
    "LUXE-GIFT-0050": 50,
    "LUXE-GIFT-0100": 100,
    "LUXE-GIFT-0030": 30,
    LUXE30: 30,
    LUXE50: 50,
    LUXE100: 100,
  };

  const handleRedeem = () => {
    const cleaned = code.toUpperCase().trim();
    if (!cleaned) return;
    setStatus("loading");
    setTimeout(() => {
      const amount = VALID_CODES[cleaned];
      if (amount) {
        setRedeemedAmount(amount);
        addCredits(amount, "Gift Card Redeemed", `Gift card code ${cleaned} redeemed for RM ${amount}.00 credits`);
        redeemGiftCard(cleaned, amount);
        setStatus("success");
      } else {
        setStatus("error");
      }
    }, 1200);
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center px-[24px] py-[48px] text-center">
        <div className="size-[90px] rounded-full bg-[rgba(219,67,174,0.12)] flex items-center justify-center mb-[20px]">
          <CheckCircle size={50} className="text-[#db43ae]" />
        </div>
        <p className="font-['Poppins:Bold',sans-serif] text-[22px] text-[#1b1c15] mb-[8px]">
          Credits Added! 🎉
        </p>
        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] mb-[6px]">
          Your credits wallet has been topped up
        </p>
        <div className="bg-[rgba(219,67,174,0.08)] rounded-[16px] px-[32px] py-[20px] my-[16px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[36px] text-[#db43ae]">
            +RM {redeemedAmount}.00
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mt-[4px]">
            Added to your Credits wallet
          </p>
        </div>
        <div className="flex gap-[10px] w-full mt-[8px]">
          <button
            onClick={() => { setStatus("idle"); setCode(""); }}
            className="flex-1 border border-[#e0e0e0] rounded-[12px] py-[13px] cursor-pointer hover:bg-gray-50"
          >
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] text-center">
              Redeem Another
            </p>
          </button>
          <button
            onClick={onSwitchHistory}
            className="flex-1 bg-[#db43ae] rounded-[12px] py-[13px] cursor-pointer hover:opacity-90"
          >
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">
              View History
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-[20px] py-[24px]">
      <div className="bg-[rgba(219,67,174,0.07)] border border-[rgba(219,67,174,0.2)] rounded-[14px] p-[16px] mb-[28px] flex items-start gap-[12px]">
        <span className="text-[28px] shrink-0">🎁</span>
        <div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15] mb-[4px]">
            Redeem a Gift Card
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] leading-[18px]">
            Enter your gift card code below to load the credit value into your Luxe Locks wallet.
          </p>
        </div>
      </div>

      <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15] mb-[8px]">
        Gift Card Code
      </p>
      <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[10px]">
        Enter the code exactly as provided (e.g. LUXE-GIFT-0050)
      </p>

      <input
        type="text"
        placeholder="LUXE-GIFT-XXXX"
        value={code}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase());
          setStatus("idle");
        }}
        className="w-full border rounded-[10px] px-[16px] py-[14px] outline-none font-['Poppins:SemiBold',sans-serif] text-[15px] text-center tracking-[2px] mb-[10px]"
        style={{
          borderColor: status === "error" ? "#ef4444" : code ? "#db43ae" : "#e0e0e0",
          color: status === "error" ? "#ef4444" : "#1b1c15",
        }}
      />

      {status === "error" && (
        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#ef4444] text-center mb-[12px]">
          Invalid or already redeemed gift card code. Please try again.
        </p>
      )}

      <button
        onClick={handleRedeem}
        disabled={!code.trim() || status === "loading"}
        className="w-full bg-[#db43ae] rounded-[12px] py-[14px] cursor-pointer hover:opacity-90 transition-opacity mt-[6px] disabled:opacity-40"
      >
        <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
          {status === "loading" ? "Verifying..." : "Redeem Now"}
        </p>
      </button>

      <div className="mt-[28px] p-[14px] bg-[#fafafa] rounded-[12px] border border-[#f0f0f0]">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#92929d] mb-[6px]">
          Demo codes you can try:
        </p>
        {["LUXE30 → RM 30", "LUXE50 → RM 50", "LUXE100 → RM 100"].map((c) => (
          <p
            key={c}
            className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b0b0b0] mb-[2px]"
          >
            • {c}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function GiftCardPage() {
  const navigate = useNavigate();
  const { giftCardTransactions } = useAppContext();
  const [activeTab, setActiveTab] = useState<"send" | "redeem" | "history">("send");
  const [showHelp, setShowHelp] = useState(false);

  const TABS = [
    { id: "send" as const, label: "Send" },
    { id: "redeem" as const, label: "Redeem" },
    { id: "history" as const, label: `History (${giftCardTransactions.length})` },
  ];

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-[16px] pt-[12px] pb-[12px] border-b border-[#f0f0f0]">
          <button
            onClick={() => navigate("/me")}
            className="cursor-pointer hover:opacity-70 p-[4px]"
          >
            <ChevronLeft size={24} className="text-[#1b1c15]" />
          </button>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">
            Gift Cards
          </p>
          <button
            onClick={() => setShowHelp(true)}
            className="cursor-pointer hover:opacity-70 size-[32px] rounded-full border border-[#e0e0e0] flex items-center justify-center"
          >
            <HelpCircle size={18} className="text-[#92929d]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 border-b border-[#f0f0f0]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-[13px] cursor-pointer relative transition-colors"
            >
              <p
                className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-center transition-colors"
                style={{ color: activeTab === tab.id ? "#db43ae" : "#92929d" }}
              >
                {tab.label}
              </p>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-[8px] right-[8px] h-[2.5px] bg-[#db43ae] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "send" && (
            <SendTab onSwitchHistory={() => setActiveTab("history")} />
          )}
          {activeTab === "redeem" && (
            <RedeemTab onSwitchHistory={() => setActiveTab("history")} />
          )}
          {activeTab === "history" && <HistoryTab />}
        </div>

        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

        {/* Gesture bar */}
        <div className="absolute bottom-[6px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}