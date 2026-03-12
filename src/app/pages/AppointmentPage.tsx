import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, MapPin, Calendar, User, Clock, X, Check } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAppContext } from "../context/AppContext";

type AppointmentStatus = "booked" | "pending" | "cancelled" | "noshow";

interface Appointment {
  id: string;
  service: string;
  branch: string;
  date: string;
  time: string;
  customer: string;
  status: AppointmentStatus;
  section: "ongoing" | "upcoming" | "pending";
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = {
    booked: { bg: "bg-[#e8f8f0]", text: "text-[#00b894]", dot: "bg-[#00b894]", label: "Booked", icon: <Check size={11} className="text-[#00b894]" /> },
    pending: { bg: "bg-[#fff8e6]", text: "text-[#f39c12]", dot: "bg-[#f39c12]", label: "Pending", icon: <Clock size={11} className="text-[#f39c12]" /> },
    cancelled: { bg: "bg-[#fde8e8]", text: "text-[#e74c3c]", dot: "bg-[#e74c3c]", label: "Cancelled", icon: <X size={11} className="text-[#e74c3c]" /> },
    noshow: { bg: "bg-[#fff0e0]", text: "text-[#e67e22]", dot: "bg-[#e67e22]", label: "No Show", icon: <span className="text-[10px]">🚫</span> },
  }[status];

  return (
    <div className={`flex items-center gap-[4px] px-[8px] py-[3px] rounded-full ${config.bg}`}>
      {config.icon}
      <p className={`font-['Poppins:SemiBold',sans-serif] text-[11px] ${config.text}`}>{config.label}</p>
    </div>
  );
}

function AppointmentCard({
  appt,
  showActions,
  onCancel,
  onReschedule,
}: {
  appt: Appointment;
  showActions: boolean;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
}) {
  return (
    <div className="border border-[#ececec] rounded-[8px] px-[14px] pt-[14px] pb-[12px] bg-white">
      {/* Service + Status */}
      <div className="flex items-center gap-[10px] mb-[10px]">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">{appt.service}</p>
        <StatusBadge status={appt.status} />
      </div>

      {/* Branch */}
      <div className="flex items-center gap-[6px] mb-[6px]">
        <MapPin size={14} className="text-[#92929d] shrink-0" />
        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">{appt.branch}</p>
      </div>

      {/* Date + Customer */}
      <div className="flex items-center gap-[16px]">
        <div className="flex items-center gap-[6px]">
          <Calendar size={14} className="text-[#92929d] shrink-0" />
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">
            {appt.date}, {appt.time}
          </p>
        </div>
        <div className="flex items-center gap-[6px]">
          <User size={14} className="text-[#92929d] shrink-0" />
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{appt.customer}</p>
        </div>
      </div>

      {/* Action buttons */}
      {showActions && (
        <div className="flex items-center gap-[10px] mt-[12px]">
          <button
            onClick={() => onReschedule(appt.id)}
            className="flex-1 h-[36px] border border-[#dedede] rounded-[4px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15]">Reschedule</p>
          </button>
          <button
            onClick={() => onCancel(appt.id)}
            className="flex-1 h-[36px] bg-[#ef4444] rounded-[4px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white">Cancel</p>
          </button>
        </div>
      )}
    </div>
  );
}

