import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Star, Check, MapPin, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAppContext, getTierInfo } from "../context/AppContext";

const TOTAL_STEPS = 6;
const STEPS = ["Outlet", "Service", "Staff", "Date & Time", "Notes", "Review"];

// ─── Data ─────────────────────────────────────────────────────────────────────

const outlets = [
  { id: "A", name: "Kuchai Lama", address: "1-4, Jalan Kuchai Maju 11, KL", dist: "3.2 km", preferred: true, img: "figma:asset/2c19b79b2ad5ecb26e0bd9add158daadd0d22c8a.png" },
  { id: "B", name: "Bangsar", address: "22, Jalan Telawi 3, Bangsar, KL", dist: "5.8 km", preferred: false, img: "figma:asset/2c19b79b2ad5ecb26e0bd9add158daadd0d22c8a.png" },
  { id: "C", name: "Mont Kiara", address: "Plaza Mont Kiara, Kuala Lumpur", dist: "8.1 km", preferred: false, img: "figma:asset/2c19b79b2ad5ecb26e0bd9add158daadd0d22c8a.png" },
  { id: "D", name: "Damansara", address: "Taman Tun Dr Ismail, KL", dist: "10.0 km", preferred: false, img: "figma:asset/2c19b79b2ad5ecb26e0bd9add158daadd0d22c8a.png" },
];

const services = [
  { id: "1", name: "Hair Color", price: 200, duration: "2h 30min", img: "figma:asset/131a4defdf357ce49230845f513a0668bee46c3b.png" },
  { id: "2", name: "Women's Haircut", price: 50, duration: "45min", img: "figma:asset/f4a6aa64f1237632a37b6b68078297027c99d6c6.png" },
  { id: "3", name: "Blow-Dry & Style", price: 50, duration: "45min", img: "figma:asset/a9cca224dde6bff521a0ecda6acf0668503f4b0a.png" },
  { id: "4", name: "Hair Bleach", price: 100, duration: "3h", img: "figma:asset/8723cdb63e57c6f1b7924b31a6bd0220ba637cc2.png" },
  { id: "5", name: "Event / Photoshoot Styling", price: 100, duration: "1h 30min", img: "figma:asset/b64b895e4f1700da78a004a0bd12dcd4f2f123aa.png" },
  { id: "6", name: "Kids' Haircut", price: 20, duration: "30min", img: "figma:asset/6868a9afc185d925fce9e160feb8b5d89eab6ca3.png" },
];

const staffList = [
  { id: "any", name: "Any Available", sub: "Best available stylist", rating: 0, favourite: false, img: "" },
  { id: "1", name: "Sofia Grace", sub: "Hair Color Specialist", rating: 4.5, favourite: true, img: "figma:asset/b4c010ecd8d415b0c86e7d074d76b457cfa7f228.png" },
  { id: "2", name: "Chloe Rivera", sub: "Haircut & Styling", rating: 4.3, favourite: false, img: "figma:asset/7b12c6ccafb572490c27b602e60cc602974780d1.png" },
  { id: "3", name: "Amira Belle", sub: "Colour & Treatments", rating: 4.3, favourite: false, img: "figma:asset/7b12c6ccafb572490c27b602e60cc602974780d1.png" },
  { id: "4", name: "Jess Tan", sub: "Blowdry & Updos", rating: 4.1, favourite: false, img: "figma:asset/7b12c6ccafb572490c27b602e60cc602974780d1.png" },
];

const timeSlots = ["10:00am", "11:00am", "12:00pm", "1:00pm", "3:00pm", "3:30pm", "4:00pm", "4:30pm"];
const conditionOptions = ["Allergies to chemicals", "Currently pregnant", "Sensitive scalp/skin", "Recent hair treatment", "Colour-treated hair"];

