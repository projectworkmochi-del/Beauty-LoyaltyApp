import { useState } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { useAppContext, TreatmentRecord } from "../context/AppContext";
import { Star, MapPin, Clock, ChevronDown, ChevronUp, X } from "lucide-react";

type HistoryTab = "treatments" | "appointments";

// ── Rating Modal ──────────────────────────────────────────────────────────────
function RateModal({ record, onClose, onSubmit }: {
  record: TreatmentRecord;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(selected, comment);
      onClose();
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center px-[24px]">
        <div className="bg-white rounded-[20px] p-[28px] w-full flex flex-col items-center gap-[12px]">
          <div className="size-[64px] bg-[#e8f8f0] rounded-full flex items-center justify-center">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00b894"/><path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15] text-center">Thank You! 🌟</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center">Your rating helps us improve your beauty experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-[24px] px-[20px] pt-[20px] pb-[40px]">
        <div className="w-[40px] h-[4px] bg-gray-200 rounded-full mx-auto mb-[16px]" />
        <div className="flex items-center justify-between mb-[16px]">
          <div>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Rate Your Experience</p>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{record.service} · {record.date}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer size-[32px] flex items-center justify-center rounded-full hover:bg-gray-100">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-[12px] mb-[20px]">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              <Star size={38} strokeWidth={1.5} className={(hovered || selected) >= star ? "text-[#fbbf24] fill-[#fbbf24]" : "text-[#e0e0e0]"} />
            </button>
          ))}
        </div>
        {selected > 0 && (
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#db43ae] text-center mb-[14px]">
            {["", "Poor 😞", "Fair 😐", "Good 🙂", "Great 😊", "Excellent! 🌟"][selected]}
          </p>
        )}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience (optional)..."
          className="w-full border border-[#d9d9d9] rounded-[10px] px-[14px] py-[12px] font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15] resize-none outline-none placeholder-[#aaa] focus:border-[#db43ae] transition-colors mb-[16px]"
        />
        <button
          onClick={handleSubmit}
          disabled={selected === 0}
          className="w-full py-[14px] rounded-[12px] cursor-pointer transition-all disabled:cursor-not-allowed"
          style={{ background: selected > 0 ? "#db43ae" : "#e0e0e0" }}
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px]" style={{ color: selected > 0 ? "white" : "#999" }}>Submit Rating</p>
        </button>
      </div>
    </div>
  );
}

