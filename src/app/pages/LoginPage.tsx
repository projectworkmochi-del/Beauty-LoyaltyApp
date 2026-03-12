import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [countryCode] = useState("+60");
  const [error, setError] = useState("");

  const handleContinue = () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 9) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    navigate("/signup-otp", {
      state: { phone: `${countryCode}${cleaned}`, isLogin: true },
    });
  };

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="h-[44px] shrink-0 flex items-center justify-between px-[20px]">
          <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)]">12:30</p>
          <div className="flex gap-[6px] items-center">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d="M1 9h2v3H1zM4.5 6h2v6h-2zM8 3h2v9H8zM11.5 0h2v12h-2zM15 1.5h2v10.5h-2z" fill="black" fillOpacity="0.9" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 2.4C5.6 2.4 3.5 3.4 2 5L0 3C2 1.1 4.8 0 8 0s6 1.1 8 3l-2 2C12.5 3.4 10.4 2.4 8 2.4zM8 6.8c-1.4 0-2.6.5-3.5 1.4L3 6.8C4.3 5.7 6.1 5 8 5s3.7.7 5 1.8l-1.5 1.4C10.6 7.3 9.4 6.8 8 6.8zM8 10l-2-2c.5-.5 1.2-.8 2-.8s1.5.3 2 .8L8 10z" fill="black" fillOpacity="0.9" />
            </svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <rect x="0" y="1" width="20" height="10" rx="2" stroke="black" strokeOpacity="0.35" strokeWidth="1" />
              <rect x="1" y="2" width="16" height="8" rx="1" fill="black" fillOpacity="0.9" />
              <path d="M21 4v4a2 2 0 0 0 0-4z" fill="black" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Top gradient decoration */}
        <div
          className="absolute top-0 left-0 right-0 h-[280px] z-0"
          style={{
            background: "linear-gradient(160deg, #db43ae 0%, #e870cc 50%, #ffffff 100%)",
          }}
        />

        {/* Logo / brand */}
        <div className="relative z-10 flex flex-col items-center mt-[48px] mb-[32px]">
          <div className="size-[72px] bg-white rounded-[20px] flex items-center justify-center shadow-[0px_8px_32px_rgba(219,67,174,0.25)] mb-[12px]">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
              <path d="M20 2C20 2 8 10 8 20a12 12 0 0 0 24 0C32 10 20 2 20 2Z" fill="#db43ae" />
              <path d="M20 10C20 10 14 14 14 20a6 6 0 0 0 12 0C26 14 20 10 20 10Z" fill="white" opacity="0.9" />
            </svg>
          </div>
          <p className="font-['Poppins:Bold',sans-serif] text-white text-[26px] leading-[32px]">
            Welcome Back
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-white/80 text-[13px] leading-[18px] mt-[4px]">
            Sign in to your Luxe Locks account
          </p>
        </div>

        {/* Card */}
        <div className="relative z-10 flex-1 bg-white rounded-t-[28px] px-[24px] pt-[32px] flex flex-col shadow-[0px_-4px_24px_rgba(0,0,0,0.08)]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1b1c15] mb-[6px]">
            Enter your phone number
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] mb-[24px]">
            We'll send you an OTP to verify your account
          </p>

          {/* Phone input */}
          <div className="mb-[8px]">
            <label className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#92929d] mb-[8px] block">
              Phone Number
            </label>
            <div
              className="flex items-center border rounded-[12px] overflow-hidden"
              style={{
                borderColor: error ? "#ef4444" : phone ? "#db43ae" : "#e0e0e0",
                background: "#fafafa",
              }}
            >
              {/* Country code */}
              <button className="flex items-center gap-[4px] px-[14px] py-[14px] border-r border-[#e0e0e0] cursor-pointer shrink-0">
                <span className="text-[18px]">🇲🇾</span>
                <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#1b1c15]">
                  {countryCode}
                </span>
                <ChevronDown size={14} className="text-[#92929d]" />
              </button>
              {/* Number input */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                placeholder="12-345 6789"
                className="flex-1 px-[14px] py-[14px] outline-none bg-transparent font-['Poppins:Regular',sans-serif] text-[15px] text-[#1b1c15] placeholder-[#c8c8d0]"
              />
            </div>
            {error && (
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#ef4444] mt-[6px]">
                {error}
              </p>
            )}
          </div>

          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[28px]">
            By continuing, you agree to our{" "}
            <span className="text-[#db43ae]">Terms of Service</span> &{" "}
            <span className="text-[#db43ae]">Privacy Policy</span>
          </p>

          {/* Get OTP button */}
          <button
            onClick={handleContinue}
            className="w-full h-[52px] rounded-[12px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity mb-[16px]"
            style={{
              background:
                phone.replace(/\D/g, "").length >= 9
                  ? "linear-gradient(90deg, #db43ae 0%, #c72d98 100%)"
                  : "#e0e0e0",
            }}
          >
            <p
              className="font-['Poppins:SemiBold',sans-serif] text-[15px]"
              style={{ color: phone.replace(/\D/g, "").length >= 9 ? "white" : "#999" }}
            >
              Get OTP
            </p>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-[12px] mb-[16px]">
            <div className="flex-1 h-[1px] bg-[#f0f0f0]" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#c0c0c0]">or</p>
            <div className="flex-1 h-[1px] bg-[#f0f0f0]" />
          </div>

          {/* Sign up */}
          <button
            onClick={() => navigate("/signup-phone")}
            className="w-full h-[52px] rounded-[12px] border border-[#dedede] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-[#1b1c15]">
              Create new account
            </p>
          </button>
        </div>

        {/* Gesture bar */}
        <div className="absolute bottom-[8px] left-0 right-0 flex justify-center pointer-events-none">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}