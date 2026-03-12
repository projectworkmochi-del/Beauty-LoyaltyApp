import { useState } from "react";
import { AppBar } from "../components/AppBar";
import { useAppContext } from "../context/AppContext";

type TabType = "all" | "earned" | "used" | "expired";

function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex-1 relative min-w-0">
      {isActive && (
        <div
          aria-hidden="true"
          className="absolute border-[#db43ae] border-b-2 border-solid inset-0 pointer-events-none"
        />
      )}
      <button
        onClick={onClick}
        className="flex items-center justify-center p-[16px] w-full hover:bg-gray-50 transition-colors cursor-pointer"
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

function HistoryItemRow({
  item,
}: {
  item: { id: string; title: string; description: string; date: string; points: number; type: "earned" | "used" | "expired" };
}) {
  const isPositive = item.points > 0;
  const isExpired = item.type === "expired";
  const pointsColor = isPositive ? "#47c363" : isExpired ? "#92929d" : "#1b1c15";
  const pointsPrefix = isPositive ? "+" : "";

  return (
    <>
      <div className="flex items-center justify-between w-full py-[4px]">
        <div className="flex flex-col gap-[5px] items-start leading-[16px] not-italic flex-1 mr-[12px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#1b1c15] text-[14px]">
            {item.title}
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#92929d] text-[12px]">
            {item.description}
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#92929d] text-[12px]">
            {item.date}
          </p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <p
            className={`leading-[18px] not-italic text-[14px] text-right whitespace-nowrap ${
              isPositive ? "font-['Poppins:Bold',sans-serif]" : "font-['Poppins:SemiBold',sans-serif]"
            }`}
            style={{ color: pointsColor }}
          >
            {pointsPrefix}
            {item.points}
          </p>
        </div>
      </div>
      <div className="h-px w-full opacity-10 bg-black" />
    </>
  );
}

export function PointsHistoryPage() {
  const { pointsHistory } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const filteredHistory =
    activeTab === "all"
      ? pointsHistory
      : pointsHistory.filter((item) => item.type === activeTab);

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div
        className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden"
        data-name="Points History"
      >
        {/* App Bar */}
        <AppBar title="Points History" />

        {/* Tabs */}
        <div className="absolute left-0 top-[96px] w-full flex items-center border-b border-gray-100 bg-white z-10">
          <TabButton label="All" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
          <TabButton label="Earned" isActive={activeTab === "earned"} onClick={() => setActiveTab("earned")} />
          <TabButton label="Used" isActive={activeTab === "used"} onClick={() => setActiveTab("used")} />
          <TabButton label="Expired" isActive={activeTab === "expired"} onClick={() => setActiveTab("expired")} />
        </div>

        {/* Transaction List */}
        <div className="absolute left-0 top-[162px] w-full bottom-[24px] overflow-y-auto">
          <div className="flex flex-col gap-[8px] items-start px-[16px] pt-[8px] pb-[32px]">
            {filteredHistory.length === 0 ? (
              <div className="w-full py-[60px] text-center">
                <div className="size-[56px] bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-[12px]">
                  <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                    <path d="M12 2L14.4 7.8L20.5 8.2L16 12.1L17.5 18L12 14.9L6.5 18L8 12.1L3.5 8.2L9.6 7.8L12 2Z" stroke="#92929d" strokeWidth="1.5" />
                  </svg>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#92929d]">
                  No points history found
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <HistoryItemRow key={item.id} item={item} />
              ))
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