export function AppointmentPage() {
  const navigate = useNavigate();
  const { appointments, cancelAppointment } = useAppContext();
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const handleCancel = (id: string) => setCancelTarget(id);
  const confirmCancel = () => {
    if (cancelTarget) cancelAppointment(cancelTarget);
    setCancelTarget(null);
  };
  const handleReschedule = (id: string) => {
    navigate("/appointment/book", { state: { rescheduleId: id } });
  };

  const ongoing = appointments.filter((a) => a.section === "ongoing");
  const upcoming = appointments.filter((a) => a.section === "upcoming");
  const pending = appointments.filter((a) => a.section === "pending");

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="h-[40px] shrink-0 flex items-center justify-between px-[16px] bg-white">
          <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)]">12:30</p>
          <div className="flex gap-[6px] items-center">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 9h2v3H1zM4.5 6h2v6h-2zM8 3h2v9H8zM11.5 0h2v12h-2zM15 1.5h2v10.5h-2z" fill="black" fillOpacity="0.9"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.4C5.6 2.4 3.5 3.4 2 5L0 3C2 1.1 4.8 0 8 0s6 1.1 8 3l-2 2C12.5 3.4 10.4 2.4 8 2.4zM8 6.8c-1.4 0-2.6.5-3.5 1.4L3 6.8C4.3 5.7 6.1 5 8 5s3.7.7 5 1.8l-1.5 1.4C10.6 7.3 9.4 6.8 8 6.8zM8 10l-2-2c.5-.5 1.2-.8 2-.8s1.5.3 2 .8L8 10z" fill="black" fillOpacity="0.9"/></svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="0" y="1" width="20" height="10" rx="2" stroke="black" strokeOpacity="0.35" strokeWidth="1"/><rect x="1" y="2" width="16" height="8" rx="1" fill="black" fillOpacity="0.9"/><path d="M21 4v4a2 2 0 0 0 0-4z" fill="black" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Page header */}
        <div className="flex items-center justify-between px-[16px] py-[12px] shrink-0">
          <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-[#1b1c15]">Appointment</p>
          <button
            onClick={() => navigate("/appointment-history")}
            className="flex items-center gap-[6px] px-[12px] py-[6px] border border-[#db43ae] rounded-[20px] cursor-pointer hover:bg-[#fdf0fa] transition-colors"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="#db43ae"/>
            </svg>
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#db43ae]">History</p>
          </button>
        </div>

        {/* Book Appointment button */}
        <div className="px-[16px] mb-[8px] shrink-0">
          <button
            onClick={() => navigate("/appointment/book")}
            className="flex items-center gap-[8px] px-[16px] py-[10px] bg-[#db43ae] rounded-[6px] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="1.8"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M12 14v4M10 16h4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Book Appointment</p>
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-[16px] pb-[20px]">
          {/* Ongoing */}
          {ongoing.length > 0 && (
            <div className="mb-[20px]">
              <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-[#1b1c15] mb-[10px]">Ongoing</p>
              <div className="flex flex-col gap-[10px]">
                {ongoing.map((a) => (
                  <AppointmentCard key={a.id} appt={a} showActions={false} onCancel={handleCancel} onReschedule={handleReschedule} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mb-[20px]">
              <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-[#1b1c15] mb-[10px]">Upcoming</p>
              <div className="flex flex-col gap-[10px]">
                {upcoming.map((a) => (
                  <AppointmentCard key={a.id} appt={a} showActions={true} onCancel={handleCancel} onReschedule={handleReschedule} />
                ))}
              </div>
            </div>
          )}

          {/* Pending Confirmation */}
          {pending.length > 0 && (
            <div className="mb-[20px]">
              <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-[#1b1c15] mb-[10px]">Pending Confirmation</p>
              <div className="flex flex-col gap-[10px]">
                {pending.map((a) => (
                  <AppointmentCard key={a.id} appt={a} showActions={true} onCancel={handleCancel} onReschedule={handleReschedule} />
                ))}
              </div>
            </div>
          )}

          {appointments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-[60px] gap-[16px]">
              <div className="size-[64px] rounded-full bg-[#fdf0fa] flex items-center justify-center">
                <Calendar size={32} className="text-[#db43ae]" strokeWidth={1.5} />
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#92929d] text-center">
                No appointments yet
              </p>
              <button
                onClick={() => navigate("/appointment/book")}
                className="bg-[#db43ae] px-[20px] py-[10px] rounded-[8px] cursor-pointer hover:opacity-90"
              >
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Book Now</p>
              </button>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <BottomNav active="book" />

        {/* Cancel confirm modal */}
        {cancelTarget && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center px-[24px]">
            <div className="bg-white rounded-[16px] p-[24px] w-full">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[8px]">Cancel Appointment?</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] mb-[24px]">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </p>
              <div className="flex gap-[12px]">
                <button
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 h-[44px] border border-[#dedede] rounded-[8px] cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15]">Keep</p>
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 h-[44px] bg-[#ef4444] rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Cancel</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gesture bar */}
        <div className="absolute bottom-[6px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}