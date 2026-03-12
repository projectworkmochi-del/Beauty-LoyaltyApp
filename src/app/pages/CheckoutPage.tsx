import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, MapPin, Plus, Check } from "lucide-react";
import imgProduct from "figma:asset/9d6accb511ecb75e972b489726907e765cb42944.png";

// ── Shared components ──────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="h-[40px] shrink-0 flex items-center justify-between px-[16px] bg-white">
      <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)]">12:30</p>
      <div className="flex gap-[6px] items-center">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 9h2v3H1zM4.5 6h2v6h-2zM8 3h2v9H8zM11.5 0h2v12h-2zM15 1.5h2v10.5h-2z" fill="black" fillOpacity="0.9"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.4C5.6 2.4 3.5 3.4 2 5L0 3C2 1.1 4.8 0 8 0s6 1.1 8 3l-2 2C12.5 3.4 10.4 2.4 8 2.4zM8 6.8c-1.4 0-2.6.5-3.5 1.4L3 6.8C4.3 5.7 6.1 5 8 5s3.7.7 5 1.8l-1.5 1.4C10.6 7.3 9.4 6.8 8 6.8zM8 10l-2-2c.5-.5 1.2-.8 2-.8s1.5.3 2 .8L8 10z" fill="black" fillOpacity="0.9"/></svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="0" y="1" width="20" height="10" rx="2" stroke="black" strokeOpacity="0.35" strokeWidth="1"/><rect x="1" y="2" width="16" height="8" rx="1" fill="black" fillOpacity="0.9"/><path d="M21 4v4a2 2 0 0 0 0-4z" fill="black" fillOpacity="0.4"/></svg>
      </div>
    </div>
  );
}

// Circular step indicator matching Figma exactly
function CircularStep({ current, total }: { current: number; total: number }) {
  const radius = 34;
  const stroke = 4;
  const normalizedR = radius - stroke;
  const circumference = normalizedR * 2 * Math.PI;
  const progress = current / total;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative size-[72px] shrink-0">
      <svg width="72" height="72" viewBox="0 0 72 72" className="rotate-[-90deg]">
        <circle cx="36" cy="36" r={normalizedR} fill="none" stroke="#E2E2EA" strokeWidth={stroke} />
        <circle
          cx="36" cy="36" r={normalizedR}
          fill="none"
          stroke="#3DD598"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-[#3DD598]">
          {current} of {total}
        </p>
      </div>
    </div>
  );
}

