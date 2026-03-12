import { useNavigate } from "react-router";
import { Home, Clock, Gift, User } from "lucide-react";

type ActiveTab = "home" | "book" | "rewards" | "history" | "profile";

interface BottomNavProps {
  active?: ActiveTab;
}

export function BottomNav({ active = "home" }: BottomNavProps) {
  const navigate = useNavigate();

  const navItems = [
    { key: "home" as ActiveTab, label: "Home", icon: <Home size={22} strokeWidth={active === "home" ? 2.5 : 1.5} />, path: "/" },
    { key: "rewards" as ActiveTab, label: "Rewards", icon: <Gift size={22} strokeWidth={1.5} />, path: "/rewards" },
    { key: "history" as ActiveTab, label: "History", icon: <Clock size={22} strokeWidth={1.5} />, path: "/history" },
    { key: "profile" as ActiveTab, label: "Profile", icon: <User size={22} strokeWidth={active === "profile" ? 2.5 : 1.5} />, path: "/profile" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-[#e8e8e8] shadow-[0px_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-start h-[58px]">
        {/* Home */}
        <button
          onClick={() => navigate("/")}
          className="flex-1 flex flex-col items-center justify-center h-full gap-[3px] cursor-pointer"
        >
          <Home size={22} strokeWidth={active === "home" ? 2.5 : 1.5} className={active === "home" ? "text-[#db43ae]" : "text-[#b0b0b0]"} />
          <p className={`font-['Poppins:SemiBold',sans-serif] text-[10px] leading-[14px] ${active === "home" ? "text-[#db43ae]" : "text-[#b0b0b0]"}`}>Home</p>
        </button>

        {/* Rewards */}
        <button
          onClick={() => navigate("/rewards")}
          className="flex-1 flex flex-col items-center justify-center h-full gap-[3px] cursor-pointer"
        >
          <Gift size={22} strokeWidth={1.5} className={active === "rewards" ? "text-[#db43ae]" : "text-[#b0b0b0]"} />
          <p className={`font-['Poppins:SemiBold',sans-serif] text-[10px] leading-[14px] ${active === "rewards" ? "text-[#db43ae]" : "text-[#b0b0b0]"}`}>Rewards</p>
        </button>

        {/* Book — center FAB */}
        <button
          onClick={() => navigate("/appointment/book")}
          className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer relative"
        >
          <div
            className="absolute -top-[20px] rounded-full size-[54px] flex items-center justify-center shadow-[0px_6px_24px_rgba(219,67,174,0.35)] transition-transform hover:scale-105"
            style={{ background: active === "book" ? "#c72d98" : "linear-gradient(135deg, #db43ae, #e870cc)" }}
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 30 30">
              <path d="M22.5 3.75h-1.25V2.5a1.25 1.25 0 0 0-2.5 0v1.25h-7.5V2.5a1.25 1.25 0 0 0-2.5 0v1.25H7.5A3.75 3.75 0 0 0 3.75 7.5v17.5A3.75 3.75 0 0 0 7.5 28.75h15a3.75 3.75 0 0 0 3.75-3.75V7.5A3.75 3.75 0 0 0 22.5 3.75Zm1.25 21.25a1.25 1.25 0 0 1-1.25 1.25H7.5a1.25 1.25 0 0 1-1.25-1.25V13.75h17.5V25Zm0-13.75H6.25V7.5A1.25 1.25 0 0 1 7.5 6.25h1.25V7.5a1.25 1.25 0 0 0 2.5 0V6.25h7.5V7.5a1.25 1.25 0 0 0 2.5 0V6.25h1.25A1.25 1.25 0 0 1 23.75 7.5v3.75Z" fill="white"/>
            </svg>
          </div>
          <p className={`font-['Poppins:SemiBold',sans-serif] text-[10px] leading-[14px] mt-[32px] ${active === "book" ? "text-[#db43ae]" : "text-[#b0b0b0]"}`}>
            Book
          </p>
        </button>

        {/* History */}
        <button
          onClick={() => navigate("/history")}
          className="flex-1 flex flex-col items-center justify-center h-full gap-[3px] cursor-pointer"
        >
          <Clock size={22} strokeWidth={1.5} className={active === "history" ? "text-[#db43ae]" : "text-[#b0b0b0]"} />
          <p className={`font-['Poppins:SemiBold',sans-serif] text-[10px] leading-[14px] ${active === "history" ? "text-[#db43ae]" : "text-[#b0b0b0]"}`}>History</p>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className="flex-1 flex flex-col items-center justify-center h-full gap-[3px] cursor-pointer"
        >
          <User size={22} strokeWidth={active === "profile" ? 2.5 : 1.5} className={active === "profile" ? "text-[#db43ae]" : "text-[#b0b0b0]"} />
          <p className={`font-['Poppins:SemiBold',sans-serif] text-[10px] leading-[14px] ${active === "profile" ? "text-[#db43ae]" : "text-[#b0b0b0]"}`}>Profile</p>
        </button>
      </div>
    </div>
  );
}
