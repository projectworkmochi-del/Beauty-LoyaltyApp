import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ChevronLeft } from "lucide-react";

export function SignupOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { phone?: string; isLogin?: boolean } | null;
  const phone = state?.phone ?? "+60123456789";
  const isLogin = state?.isLogin ?? false;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    setError("");
    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
    // Auto-verify when all 6 digits entered
    if (newOtp.every((d) => d) && val) {
      handleVerify(newOtp);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerify(newOtp);
    }
  };

  const handleVerify = (currentOtp = otp) => {
    const code = currentOtp.join("");
    if (code.length < 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    // Simulate verification (any 6-digit code works)
    setTimeout(() => {
      setLoading(false);
      if (isLogin) {
        navigate("/");
      } else {
        navigate("/signup-profile", { state: { phone } });
      }
    }, 1200);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setResendTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every((d) => d);

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
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <rect x="0" y="1" width="20" height="10" rx="2" stroke="black" strokeOpacity="0.35" strokeWidth="1" />
              <rect x="1" y="2" width="16" height="8" rx="1" fill="black" fillOpacity="0.9" />
              <path d="M21 4v4a2 2 0 0 0 0-4z" fill="black" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center px-[16px] py-[8px] shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="size-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} className="text-[#1b1c15]" />
          </button>
        </div>

        {/* Progress bar */}
        {!isLogin && (
          <div className="px-[24px] mb-[8px]">
            <div className="w-full bg-[#f0f0f0] rounded-full h-[4px]">
              <div className="bg-[#db43ae] h-[4px] rounded-full w-2/3 transition-all" />
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mt-[6px]">
              Step 2 of 3
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 px-[24px] pt-[24px] flex flex-col">
          {/* Icon */}
          <div className="size-[64px] rounded-[18px] bg-[#fdf0fa] flex items-center justify-center mb-[20px]">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <path d="M6 8h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" stroke="#db43ae" strokeWidth="1.8" />
              <path d="M4 10l12 9 12-9" stroke="#db43ae" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          <p className="font-['Poppins:Bold',sans-serif] text-[24px] text-[#1b1c15] leading-[30px] mb-[8px]">
            Verify Your Number
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] mb-[8px] leading-[20px]">
            We've sent a 6-digit OTP to
          </p>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#1b1c15] mb-[32px]">
            {phone}
          </p>

          {/* OTP boxes */}
          <div className="flex gap-[10px] mb-[12px]" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="flex-1 h-[56px] text-center rounded-[12px] border outline-none font-['Poppins:SemiBold',sans-serif] text-[22px] transition-all"
                style={{
                  borderColor: error
                    ? "#ef4444"
                    : digit
                    ? "#db43ae"
                    : "#e0e0e0",
                  background: digit ? "#fdf0fa" : "#fafafa",
                  color: "#1b1c15",
                }}
              />
            ))}
          </div>

          {error && (
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#ef4444] mb-[8px]">
              {error}
            </p>
          )}

          {/* Resend */}
          <div className="flex items-center gap-[4px] mb-[32px]">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">
              Didn't receive code?
            </p>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="cursor-pointer disabled:cursor-default"
            >
              <p
                className="font-['Poppins:SemiBold',sans-serif] text-[13px]"
                style={{ color: canResend ? "#db43ae" : "#c0c0c0" }}
              >
                {canResend ? "Resend" : `Resend in ${resendTimer}s`}
              </p>
            </button>
          </div>

          {/* Verify button */}
          <button
            onClick={() => handleVerify()}
            disabled={!isComplete || loading}
            className="w-full h-[52px] rounded-[12px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity disabled:cursor-not-allowed"
            style={{
              background: isComplete && !loading
                ? "linear-gradient(90deg, #db43ae 0%, #c72d98 100%)"
                : "#e0e0e0",
            }}
          >
            {loading ? (
              <div className="flex gap-[6px] items-center">
                <div className="size-[6px] bg-white rounded-full" style={{ animation: "pulse 0.8s ease-in-out 0s infinite" }} />
                <div className="size-[6px] bg-white rounded-full" style={{ animation: "pulse 0.8s ease-in-out 0.15s infinite" }} />
                <div className="size-[6px] bg-white rounded-full" style={{ animation: "pulse 0.8s ease-in-out 0.3s infinite" }} />
              </div>
            ) : (
              <p
                className="font-['Poppins:SemiBold',sans-serif] text-[15px]"
                style={{ color: isComplete ? "white" : "#999" }}
              >
                Verify OTP
              </p>
            )}
          </button>

          {/* Hint */}
          <div className="mt-[20px] bg-[#fdf0fa] rounded-[10px] p-[12px] flex items-start gap-[8px]">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="shrink-0 mt-[1px]">
              <circle cx="8" cy="8" r="7" stroke="#db43ae" strokeWidth="1.5" />
              <path d="M8 7v5" stroke="#db43ae" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="5" r="0.75" fill="#db43ae" />
            </svg>
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#db43ae] leading-[16px]">
              For demo purposes, any 6-digit code will work. In production, a real SMS would be sent.
            </p>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Gesture bar */}
        <div className="absolute bottom-[8px] left-0 right-0 flex justify-center pointer-events-none">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}