// Top pink header
function Header({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-[#db43ae] h-[56px] flex items-center px-[8px] shadow-[0px_3px_25px_0px_rgba(0,0,0,0.14)] shrink-0">
      <button
        onClick={onBack}
        className="size-[40px] flex items-center justify-center rounded-full hover:bg-white/20 cursor-pointer transition-colors"
      >
        <ChevronLeft size={22} className="text-white" />
      </button>
      <p className="flex-1 font-['Poppins:SemiBold',sans-serif] text-[16px] text-white text-center">Checkout</p>
      <div className="size-[40px]" />
    </div>
  );
}

// Progress line
function ProgressLine({ step }: { step: number }) {
  const pct = (step / 4) * 100;
  return (
    <div className="h-[2px] shrink-0 bg-[#e2e2ea] relative">
      <div
        className="absolute top-0 left-0 h-full bg-[#db43ae] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.14)] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// Product thumbnail
function ProductThumb() {
  return (
    <div className="rounded-[10px] size-[40px] overflow-hidden shrink-0 bg-gray-100">
      <img src={imgProduct} alt="product" className="w-full h-full object-cover" />
    </div>
  );
}

// Product row
function ProductRow() {
  return (
    <div className="flex items-center gap-[12px]">
      <ProductThumb />
      <div className="flex-1 min-w-0">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#171725] truncate">Hair Wash &amp; Blow Dry</p>
        <div className="flex items-center justify-between mt-[2px]">
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-[rgba(60,60,67,0.6)]">RM 17.80</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#212529]">Qty: 1</p>
        </div>
      </div>
    </div>
  );
}

// Pickup / Delivery mode buttons
function DeliveryModeSelector({
  mode,
  onChange,
}: {
  mode: "pickup" | "delivery";
  onChange: (m: "pickup" | "delivery") => void;
}) {
  return (
    <div className="flex gap-[10px]">
      {/* Pick Up */}
      <button
        onClick={() => onChange("pickup")}
        className="flex-1 flex flex-col items-center gap-[10px] py-[20px] px-[10px] rounded-[8px] border cursor-pointer transition-all"
        style={{ borderColor: mode === "pickup" ? "#1b1c15" : "#d9d9d9", borderWidth: mode === "pickup" ? "2px" : "1px" }}
      >
        <p className="font-['Poppins:Bold',sans-serif] text-[15px] text-black">Pick Up</p>
        {/* Box icon */}
        <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
          <path d="M45 16.875L27 6.75L9 16.875V37.125L27 47.25L45 37.125V16.875Z" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 16.875L27 27L45 16.875" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M27 47.25V27" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 11.8125L36 21.9375" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 21.9375L18 32.0625" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* Delivery */}
      <button
        onClick={() => onChange("delivery")}
        className="flex-1 flex flex-col items-center gap-[10px] py-[20px] px-[10px] rounded-[8px] border cursor-pointer transition-all"
        style={{ borderColor: mode === "delivery" ? "#1b1c15" : "#d9d9d9", borderWidth: mode === "delivery" ? "2px" : "1px" }}
      >
        <p className="font-['Poppins:Bold',sans-serif] text-[15px] text-black">Delivery</p>
        {/* Truck icon */}
        <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
          <path d="M36 9H4.5v27h31.5V9z" fill="black"/>
          <path d="M36 18h9l6.75 9V36h-15.75V18z" fill="black"/>
          <circle cx="12.375" cy="38.25" r="4.5" fill="black"/>
          <circle cx="40.5" cy="38.25" r="4.5" fill="black"/>
          <path d="M0 22.5h7.875" stroke="white" strokeWidth="2.25" strokeLinecap="round"/>
          <path d="M0 29.25h5.625" stroke="white" strokeWidth="2.25" strokeLinecap="round"/>
          <path d="M0 15.75h9" stroke="white" strokeWidth="2.25" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// Location pin icon
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 1.5C6.1 1.5 3.75 3.85 3.75 6.75c0 4.22 5.25 9.75 5.25 9.75s5.25-5.53 5.25-9.75C14.25 3.85 11.9 1.5 9 1.5zm0 7.125a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z" fill="#1B1C15"/>
    </svg>
  );
}

// Radio circle
function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className="size-[20px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all"
      style={{ borderColor: selected ? "#1b1c15" : "#b5b5be" }}
    >
      {selected && <div className="size-[10px] rounded-full bg-[#1b1c15]" />}
    </div>
  );
}

// Branch row for pickup
const PICKUP_BRANCHES = [
  { id: "kuchai", name: "Kuchai Lama Branch", address: "1-4 & 1-3, Jalan Kuchai Maju 11, Kuchai Entrepreneurs Park, Off Jalan Kuchai Lama, 58200 Kuala Lumpur" },
  { id: "johor", name: "Johor Branch", address: "1-4 & 1-3, Jalan Kuchai Maju 11, Kuchai Entrepreneurs Park, Off Jalan Kuchai Lama, 58200 Kuala Lumpur" },
  { id: "petaling", name: "Sri Petaling Branch", address: "1-4 & 1-3, Jalan Kuchai Maju 11, Kuchai Entrepreneurs Park, Off Jalan Kuchai Lama, 58200 Kuala Lumpur" },
];

// Voucher code state type
type VoucherState = "none" | "applied";

// Payment methods
const PAYMENT_METHODS = [
  { id: "wallet", label: "Beauty Wallet", sub: null, hasTopUp: true },
  { id: "card", label: "Credit / Debit Card", sub: null, hasTopUp: false },
  { id: "ewallet", label: "E-Wallet", sub: null, hasTopUp: false },
  { id: "banking", label: "Online Banking", sub: null, hasTopUp: false },
  { id: "grab", label: "Grab Pay", sub: null, hasTopUp: false },
  { id: "counter", label: "Pay at Counter", sub: null, hasTopUp: false },
];