// ─── Calendar ─────────────────────────────────────────────────────────────────
function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Main ─────────────────────────────────────────────────────────────────────
export function BookAppointmentPage() {
  const navigate = useNavigate();
  const { addAppointment, addPoints, totalPointsEarned, vouchers } = useAppContext();
  const tier = getTierInfo(totalPointsEarned);
  const [step, setStep] = useState(1);

  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [favouriteStaff, setFavouriteStaff] = useState<Set<string>>(new Set(["1"]));
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(3); // April
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [otherNotes, setOtherNotes] = useState("");
  const [booked, setBooked] = useState(false);

  // Voucher
  const availableVouchers = vouchers.filter((v) => v.status === "available" && !v.pointsCost);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const appliedVoucherData = availableVouchers.find((v) => v.id === appliedVoucher);

  const totalPrice = selectedServices.reduce((sum, id) => {
    const s = services.find((s) => s.id === id);
    return sum + (s?.price ?? 0);
  }, 0);

  const totalDuration = selectedServices.map((id) => services.find((s) => s.id === id)?.duration ?? "").filter(Boolean).join(" + ");

  // Tier discount
  const tierDiscountPct = tier.discountPct;
  const tierDiscount = Math.round(totalPrice * tierDiscountPct / 100);

  // Voucher discount (simple: if discount is %, apply; if RM X, subtract)
  let voucherDiscount = 0;
  if (appliedVoucherData) {
    const d = appliedVoucherData.discount;
    if (d.includes("%")) {
      const pct = parseInt(d);
      voucherDiscount = Math.round(totalPrice * pct / 100);
    } else {
      const rmMatch = d.match(/RM\s*([\d.]+)/);
      if (rmMatch) voucherDiscount = parseFloat(rmMatch[1]);
    }
  }

  const finalTotal = Math.max(0, totalPrice - tierDiscount - voucherDiscount);
  const pointsToEarn = Math.round(finalTotal * tier.multiplier);

  const canNext = () => {
    if (step === 1) return !!selectedOutlet;
    if (step === 2) return selectedServices.length > 0;
    if (step === 3) return !!selectedStaff;
    if (step === 4) return !!selectedDate && !!selectedTime;
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else handleBook();
  };

  const handleBook = () => {
    const serviceNames = selectedServices.map((id) => services.find((s) => s.id === id)?.name ?? "Service").join(", ");
    const dateLabel = `${selectedDate} ${MONTHS[calMonth]} ${calYear}`;
    const outletName = outlets.find((b) => b.id === selectedOutlet)?.name ?? "Branch";

    addAppointment({
      service: serviceNames || "Appointment",
      branch: `${outletName} Branch`,
      date: dateLabel,
      time: selectedTime ?? "12:00 PM",
      customer: "Joanne Chan",
      status: "booked",
      section: "upcoming",
    });

    if (pointsToEarn > 0) {
      addPoints(pointsToEarn, "Appointment Booking", `Earned from booking: ${serviceNames}`);
    }

    setBooked(true);
    setTimeout(() => navigate("/appointment"), 2200);
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };
  const toggleCondition = (c: string) => {
    setSelectedConditions((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };
  const toggleFavourite = (id: string) => {
    setFavouriteStaff((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const calDays = buildCalendar(calYear, calMonth);
  const today = new Date();

  // ── Booked success screen ─────────────────────────────────────────────────
  if (booked) {
    return (
      <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
        <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col items-center justify-center gap-[20px] px-[32px]">
          <div className="size-[80px] rounded-full bg-[#e8f8f0] flex items-center justify-center">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#00b894"/>
              <path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-['Poppins:Bold',sans-serif] text-[22px] text-[#1b1c15] text-center">Appointment Booked! 🎉</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center">
            Your appointment has been confirmed. We'll send a reminder before your visit.
          </p>
          {pointsToEarn > 0 && (
            <div className="bg-[#fdf0fa] border border-[#f0c8e8] rounded-[12px] px-[20px] py-[12px] flex items-center gap-[8px]">
              <Star size={18} className="text-[#db43ae]" fill="#db43ae" />
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#db43ae]">+{pointsToEarn} pts will be credited!</p>
            </div>
          )}
          <div className="w-[60px] h-[4px] bg-[#db43ae] rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">

        {/* Top bar */}
        <div className="bg-[#db43ae] h-[56px] flex items-center px-[8px] shadow-[0px_3px_25px_0px_rgba(0,0,0,0.14)] shrink-0">
          <button onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))} className="size-[40px] flex items-center justify-center rounded-full hover:bg-white/20 cursor-pointer transition-colors">
            <ChevronLeft size={22} className="text-white" />
          </button>
          <p className="flex-1 font-['Poppins:SemiBold',sans-serif] text-[16px] text-white text-center">Book Appointment</p>
          <div className="size-[40px]" />
        </div>

        {/* Progress bar */}
        <div className="h-[4px] bg-[#e2e2ea] shrink-0 relative">
          <div className="h-full bg-[#db43ae] transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>

        {/* Step label */}
        <div className="px-[16px] py-[8px] shrink-0 flex items-center justify-between">
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">
            Step {step} of {TOTAL_STEPS} — <span className="text-[#db43ae]">{STEPS[step - 1]}</span>
          </p>
          <div className="flex gap-[4px]">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-[4px] rounded-full transition-all ${i + 1 <= step ? "bg-[#db43ae]" : "bg-[#e2e2ea]"}`} style={{ width: i + 1 === step ? "16px" : "8px" }} />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-[16px] pb-[100px]">

          {/* ── Step 1: Select Outlet ─────────────────────────────── */}
          {step === 1 && (
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[14px]">Choose Your Outlet</p>
              <div className="flex flex-col gap-[10px]">
                {outlets.map((outlet) => {
                  const selected = selectedOutlet === outlet.id;
                  return (
                    <button
                      key={outlet.id}
                      onClick={() => setSelectedOutlet(outlet.id)}
                      className="relative rounded-[12px] overflow-hidden border cursor-pointer transition-all text-left w-full"
                      style={{ borderColor: selected ? "#db43ae" : "#e2e2ea", borderWidth: selected ? "2px" : "1px" }}
                    >
                      <div className="h-[80px] overflow-hidden bg-gray-100">
                        <ImageWithFallback src={outlet.img} alt={outlet.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-[12px] bg-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-[6px] mb-[3px]">
                              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">{outlet.name}</p>
                              {outlet.preferred && (
                                <span className="bg-[#fdf0fa] border border-[#f0c8e8] rounded-full px-[7px] py-[1px]">
                                  <p className="font-['Poppins:SemiBold',sans-serif] text-[9px] text-[#db43ae]">⭐ Preferred</p>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-[4px]">
                              <MapPin size={11} className="text-[#92929d] shrink-0" />
                              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{outlet.address}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-[4px] shrink-0 ml-[8px]">
                            <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">{outlet.dist}</p>
                            {selected && (
                              <div className="size-[22px] bg-[#db43ae] rounded-full flex items-center justify-center">
                                <Check size={13} className="text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 2: Select Service ────────────────────────────── */}
          {step === 2 && (
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[4px]">Select Service(s)</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[14px]">You can select multiple services</p>
              <div className="grid grid-cols-2 gap-[10px]">
                {services.map((s) => {
                  const selected = selectedServices.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className="relative rounded-[10px] overflow-hidden border cursor-pointer transition-all text-left"
                      style={{ borderColor: selected ? "#db43ae" : "#e2e2ea", borderWidth: selected ? "2px" : "1px" }}
                    >
                      <div className="h-[120px] overflow-hidden bg-gray-100">
                        <ImageWithFallback src={s.img} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-[8px] bg-white">
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#1b1c15]">{s.name}</p>
                        <div className="flex items-center justify-between mt-[3px]">
                          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#db43ae]">RM {s.price}</p>
                          <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#92929d]">{s.duration}</p>
                        </div>
                      </div>
                      {selected && (
                        <div className="absolute top-[8px] right-[8px] size-[20px] bg-[#db43ae] rounded-full flex items-center justify-center">
                          <Check size={11} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedServices.length > 0 && (
                <div className="mt-[14px] bg-[#fdf0fa] border border-[#f0c8e8] rounded-[10px] p-[12px]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">
                    {selectedServices.length} service(s) selected · Total: RM {totalPrice} · Est. {totalDuration}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Select Staff ─────────────────────────────── */}
          {step === 3 && (
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[4px]">Choose Your Stylist</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[14px]">Tap ❤️ to mark as favourite</p>
              <div className="flex flex-col gap-[10px]">
                {staffList.map((st) => {
                  const selected = selectedStaff === st.id;
                  const isFav = favouriteStaff.has(st.id);
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStaff(st.id)}
                      className="bg-white rounded-[12px] flex items-center px-[14px] py-[14px] cursor-pointer transition-all w-full text-left"
                      style={{ border: selected ? "2px solid #db43ae" : "1px solid #e2e2ea", background: selected ? "rgba(219,67,174,0.03)" : "white" }}
                    >
                      {st.id === "any" ? (
                        <div className="size-[48px] rounded-full bg-[#fdf0fa] flex items-center justify-center shrink-0 mr-[12px]">
                          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#db43ae" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#db43ae" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </div>
                      ) : (
                        <div className="size-[48px] rounded-full overflow-hidden bg-gray-100 shrink-0 mr-[12px]">
                          <ImageWithFallback src={st.img} alt={st.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">{st.name}</p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{st.sub}</p>
                        {st.rating > 0 && (
                          <div className="flex items-center gap-[3px] mt-[3px]">
                            <Star size={11} className="text-[#fbbf24] fill-[#fbbf24]" />
                            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#555]">{st.rating}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-[8px] shrink-0">
                        {st.id !== "any" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavourite(st.id); }}
                            className="cursor-pointer hover:scale-110 transition-transform"
                          >
                            <Heart size={16} className={isFav ? "text-[#db43ae] fill-[#db43ae]" : "text-[#ccc]"} />
                          </button>
                        )}
                        {selected && (
                          <div className="size-[22px] bg-[#db43ae] rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 4: Date & Time ──────────────────────────────── */}
          {step === 4 && (
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[14px]">Select Date & Time</p>
              {/* Month nav */}
              <div className="flex items-center gap-[14px] mb-[12px]">
                <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }} className="size-[28px] flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
                  <ChevronLeft size={16} className="text-[#92929d]" />
                </button>
                <p className="flex-1 font-['Poppins:SemiBold',sans-serif] text-[14px] text-black text-center">{MONTHS[calMonth]} {calYear}</p>
                <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }} className="size-[28px] flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
                  <ChevronLeft size={16} className="text-[#92929d] rotate-180" />
                </button>
              </div>
              {/* Calendar */}
              <div className="bg-white rounded-[12px] border border-[#e2e2ea] p-[12px] mb-[16px]">
                <div className="grid grid-cols-7 mb-[8px]">
                  {DAYS.map((d) => (<p key={d} className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] text-center py-[4px]">{d}</p>))}
                </div>
                <div className="grid grid-cols-7 gap-y-[4px]">
                  {calDays.map((d, i) => {
                    if (d === null) return <div key={`e-${i}`} />;
                    const isSelected = selectedDate === d;
                    const isPast = calYear === today.getFullYear() && calMonth === today.getMonth() && d < today.getDate();
                    return (
                      <button
                        key={i}
                        onClick={() => !isPast && setSelectedDate(d)}
                        disabled={isPast}
                        className="flex items-center justify-center h-[32px] rounded-full cursor-pointer transition-all"
                        style={{ background: isSelected ? "#db43ae" : "transparent", color: isSelected ? "white" : isPast ? "#ccc" : "#555" }}
                      >
                        <p className="font-['Poppins:Regular',sans-serif] text-[13px]">{d}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Time slots */}
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[10px]">Available Slots</p>
              <div className="grid grid-cols-3 gap-[8px]">
                {timeSlots.map((t) => {
                  const selected = selectedTime === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className="h-[40px] rounded-[8px] flex items-center justify-center cursor-pointer transition-all"
                      style={{ border: selected ? "2px solid #db43ae" : "1px solid #eaecf1", background: selected ? "#fdf0fa" : "white" }}
                    >
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[12px]" style={{ color: selected ? "#db43ae" : "#555" }}>{t}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 5: Special Notes ────────────────────────────── */}
          {step === 5 && (
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[4px]">Special Conditions</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[14px]">Help us prepare the right treatment for you</p>
              <div className="flex flex-col gap-[8px] mb-[16px]">
                {conditionOptions.map((c) => {
                  const selected = selectedConditions.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCondition(c)}
                      className="w-full flex items-center justify-between p-[14px] rounded-[10px] cursor-pointer transition-all"
                      style={{ background: selected ? "rgba(219,67,174,0.06)" : "white", border: selected ? "1.5px solid #db43ae" : "1px solid #ececec" }}
                    >
                      <p className="font-['Poppins:Regular',sans-serif] text-[13px]" style={{ color: selected ? "#db43ae" : "#1d1b20" }}>{c}</p>
                      <div className="size-[22px] rounded-full border flex items-center justify-center transition-all" style={{ borderColor: selected ? "#db43ae" : "#b5b5be", background: selected ? "#db43ae" : "white" }}>
                        {selected && <Check size={12} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[8px]">Additional Notes (optional)</p>
              <textarea
                value={otherNotes}
                onChange={(e) => setOtherNotes(e.target.value)}
                rows={4}
                placeholder="Any specific requests, hair goals, or things you'd like your stylist to know..."
                className="w-full border border-[#d9d9d9] rounded-[10px] px-[14px] py-[12px] font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15] resize-none outline-none placeholder-[#aaa] focus:border-[#db43ae] transition-colors"
              />
            </div>
          )}

          {/* ── Step 6: Review & Confirm ─────────────────────────── */}
          {step === 6 && (
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[4px]">Review & Confirm</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[14px]">Please review your booking details before confirming</p>

              {/* Booking summary card */}
              <div className="bg-white border border-[#f0f0f0] rounded-[14px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)] mb-[14px]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#db43ae] to-[#e870cc] px-[16px] py-[12px]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">Booking Summary</p>
                </div>
                {/* Details */}
                <div className="p-[16px] flex flex-col gap-[12px]">
                  {[
                    { icon: "📍", label: "Outlet", value: outlets.find((b) => b.id === selectedOutlet)?.name ?? "-" },
                    { icon: "✂️", label: "Service(s)", value: selectedServices.map((id) => services.find((s) => s.id === id)?.name).join(", ") || "-" },
                    { icon: "⏱️", label: "Est. Duration", value: totalDuration || "-" },
                    { icon: "👩‍🎨", label: "Stylist", value: staffList.find((s) => s.id === selectedStaff)?.name ?? "-" },
                    { icon: "📅", label: "Date & Time", value: selectedDate ? `${selectedDate} ${MONTHS[calMonth]} ${calYear}, ${selectedTime}` : "-" },
                    ...(selectedConditions.length > 0 ? [{ icon: "⚠️", label: "Conditions", value: selectedConditions.join(", ") }] : []),
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-[10px]">
                      <span className="text-[14px] shrink-0 mt-[1px]">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[1px]">{item.label}</p>
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-white border border-[#f0f0f0] rounded-[14px] p-[16px] mb-[14px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[12px]">Price Breakdown</p>
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center justify-between">
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#555]">Subtotal ({selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""})</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">RM {totalPrice}.00</p>
                  </div>
                  {tierDiscountPct > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[5px]">
                        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#555]">{tier.name} Tier Discount</p>
                        <span className="bg-[#fdf0fa] rounded-full px-[6px] py-[1px]"><p className="font-['Poppins:SemiBold',sans-serif] text-[9px] text-[#db43ae]">-{tierDiscountPct}%</p></span>
                      </div>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#db43ae]">-RM {tierDiscount}.00</p>
                    </div>
                  )}
                  {appliedVoucherData && voucherDiscount > 0 && (
                    <div className="flex items-center justify-between">
                      <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#555]">Voucher: {appliedVoucherData.title}</p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#db43ae]">-RM {voucherDiscount}.00</p>
                    </div>
                  )}
                  <div className="h-[1px] bg-[#f0f0f0]" />
                  <div className="flex items-center justify-between">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">Total Payable</p>
                    <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-[#1b1c15]">RM {finalTotal}.00</p>
                  </div>
                  <div className="flex items-center gap-[5px] bg-[#fdf0fa] rounded-[8px] px-[10px] py-[7px]">
                    <Star size={13} className="text-[#db43ae]" fill="#db43ae" />
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#db43ae]">
                      You'll earn <span className="font-['Poppins:Bold',sans-serif]">{pointsToEarn} pts</span> from this booking ({tier.multiplier}× multiplier)
                    </p>
                  </div>
                </div>
              </div>

              {/* Voucher selector */}
              {availableVouchers.length > 0 && (
                <div className="bg-white border border-[#f0f0f0] rounded-[14px] p-[14px] mb-[14px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15] mb-[8px]">Apply Voucher</p>
                  <div className="flex flex-col gap-[6px]">
                    {availableVouchers.slice(0, 3).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setAppliedVoucher(appliedVoucher === v.id ? null : v.id)}
                        className={`flex items-center justify-between p-[10px] rounded-[8px] border cursor-pointer transition-all ${appliedVoucher === v.id ? "border-[#db43ae] bg-[rgba(219,67,174,0.06)]" : "border-[#e0e0e0] hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-[8px]">
                          <div className="bg-[#fdf0fa] rounded-[6px] px-[7px] py-[2px]">
                            <p className="font-['Poppins:Bold',sans-serif] text-[10px] text-[#db43ae]">{v.discount}</p>
                          </div>
                          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#555]">{v.title}</p>
                        </div>
                        {appliedVoucher === v.id && <Check size={16} className="text-[#db43ae]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom action bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] px-[16px] py-[14px]">
          {step === TOTAL_STEPS ? (
            <div className="flex items-center gap-[12px]">
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-black">RM {finalTotal}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} · +{pointsToEarn} pts</p>
              </div>
              <button
                onClick={handleBook}
                className="flex-1 h-[46px] bg-[#db43ae] rounded-[10px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              >
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">Confirm Booking</p>
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="w-full h-[46px] rounded-[10px] flex items-center justify-center cursor-pointer transition-opacity disabled:cursor-not-allowed"
              style={{ background: canNext() ? "#db43ae" : "#e0e0e0" }}
            >
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px]" style={{ color: canNext() ? "white" : "#999" }}>
                {step === 5 ? "Review Booking" : "Next"}
              </p>
            </button>
          )}
        </div>

        {/* Gesture bar */}
        <div className="absolute bottom-[2px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}
