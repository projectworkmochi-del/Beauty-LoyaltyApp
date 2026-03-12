import { useNavigate } from "react-router";
import { AppBar } from "../components/AppBar";
import { ChevronRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const howToEarn = [
  { id: 1, icon: "📅", title: "Daily Check-In", points: "+5 pts", desc: "Check in every day", action: "checkin" },
  { id: 2, icon: "🛒", title: "Make a Purchase", points: "+1 pt per RM1", desc: "Earn on every purchase", action: null },
  { id: 3, icon: "👥", title: "Refer a Friend", points: "+50 pts", desc: "For each successful referral", action: null },
  { id: 4, icon: "⭐", title: "Write a Review", points: "+10 pts", desc: "Review any service or product", action: null },
];

export function PointsPage() {
  const navigate = useNavigate();
  const { points, pointsHistory, checkedInToday, doCheckIn } = useAppContext();

  const thisMonthPoints = pointsHistory
    .filter((h) => h.type === "earned" && h.date.startsWith("2025-08"))
    .reduce((s, h) => s + h.points, 0);

  const allTimePoints = pointsHistory
    .filter((h) => h.type === "earned")
    .reduce((s, h) => s + h.points, 0);

  const expiringPoints = pointsHistory
    .filter((h) => h.type === "expired")
    .reduce((s, h) => s + Math.abs(h.points), 0);

  const recentItems = pointsHistory.slice(0, 3);

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div
        className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden"
        data-name="Points"
      >
        {/* App Bar */}
        <AppBar title="Points" />

        {/* Scrollable Content */}
        <div className="absolute top-[96px] left-0 right-0 bottom-[24px] overflow-y-auto">
          {/* Points Balance Card */}
          <div className="bg-gradient-to-br from-[#db43ae] to-[#e870cc] mx-[16px] mt-[16px] rounded-[16px] p-[24px] text-center relative overflow-hidden">
            <div className="absolute -top-[30px] -right-[30px] size-[100px] bg-white/10 rounded-full" />
            <div className="absolute -bottom-[20px] -left-[20px] size-[80px] bg-white/10 rounded-full" />

            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/80 mb-[8px]">
              My Points Balance
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[48px] text-white leading-none mb-[4px]">
              {points}
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/80 mb-[20px]">
              points
            </p>
            <div className="flex items-center justify-center gap-[16px]">
              <div className="text-center">
                <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">{thisMonthPoints}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/70">This Month</p>
              </div>
              <div className="w-px h-[30px] bg-white/30" />
              <div className="text-center">
                <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">{allTimePoints}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/70">All Time</p>
              </div>
              <div className="w-px h-[30px] bg-white/30" />
              <div className="text-center">
                <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">{expiringPoints}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/70">Expiring</p>
              </div>
            </div>
          </div>

          {/* Redeem Points CTA */}
          <div className="mx-[16px] mt-[12px] bg-[#fdf0fa] rounded-[12px] p-[16px] flex items-center justify-between">
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">
                Redeem Your Points
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">
                Use points on your next purchase
              </p>
            </div>
            <button
              onClick={() => navigate("/rewards")}
              className="bg-[#db43ae] rounded-[8px] px-[16px] py-[8px] cursor-pointer hover:opacity-90 transition-opacity"
            >
              <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">Redeem</p>
            </button>
          </div>

          {/* How to Earn */}
          <div className="px-[16px] mt-[20px]">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] mb-[12px]">
              How to Earn Points
            </p>
            <div className="grid grid-cols-2 gap-[10px]">
              {howToEarn.map((item) => (
                <div
                  key={item.id}
                  className={`bg-gray-50 rounded-[10px] p-[12px] ${item.action === "checkin" ? "cursor-pointer active:opacity-80" : ""}`}
                  onClick={item.action === "checkin" ? doCheckIn : undefined}
                >
                  <p className="text-[24px] mb-[6px]">{item.icon}</p>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#1b1c15] mb-[2px]">
                    {item.title}
                    {item.action === "checkin" && checkedInToday ? " ✓" : ""}
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[4px]">
                    {item.action === "checkin" && checkedInToday ? "Checked in today!" : item.desc}
                  </p>
                  <p className="font-['Poppins:Bold',sans-serif] text-[12px] text-[#db43ae]">
                    {item.points}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="px-[16px] mt-[20px] mb-[32px]">
            <div className="flex items-center justify-between mb-[12px]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">
                Recent Activity
              </p>
              <button
                onClick={() => navigate("/points-history")}
                className="flex items-center gap-[2px] cursor-pointer hover:opacity-70 transition-opacity"
              >
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">View All</p>
                <ChevronRight size={14} className="text-[#db43ae]" />
              </button>
            </div>

            {recentItems.length === 0 ? (
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#92929d] text-center py-[20px]">
                No activity yet
              </p>
            ) : (
              recentItems.map((item) => {
                const isPositive = item.points > 0;
                const pointsColor = item.type === "earned" ? "#47c363" : "#1b1c15";
                const pointsPrefix = isPositive ? "+" : "";
                return (
                  <div key={item.id}>
                    <div className="flex items-center justify-between py-[10px]">
                      <div className="flex-1 mr-[12px]">
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15]">{item.title}</p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{item.description}</p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d]">{item.date}</p>
                      </div>
                      <p
                        className="font-['Poppins:SemiBold',sans-serif] text-[14px] shrink-0"
                        style={{ color: pointsColor }}
                      >
                        {pointsPrefix}{item.points}
                      </p>
                    </div>
                    <div className="h-px bg-black opacity-5" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Gesture bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[24px] bg-white flex items-center justify-center">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}