// ── Treatment Card ────────────────────────────────────────────────────────────
function TreatmentCard({ record, onRate, onRebook }: {
  record: TreatmentRecord;
  onRate: (r: TreatmentRecord) => void;
  onRebook: (r: TreatmentRecord) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const statusBadge = {
    completed: { bg: "bg-[#e8f8f0]", text: "text-[#00b894]", label: "Completed" },
    noshow: { bg: "bg-[#fff3e0]", text: "text-[#e67e22]", label: "No Show" },
    cancelled: { bg: "bg-[#fde8e8]", text: "text-[#e74c3c]", label: "Cancelled" },
  };
  const badge = statusBadge[record.status];

  return (
    <div className="bg-white border border-[#f0f0f0] rounded-[16px] mb-[12px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.05)]">
      {/* Main info */}
      <div className="p-[16px]">
        <div className="flex items-start justify-between mb-[8px]">
          <div className="flex-1">
            <div className="flex items-center gap-[8px] mb-[4px] flex-wrap">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">{record.service}</p>
              <div className={`px-[8px] py-[2px] rounded-full ${badge.bg}`}>
                <p className={`font-['Poppins:SemiBold',sans-serif] text-[10px] ${badge.text}`}>{badge.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-[6px] mb-[3px]">
              <MapPin size={12} className="text-[#92929d] shrink-0" />
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#555]">{record.outlet}</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center gap-[4px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#92929d" strokeWidth="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#92929d" strokeWidth="1.8" strokeLinecap="round"/></svg>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{record.date}</p>
              </div>
              <div className="flex items-center gap-[4px]">
                <Clock size={11} className="text-[#92929d]" />
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{record.time} · {record.duration}</p>
              </div>
            </div>
          </div>
          {/* Rating stars */}
          {record.rated && record.rating && (
            <div className="flex items-center gap-[2px] shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className={i < record.rating! ? "text-[#fbbf24] fill-[#fbbf24]" : "text-[#e0e0e0]"} />
              ))}
            </div>
          )}
        </div>

        {/* Points + stylist */}
        <div className="flex items-center justify-between pt-[8px] border-t border-[#f5f5f5]">
          <div className="flex items-center gap-[8px]">
            <div className="flex items-center gap-[4px]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#92929d" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#92929d" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d]">{record.stylist}</p>
            </div>
            {record.status === "completed" && (
              <div className="flex items-center gap-[3px] bg-[#fdf0fa] rounded-full px-[7px] py-[2px]">
                <Star size={10} className="text-[#db43ae]" strokeWidth={1.5} />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#db43ae]">+{record.pointsEarned} pts</p>
              </div>
            )}
          </div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#1b1c15]">RM {record.amount}.00</p>
        </div>
      </div>

      {/* Expand section */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-[16px] py-[10px] bg-[#fafafa] border-t border-[#f0f0f0] cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">
          {expanded ? "Hide treatment details" : "View treatment details"}
        </p>
        {expanded ? <ChevronUp size={14} className="text-[#92929d]" /> : <ChevronDown size={14} className="text-[#92929d]" />}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-[16px] py-[14px] border-t border-[#f0f0f0] bg-[#fafafa]">
          {/* Products used */}
          <div className="mb-[12px]">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae] mb-[6px]">🧴 Products Used</p>
            {record.productsUsed.map((p, i) => (
              <div key={i} className="flex items-start gap-[6px] mb-[3px]">
                <div className="size-[5px] rounded-full bg-[#db43ae] mt-[6px] shrink-0" />
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#555]">{p}</p>
              </div>
            ))}
          </div>
          {/* Formula notes */}
          <div className="mb-[12px]">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae] mb-[6px]">📋 Formula / Treatment Notes</p>
            <div className="bg-white border border-[#f0f0f0] rounded-[10px] p-[12px]">
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#555] leading-[18px]">{record.formulaNotes}</p>
            </div>
          </div>
          {/* Before/after placeholder */}
          <div className="mb-[12px]">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae] mb-[6px]">📷 Before & After</p>
            <div className="flex gap-[8px]">
              {["Before", "After"].map((label) => (
                <div key={label} className="flex-1 bg-[#f5f5f5] rounded-[10px] h-[70px] flex flex-col items-center justify-center gap-[4px] border border-dashed border-[#e0e0e0]">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#b0b0b0" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="#b0b0b0"/><path d="M21 15l-5-5L5 21" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#b0b0b0]">{label} photo</p>
                </div>
              ))}
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-[8px]">
            {record.status === "completed" && !record.rated && (
              <button
                onClick={() => onRate(record)}
                className="flex-1 flex items-center justify-center gap-[6px] py-[9px] rounded-[8px] border border-[#db43ae] cursor-pointer hover:bg-[#fdf0fa] transition-colors"
              >
                <Star size={14} className="text-[#db43ae]" />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">Rate Visit</p>
              </button>
            )}
            <button
              className="flex-1 flex items-center justify-center gap-[6px] py-[9px] rounded-[8px] bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" stroke="#92929d" strokeWidth="1.8" strokeLinecap="round"/><rect x="9" y="11" width="13" height="10" rx="2" stroke="#92929d" strokeWidth="1.8"/></svg>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#92929d]">Receipt</p>
            </button>
            <button
              onClick={() => onRebook(record)}
              className="flex-1 flex items-center justify-center gap-[6px] py-[9px] rounded-[8px] bg-[#db43ae] cursor-pointer hover:opacity-90 transition-opacity"
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="white"/></svg>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">Rebook</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function HistoryPage() {
  const navigate = useNavigate();
  const { treatmentRecords, historyAppointments, rateTreatment } = useAppContext();
  const [activeTab, setActiveTab] = useState<HistoryTab>("treatments");
  const [rateTarget, setRateTarget] = useState<TreatmentRecord | null>(null);

  const completedTreatments = treatmentRecords.filter((r) => r.status === "completed");
  const totalVisits = treatmentRecords.length;
  const totalPtsEarned = treatmentRecords.filter(r => r.status === "completed").reduce((s, r) => s + r.pointsEarned, 0);

  const handleRebook = (record: TreatmentRecord) => {
    navigate("/appointment/book", { state: { rebookService: record.service, rebookBranch: record.outlet } });
  };

  const handleRateSubmit = (id: string, rating: number) => {
    rateTreatment(id, rating);
    setRateTarget(null);
  };

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-[#fafafa] relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col" data-name="History">

        {/* Header */}
        <div className="shrink-0 bg-white border-b border-[#f0f0f0]">
          <div className="px-[16px] pt-[52px] pb-[14px]">
            <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-[#1b1c15]">My Beauty History</p>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">Your complete treatment record</p>
          </div>

          {/* Summary strip */}
          <div className="flex items-center px-[16px] pb-[14px] gap-[10px]">
            {[
              { val: String(totalVisits), label: "Total Visits", icon: "🗓️" },
              { val: String(completedTreatments.length), label: "Completed", icon: "✅" },
              { val: `${totalPtsEarned} pts`, label: "Pts Earned", icon: "⭐" },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 bg-[#fdf0fa] rounded-[10px] p-[8px] text-center">
                <p className="text-[14px] mb-[2px]">{stat.icon}</p>
                <p className="font-['Poppins:Bold',sans-serif] text-[13px] text-[#1b1c15]">{stat.val}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#92929d]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center border-t border-[#f0f0f0]">
            <button
              onClick={() => setActiveTab("treatments")}
              className={`flex-1 py-[11px] cursor-pointer relative transition-colors ${activeTab === "treatments" ? "" : "hover:bg-gray-50"}`}
            >
              {activeTab === "treatments" && <div className="absolute bottom-0 left-[16px] right-[16px] h-[2px] bg-[#db43ae] rounded-full" />}
              <p className={`font-['Poppins:SemiBold',sans-serif] text-[12px] ${activeTab === "treatments" ? "text-[#db43ae]" : "text-[#92929d]"}`}>Treatment Records</p>
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex-1 py-[11px] cursor-pointer relative transition-colors ${activeTab === "appointments" ? "" : "hover:bg-gray-50"}`}
            >
              {activeTab === "appointments" && <div className="absolute bottom-0 left-[16px] right-[16px] h-[2px] bg-[#db43ae] rounded-full" />}
              <p className={`font-['Poppins:SemiBold',sans-serif] text-[12px] ${activeTab === "appointments" ? "text-[#db43ae]" : "text-[#92929d]"}`}>Appointment Logs</p>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-[80px]">

          {/* ── TREATMENT RECORDS ─────────────────────────────────── */}
          {activeTab === "treatments" && (
            <div className="px-[16px] pt-[14px]">
              {treatmentRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
                  <div className="size-[64px] rounded-full bg-[#fdf0fa] flex items-center justify-center">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="#db43ae" strokeWidth="1.8" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="#db43ae" strokeWidth="1.8"/><path d="M9 12h6M9 16h4" stroke="#db43ae" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#1b1c15]">No treatment records yet</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] text-center">Complete your first appointment to see your beauty history here</p>
                  <button onClick={() => navigate("/appointment/book")} className="bg-[#db43ae] rounded-[10px] px-[20px] py-[10px] cursor-pointer hover:opacity-90 transition-opacity">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">Book Now</p>
                  </button>
                </div>
              ) : (
                treatmentRecords.map((record) => (
                  <TreatmentCard
                    key={record.id}
                    record={record}
                    onRate={setRateTarget}
                    onRebook={handleRebook}
                  />
                ))
              )}
            </div>
          )}

          {/* ── APPOINTMENT LOGS ─────────────────────────────────── */}
          {activeTab === "appointments" && (
            <div className="pb-[8px]">
              {historyAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
                  <div className="size-[64px] rounded-full bg-[#fdf0fa] flex items-center justify-center">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#db43ae" strokeWidth="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#db43ae" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#92929d]">No appointment history yet</p>
                </div>
              ) : (
                historyAppointments.map((item) => {
                  const statusMap = {
                    booked: { bg: "bg-[#e8f8f0]", text: "text-[#00b894]", label: "Completed" },
                    noshow: { bg: "bg-[#fff3e0]", text: "text-[#e67e22]", label: "No Show" },
                    cancelled: { bg: "bg-[#fde8e8]", text: "text-[#e74c3c]", label: "Cancelled" },
                    pending: { bg: "bg-[#e8f0fe]", text: "text-[#2980b9]", label: "Pending" },
                  };
                  const badge = statusMap[item.status] || statusMap.booked;
                  return (
                    <div key={item.id} className="bg-white border-b border-[#f0f0f0] px-[16px] py-[16px]">
                      <div className="flex items-start justify-between mb-[8px]">
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">{item.service}</p>
                        <div className={`px-[8px] py-[3px] rounded-full ${badge.bg}`}>
                          <p className={`font-['Poppins:SemiBold',sans-serif] text-[10px] ${badge.text}`}>{badge.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-[5px] mb-[3px]">
                        <MapPin size={12} className="text-[#92929d] shrink-0" />
                        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#555]">{item.branch}</p>
                      </div>
                      <div className="flex items-center gap-[5px] mb-[10px]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#92929d" strokeWidth="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#92929d" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{item.date} · {item.time}</p>
                      </div>
                      <button
                        onClick={() => navigate("/appointment/book", { state: { rebookService: item.service } })}
                        className="flex items-center gap-[5px] px-[14px] py-[6px] border border-[#db43ae] rounded-full cursor-pointer hover:bg-[#fdf0fa] transition-colors"
                      >
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="#db43ae"/></svg>
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">Rebook</p>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <BottomNav active="history" />

        {/* Rate Modal */}
        {rateTarget && (
          <RateModal
            record={rateTarget}
            onClose={() => setRateTarget(null)}
            onSubmit={(rating, _comment) => handleRateSubmit(rateTarget.id, rating)}
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