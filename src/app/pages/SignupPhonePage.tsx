import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronDown } from "lucide-react";

const countryCodes = [
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
];

export function SignupPhonePage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [error, setError] = useState("");

  const isValid = phone.replace(/\D/g, "").length >= 9;

  const handleContinue = () => {
    if (!isValid) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    navigate("/signup-otp", {
      state: {
        phone: `${selectedCountry.code}${phone.replace(/\D/g, "")}`,
        isLogin: false,
      },
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
        <div className="px-[24px] mb-[8px]">
          <div className="w-full bg-[#f0f0f0] rounded-full h-[4px]">
            <div className="bg-[#db43ae] h-[4px] rounded-full w-1/3 transition-all" />
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mt-[6px]">
            Step 1 of 3
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-[24px] pt-[16px] pb-[40px]">
          {/* Icon */}
          <div className="size-[64px] rounded-[18px] bg-[#fdf0fa] flex items-center justify-center mb-[20px]">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <rect x="4" y="6" width="24" height="20" rx="3" stroke="#db43ae" strokeWidth="1.8" />
              <path d="M4 11h24" stroke="#db43ae" strokeWidth="1.8" />
              <circle cx="10" cy="18" r="2" fill="#db43ae" />
              <path d="M14 18h10" stroke="#db43ae" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M14 22h7" stroke="#db43ae" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          <p className="font-['Poppins:Bold',sans-serif] text-[24px] text-[#1b1c15] leading-[30px] mb-[8px]">
            Sign Up
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] mb-[32px] leading-[20px]">
            Enter your mobile number. We'll send you a one-time verification code.
          </p>

          {/* Phone input label */}
          <label className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#92929d] block mb-[8px]">
            Mobile Number
          </label>

          {/* Phone input row */}
          <div
            className="flex items-center border rounded-[12px] overflow-hidden mb-[8px]"
            style={{
              borderColor: error ? "#ef4444" : phone ? "#db43ae" : "#e0e0e0",
              background: "#fafafa",
            }}
          >
            {/* Country picker */}
            <button
              onClick={() => setShowCountryPicker(true)}
              className="flex items-center gap-[6px] px-[14px] py-[16px] border-r border-[#e0e0e0] cursor-pointer shrink-0 hover:bg-gray-100 transition-colors"
            >
              <span className="text-[20px]">{selectedCountry.flag}</span>
              <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#1b1c15]">
                {selectedCountry.code}
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
              autoFocus
              className="flex-1 px-[14px] py-[16px] outline-none bg-transparent font-['Poppins:Regular',sans-serif] text-[15px] text-[#1b1c15] placeholder-[#c8c8d0]"
            />
          </div>

          {error && (
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#ef4444] mb-[8px]">
              {error}
            </p>
          )}

          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mb-[32px] leading-[16px]">
            By signing up, you agree to our{" "}
            <span className="text-[#db43ae]">Terms of Service</span> and{" "}
            <span className="text-[#db43ae]">Privacy Policy</span>
          </p>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full h-[52px] rounded-[12px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity mb-[20px]"
            style={{
              background: isValid
                ? "linear-gradient(90deg, #db43ae 0%, #c72d98 100%)"
                : "#e0e0e0",
            }}
          >
            <p
              className="font-['Poppins:SemiBold',sans-serif] text-[15px]"
              style={{ color: isValid ? "white" : "#999" }}
            >
              Continue
            </p>
          </button>

          {/* Already have account */}
          <div className="flex items-center justify-center gap-[4px]">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">
              Already have an account?
            </p>
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer"
            >
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#db43ae]">
                Sign In
              </p>
            </button>
          </div>
        </div>

        {/* Country code picker modal */}
        {showCountryPicker && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="w-full bg-white rounded-t-[24px] max-h-[480px] flex flex-col">
              <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f0f0f0]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">
                  Select Country
                </p>
                <button
                  onClick={() => setShowCountryPicker(false)}
                  className="cursor-pointer"
                >
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#db43ae]">Done</p>
                </button>
              </div>
              <div className="overflow-y-auto">
                {countryCodes.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowCountryPicker(false);
                    }}
                    className={`w-full flex items-center gap-[12px] px-[20px] py-[14px] cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedCountry.code === country.code ? "bg-[#fdf0fa]" : ""
                    }`}
                  >
                    <span className="text-[24px]">{country.flag}</span>
                    <span className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] flex-1 text-left">
                      {country.name}
                    </span>
                    <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#92929d]">
                      {country.code}
                    </span>
                    {selectedCountry.code === country.code && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6.5 11.5L13 5" stroke="#db43ae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gesture bar */}
        <div className="absolute bottom-[8px] left-0 right-0 flex justify-center pointer-events-none">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}