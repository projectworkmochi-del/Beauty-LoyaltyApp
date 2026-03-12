import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, MapPin, Calendar, User, X, Star } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAppContext } from "../context/AppContext";

type HistoryStatus = "booked" | "noshow" | "cancelled";

interface HistoryItem {
  id: string;
  service: string;
  branch: string;
  date: string;
  time: string;
  customer: string;
  status: HistoryStatus;
}

const historyData: HistoryItem[] = [
  { id: "1", service: "Facial", branch: "Kuchai Lama Branch", date: "25 July 2025", time: "3:00 PM", customer: "Jane Doe", status: "booked" },
  { id: "2", service: "Facial", branch: "Kuchai Lama Branch", date: "05 June 2025", time: "3:00 PM", customer: "Jane Doe", status: "booked" },
  { id: "3", service: "Facial", branch: "Kuchai Lama Branch", date: "01 June 2025", time: "3:00 PM", customer: "Jane Doe", status: "noshow" },
  { id: "4", service: "Facial", branch: "Kuchai Lama Branch", date: "01 June 2025", time: "3:00 PM", customer: "Jane Doe", status: "cancelled" },
  { id: "5", service: "Facial", branch: "Kuchai Lama Branch", date: "01 June 2025", time: "3:00 PM", customer: "Jane Doe", status: "booked" },
  { id: "6", service: "Hair Color", branch: "Kuchai Lama Branch", date: "15 May 2025", time: "11:00 AM", customer: "Jane Doe", status: "booked" },
];

function StatusBadge({ status }: { status: HistoryStatus }) {
  if (status === "booked") return (
    <div className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-[#e8f8f0]">
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#00b894"/>
        <path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#00b894]">Booked</p>
    </div>
  );

  if (status === "noshow") return (
    <div className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-[#fff0e0]">
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#e67e22"/>
        <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#e67e22]">No Show</p>
    </div>
  );

  return (
    <div className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-[#fde8e8]">
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#e74c3c"/>
        <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#e74c3c]">Cancelled</p>
    </div>
  );
}

interface RateModalProps {
  item: HistoryItem;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

function RateModal({ item, onClose, onSubmit }: RateModalProps) {
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
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#00b894"/>
              <path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15] text-center">Thank You!</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center">
            Your rating has been submitted. We appreciate your feedback!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-[24px] px-[20px] pt-[20px] pb-[36px]">
        {/* Handle */}
        <div className="w-[40px] h-[4px] bg-gray-200 rounded-full mx-auto mb-[16px]" />

        <div className="flex items-center justify-between mb-[16px]">
          <div>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">Rate Your Experience</p>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{item.service} — {item.date}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer size-[32px] flex items-center justify-center rounded-full hover:bg-gray-100">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-[10px] mb-[20px]">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              <Star
                size={38}
                strokeWidth={1.5}
                className={(hovered || selected) >= star ? "text-[#fbbf24] fill-[#fbbf24]" : "text-[#e0e0e0]"}
              />
            </button>
          ))}
        </div>

        {/* Rating label */}
        {selected > 0 && (
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#db43ae] text-center mb-[14px]">
            {["", "Poor 😞", "Fair 😐", "Good 🙂", "Great 😊", "Excellent! 🌟"][selected]}
          </p>
        )}

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience (optional)..."
          className="w-full border border-[#d9d9d9] rounded-[8px] px-[14px] py-[12px] font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15] resize-none outline-none placeholder-[#aaa] focus:border-[#db43ae] transition-colors mb-[16px]"
        />

        <button
          onClick={handleSubmit}
          disabled={selected === 0}
          className="w-full py-[14px] rounded-[10px] cursor-pointer transition-all disabled:cursor-not-allowed"
          style={{ background: selected > 0 ? "#db43ae" : "#e0e0e0" }}
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px]" style={{ color: selected > 0 ? "white" : "#999" }}>
            Submit Rating
          </p>
        </button>
      </div>
    </div>
  );
}

export function AppointmentHistoryPage() {
  const navigate = useNavigate();
  const { historyAppointments } = useAppContext();
  const [ratingTarget, setRatingTarget] = useState<(typeof historyAppointments)[0] | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());

  const handleRateSubmit = (id: string, _rating: number, _comment: string) => {
    setRatedIds((prev) => new Set([...prev, id]));
    setRatingTarget(null);
  };

  const handleRebook = (appt: (typeof historyAppointments)[0]) => {
    navigate("/appointment/book", { state: { rebookService: appt.service, rebookBranch: appt.branch } });
  };

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
        <div className="flex items-center gap-[8px] px-[8px] py-[12px] shrink-0">
          <button onClick={() => navigate(-1)} className="size-[36px] flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
            <ChevronLeft size={22} className="text-[#1b1c15]" />
          </button>
          <p className="font-['Poppins:Bold',sans-serif] text-[18px] text-[#1b1c15]">Appointment History</p>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto pb-[20px]">
          {historyAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
              <div className="size-[60px] rounded-full bg-[#fdf0fa] flex items-center justify-center">
                <Calendar size={28} className="text-[#db43ae]" strokeWidth={1.5} />
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#92929d]">No appointment history yet</p>
            </div>
          ) : (
            historyAppointments.map((item) => {
              const isRated = ratedIds.has(item.id);
              const canRate = item.status === "booked";
              return (
                <div key={item.id} className="border-b border-[#f0f0f0] px-[16px] py-[16px]">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-[8px]">
                    <div className="flex items-center gap-[8px]">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">{item.service}</p>
                      <StatusBadge status={item.status as "booked" | "noshow" | "cancelled"} />
                    </div>
                    {canRate && (
                      <button onClick={() => !isRated && setRatingTarget(item)} className="cursor-pointer hover:opacity-70 transition-opacity">
                        {isRated ? (
                          <div className="flex items-center gap-[4px]">
                            <Star size={12} className="text-[#fbbf24] fill-[#fbbf24]" />
                            <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#92929d]">Rated</p>
                          </div>
                        ) : (
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae] underline">Rate Us Now!</p>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-[6px] mb-[4px]">
                    <MapPin size={13} className="text-[#92929d] shrink-0" />
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">{item.branch}</p>
                  </div>

                  <div className="flex items-center gap-[4px] mb-[10px]">
                    <Calendar size={13} className="text-[#92929d] shrink-0" />
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{item.date}, {item.time}</p>
                    <span className="text-[#92929d] mx-[4px]">|</span>
                    <User size={13} className="text-[#92929d] shrink-0" />
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{item.customer}</p>
                  </div>

                  {/* Rebook button */}
                  <button
                    onClick={() => handleRebook(item)}
                    className="flex items-center gap-[6px] px-[14px] py-[6px] border border-[#db43ae] rounded-[20px] cursor-pointer hover:bg-[#fdf0fa] transition-colors"
                  >
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                      <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="#db43ae"/>
                    </svg>
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#db43ae]">Rebook</p>
                  </button>
                </div>
              );
            })
          )}
        </div>

        <BottomNav active="history" />

        {/* Rating Modal */}
        {ratingTarget && (
          <RateModal
            item={ratingTarget}
            onClose={() => setRatingTarget(null)}
            onSubmit={(rating, comment) => handleRateSubmit(ratingTarget.id, rating, comment)}
          />
        )}

        <div className="absolute bottom-[6px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}