// ── Main component ──────────���─────────────────────────────────────────────────
export function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 2
  const [deliveryMode, setDeliveryMode] = useState<"pickup" | "delivery">("pickup");
  const [selectedBranch, setSelectedBranch] = useState<string>("kuchai");
  const [deliveryAddress] = useState("Wisma ABC");

  // Step 3
  const [points, setPoints] = useState(10);
  const [voucher, setVoucher] = useState<VoucherState>("none");
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherInput, setVoucherInput] = useState("");

  // Step 4
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [ordered, setOrdered] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [walletBalance, setWalletBalance] = useState(25.50);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const basePrice = 17.80;
  const voucherDiscount = voucher === "applied" ? 0.90 : 0;
  const total = basePrice - voucherDiscount;

  const goBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const goNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      setOrdered(true);
      setTimeout(() => navigate("/shop"), 2200);
    }
  };

  // Step labels / CTA labels
  const STEP_TITLES = ["Check Out", "Arrange Delivery", "Order Summary", "Make Payment"];
  const STEP_SUBS = ["Next: Arrange Delivery", "Next: Order Summary", "Next: Make Payment", ""];
  const CTA_LABELS: Record<number, string> = {
    1: "Choose Delivery",
    2: "Order Summary",
    3: "Make Payment",
    4: "Checkout",
  };

  // ── Order success ────────────────────────────────────────────────────────────
  if (ordered) {
    return (
      <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
        <div className="bg-white w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl flex flex-col items-center justify-center gap-[20px] px-[32px]">
          <div className="size-[80px] rounded-full bg-[#e8f8f0] flex items-center justify-center">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#00b894"/>
              <path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-['Poppins:Bold',sans-serif] text-[22px] text-[#1b1c15] text-center">Order Placed!</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center">
            Your order has been placed successfully. You'll receive a confirmation shortly.
          </p>
          <div className="w-[60px] h-[4px] bg-[#db43ae] rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">
        <StatusBar />
        <Header onBack={goBack} />
        <ProgressLine step={step} />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-[90px]">

          {/* ── Step header (circular + title) ───────────────────────────────── */}
          <div className="flex items-center gap-[10px] px-[10px] pt-[10px] pb-[6px]">
            <CircularStep current={step} total={4} />
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#1d1b20] leading-[26px]">
                {STEP_TITLES[step - 1]}
              </p>
              {STEP_SUBS[step - 1] && (
                <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-[#1d1b20] opacity-70 mt-[2px]">
                  {STEP_SUBS[step - 1]}
                </p>
              )}
            </div>
          </div>

          <div className="px-[10px] flex flex-col gap-[10px]">

            {/* ── STEP 1: Check Out ─────────────────────────────────────────── */}
            {step === 1 && (
              <div className="border border-[#d9d9d9] rounded-[8px] p-[10px]">
                <p className="font-['Poppins:Bold',sans-serif] text-[15px] text-black mb-[10px]">
                  Product (1)
                </p>
                <ProductRow />
                <div className="h-[1px] bg-[rgba(0,0,0,0.08)] mt-[10px]" />
              </div>
            )}

            {/* ── STEP 2: Arrange Delivery ──────────────────────────────────── */}
            {step === 2 && (
              <>
                <DeliveryModeSelector mode={deliveryMode} onChange={setDeliveryMode} />

                {deliveryMode === "pickup" ? (
                  <div>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[8px]">
                      PickUp Location
                    </p>
                    <div className="flex flex-col gap-[12px] py-[4px]">
                      {PICKUP_BRANCHES.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBranch(b.id)}
                          className="w-full bg-white rounded-[4px] border p-[12px] flex items-start gap-[8px] cursor-pointer transition-all text-left"
                          style={{ borderColor: selectedBranch === b.id ? "#1b1c15" : "#ececec", borderWidth: selectedBranch === b.id ? "2px" : "1px" }}
                        >
                          <div className="flex-1 flex flex-col gap-[6px]">
                            <div className="flex items-center gap-[4px]">
                              <PinIcon />
                              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#1b1c15]">{b.name}</p>
                            </div>
                            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] leading-[18px]">{b.address}</p>
                          </div>
                          <RadioCircle selected={selectedBranch === b.id} />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[8px]">
                      Delivery Address
                    </p>
                    <div className="flex flex-col gap-[12px] py-[4px]">
                      {/* Saved address */}
                      <div className="bg-white rounded-[4px] border border-[#ececec] p-[12px] flex items-start gap-[8px]">
                        <div className="flex-1 flex flex-col gap-[6px]">
                          <div className="flex items-center gap-[4px]">
                            <PinIcon />
                            <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#1b1c15]">{deliveryAddress}</p>
                          </div>
                          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] leading-[18px]">
                            1-4 & 1-3, Jalan Kuchai Maju 11, Kuchai Entrepreneurs Park, Off Jalan Kuchai Lama, 58200 Kuala Lumpur
                          </p>
                        </div>
                        <RadioCircle selected={false} />
                      </div>
                      {/* Add address */}
                      <button className="bg-white rounded-[4px] border border-[#ececec] p-[12px] flex items-center gap-[4px] cursor-pointer hover:bg-gray-50 transition-colors w-full">
                        <Plus size={16} className="text-[#171725]" />
                        <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#1b1c15]">Add Another Address</p>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── STEP 3: Order Summary ─────────────────────────────────────── */}
            {step === 3 && (
              <>
                {/* Branch summary row */}
                <div className="bg-white rounded-[4px] p-[12px]">
                  <div className="flex items-center gap-[4px] mb-[6px]">
                    <PinIcon />
                    <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#1b1c15] flex-1">
                      {deliveryMode === "pickup"
                        ? PICKUP_BRANCHES.find((b) => b.id === selectedBranch)?.name
                        : deliveryAddress}
                    </p>
                    <div className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-[rgba(219,67,174,0.1)]">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">
                        {deliveryMode === "pickup" ? "Pick Up" : "Delivery"}
                      </p>
                    </div>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] leading-[18px]">
                    {deliveryMode === "pickup"
                      ? "1-4 & 1-3, Jalan Kuchai Maju 11, Kuchai Entrepreneurs Park, Off Jalan Kuchai Lama, 58200 Kuala Lumpur"
                      : "1-4 & 1-3, Jalan Kuchai Maju 11, Kuchai Entrepreneurs Park, Off Jalan Kuchai Lama, 58200 Kuala Lumpur"}
                  </p>
                </div>

                {/* Product */}
                <div className="border border-[#d9d9d9] rounded-[8px] p-[10px]">
                  <p className="font-['Poppins:Bold',sans-serif] text-[15px] text-black mb-[10px]">Product (1)</p>
                  <ProductRow />
                  <div className="h-[1px] bg-[rgba(0,0,0,0.08)] mt-[10px]" />
                </div>

                {/* Point Redemption */}
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#212529]">Point Redemption</p>
                <div className="bg-white border border-[#eee] rounded-[4px] px-[13px] py-[10px] relative">
                  <p className="font-['Poppins:Regular',sans-serif] text-[13.6px] text-[#6c757d] mb-[6px]">Use points</p>
                  <button
                    onClick={() => setPoints((p) => p + 10)}
                    className="absolute right-[13px] top-[12px] size-[26px] rounded-[13px] bg-[rgba(219,67,174,0.1)] flex items-center justify-center cursor-pointer hover:bg-[rgba(219,67,174,0.2)] transition-colors"
                  >
                    <Plus size={14} className="text-[#db43ae]" />
                  </button>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#212529]">{points} pts</p>
                </div>

                {/* Voucher Redemption */}
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Voucher Redemption</p>
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className="bg-white border border-[#eee] rounded-[4px] h-[44px] flex items-center px-[12px] relative w-full cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="size-[28px] rounded-full bg-[#db43ae] flex items-center justify-center shrink-0 mr-[10px]">
                    {/* ticket icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M14.67 6.67A1.33 1.33 0 0 0 16 5.33V2.67A1.33 1.33 0 0 0 14.67 1.33H1.33A1.33 1.33 0 0 0 0 2.67v2.67a1.33 1.33 0 0 0 1.33 1.33A1.33 1.33 0 0 1 2.67 8a1.33 1.33 0 0 1-1.34 1.33A1.33 1.33 0 0 0 0 10.67v2.66A1.33 1.33 0 0 0 1.33 14.67h13.34A1.33 1.33 0 0 0 16 13.33v-2.66a1.33 1.33 0 0 0-1.33-1.34A1.33 1.33 0 0 1 13.33 8a1.33 1.33 0 0 1 1.34-1.33z" fill="white"/>
                    </svg>
                  </div>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">Voucher</p>
                  {voucher === "applied" ? (
                    <span className="ml-auto font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae] bg-[rgba(219,67,174,0.1)] px-[8px] py-[2px] rounded-full">MF923320011</span>
                  ) : (
                    <span className="ml-auto font-['Poppins:Regular',sans-serif] text-[14px] text-[#979aa3]">Select or enter</span>
                  )}
                  <ChevronRight size={14} className="text-[#979aa3] ml-[4px]" />
                </button>
              </>
            )}

            {/* ── STEP 4: Make Payment ──────────────────────────────────────── */}
            {step === 4 && (
              <>
                <div>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[4px]">Payment Options</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[10px]">Choose your payment method</p>

                  <div className="flex flex-col">
                    {PAYMENT_METHODS.map((pm) => (
                      <div
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className="flex items-center justify-between py-[14px] border-b border-[#f0f0f0] cursor-pointer w-full text-left hover:bg-gray-50 transition-colors px-[4px]"
                      >
                        <div className="flex flex-col">
                          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#212529]">{pm.label}</p>
                          {pm.id === "wallet" ? (
                            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#db43ae]">RM {walletBalance.toFixed(2)}</p>
                          ) : pm.sub ? (
                            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#db43ae]">{pm.sub}</p>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-[8px]">
                          {pm.hasTopUp && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowTopUp(true); }}
                              className="flex items-center gap-[4px] border border-[#db43ae] rounded-full px-[10px] py-[3px] cursor-pointer hover:bg-[#fdf0fa] transition-colors"
                            >
                              <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">Top Up</p>
                              <ChevronRight size={12} className="text-[#db43ae]" />
                            </button>
                          )}
                          <div
                            className="size-[20px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all"
                            style={{ borderColor: paymentMethod === pm.id ? "#1b1c15" : "#b5b5be" }}
                          >
                            {paymentMethod === pm.id && <div className="size-[10px] rounded-full bg-[#1b1c15]" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-[#f5f5f5] rounded-[8px] p-[14px] mt-[6px]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15] mb-[10px]">Payment Details</p>
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex items-center justify-between">
                      <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#212529]">Amount (Incl. 6% SST)</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#212529]">RM {basePrice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#212529]">Voucher</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[voucher === 'applied' ? '#db43ae' : '#92929d']">
                        {voucher === "applied" ? `- RM ${voucherDiscount.toFixed(2)}` : "RM 0.00"}
                      </p>
                    </div>
                    <div className="h-[1px] bg-[#e0e0e0]" />
                    <div className="flex items-center justify-between">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">Total</p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">RM {total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* ── Fixed bottom bar ─────────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0]">
          <div className="h-[4px] bg-gradient-to-t from-[rgba(0,0,0,0.05)] to-transparent" />
          <div className="h-[64px] flex items-center justify-between px-[16px]">
            <div>
              <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-[#212529]">
                RM {total.toFixed(2)}
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">for 1 Product</p>
            </div>
            <button
              onClick={goNext}
              className="h-[36px] bg-[#db43ae] rounded-[4px] px-[20px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white whitespace-nowrap">
                {CTA_LABELS[step]}
              </p>
            </button>
          </div>
        </div>

        {/* Gesture bar */}
        <div className="absolute bottom-[6px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>

        {/* ── Voucher modal ──────────────────────────────────────────────── */}
        {showVoucherModal && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-[24px] px-[20px] pt-[20px] pb-[36px]">
              <div className="flex items-center justify-between mb-[16px]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Voucher Redemption</p>
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="size-[32px] flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#1b1c15" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Input field */}
              <div className="flex gap-[10px] mb-[16px]">
                <input
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  placeholder="Enter voucher code"
                  className="flex-1 border border-[#d9d9d9] rounded-[6px] px-[12px] py-[10px] font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15] outline-none focus:border-[#db43ae] transition-colors"
                />
                <button
                  onClick={() => {
                    if (voucherInput.trim()) {
                      setVoucher("applied");
                      setShowVoucherModal(false);
                    }
                  }}
                  className="bg-[#db43ae] px-[16px] h-[44px] rounded-[6px] cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">Apply</p>
                </button>
              </div>

              {/* Voucher options */}
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#92929d] mb-[10px]">Available Vouchers</p>
              {[
                { code: "MF923320011", label: "RM 0.90 OFF", desc: "Min. spend RM 15.00" },
                { code: "LUXE15OFF", label: "15% OFF", desc: "Max. discount RM 5.00" },
              ].map((v) => (
                <button
                  key={v.code}
                  onClick={() => {
                    setVoucher("applied");
                    setVoucherInput(v.code);
                    setShowVoucherModal(false);
                  }}
                  className="w-full flex items-center justify-between border border-[#e0e0e0] rounded-[8px] px-[14px] py-[12px] mb-[8px] cursor-pointer hover:border-[#db43ae] hover:bg-[rgba(219,67,174,0.04)] transition-all"
                >
                  <div className="text-left">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">{v.label}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{v.desc}</p>
                  </div>
                  <div className="px-[8px] py-[2px] border border-[#db43ae] rounded-full">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#db43ae]">{v.code}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Top Up modal ───────────────────────────────────────────────── */}
        {showTopUp && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-[24px] px-[20px] pt-[20px] pb-[36px]">
              {topUpSuccess ? (
                <div className="flex flex-col items-center gap-[12px] py-[20px]">
                  <div className="size-[60px] bg-[#e8f8f0] rounded-full flex items-center justify-center">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00b894"/><path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Top Up Successful!</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">New wallet balance: RM {walletBalance.toFixed(2)}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-[16px]">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Top Up Beauty Wallet</p>
                    <button onClick={() => setShowTopUp(false)} className="cursor-pointer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1b1c15" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] mb-[14px]">Current balance: <span className="text-[#db43ae]">RM {walletBalance.toFixed(2)}</span></p>
                  <div className="flex items-center border border-[#d9d9d9] rounded-[8px] px-[12px] py-[10px] mb-[12px]">
                    <span className="font-['Poppins:Regular',sans-serif] text-[16px] text-[#92929d] mr-[8px]">RM</span>
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 font-['Poppins:Regular',sans-serif] text-[16px] text-[#1b1c15] outline-none bg-transparent"
                    />
                  </div>
                  <div className="flex gap-[8px] mb-[16px]">
                    {["50", "100", "200", "500"].map((v) => (
                      <button key={v} onClick={() => setTopUpAmount(v)} className={`flex-1 py-[6px] rounded-full border cursor-pointer transition-colors text-center ${topUpAmount === v ? "border-[#db43ae] bg-[#fdf0fa]" : "border-[#e0e0e0]"}`}>
                        <p className={`font-['Poppins:Regular',sans-serif] text-[12px] ${topUpAmount === v ? "text-[#db43ae]" : "text-[#92929d]"}`}>+{v}</p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const v = parseFloat(topUpAmount);
                      if (v > 0) {
                        setWalletBalance((b) => b + v);
                        setTopUpSuccess(true);
                        setTimeout(() => { setShowTopUp(false); setTopUpSuccess(false); setTopUpAmount(""); }, 1800);
                      }
                    }}
                    className="w-full bg-[#db43ae] py-[13px] rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white text-center">Confirm Top Up</p>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}