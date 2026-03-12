import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ChevronLeft, Camera } from "lucide-react";

const genders = ["Female", "Male", "Prefer not to say"];
const referralSources = [
  "Friend / Family",
  "Instagram",
  "TikTok",
  "Google Search",
  "Walk-in",
  "Others",
];

export function SignupProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { phone?: string } | null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [referral, setReferral] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDone = () => {
    if (!validate()) return;
    navigate("/");
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
        <div className="flex items-center justify-between px-[16px] py-[8px] shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="size-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} className="text-[#1b1c15]" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">Skip</p>
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-[24px] mb-[8px]">
          <div className="w-full bg-[#f0f0f0] rounded-full h-[4px]">
            <div className="bg-[#db43ae] h-[4px] rounded-full w-full transition-all" />
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mt-[6px]">
            Step 3 of 3 — Almost done!
          </p>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-[24px] pt-[16px] pb-[100px]">
          {/* Avatar picker */}
          <div className="flex flex-col items-center mb-[24px]">
            <div className="relative">
              <div className="size-[80px] rounded-full bg-gradient-to-br from-[#f8d6f1] to-[#fdf0fa] flex items-center justify-center">
                <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                  <circle cx="20" cy="16" r="8" stroke="#db43ae" strokeWidth="2" />
                  <path d="M6 38c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#db43ae" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 size-[26px] bg-[#db43ae] rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 shadow-[0px_2px_8px_rgba(219,67,174,0.4)]">
                <Camera size={13} className="text-white" />
              </div>
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] mt-[8px]">
              Add profile photo
            </p>
          </div>

          <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-[#1b1c15] mb-[4px]">
            Complete Your Profile
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#92929d] mb-[24px]">
            Tell us a little about yourself to personalise your experience
          </p>

          {/* Phone (read-only) */}
          <div className="mb-[16px]">
            <label className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#92929d] block mb-[6px]">
              Phone Number
            </label>
            <div className="w-full px-[14px] py-[14px] bg-[#f8f8f8] border border-[#e0e0e0] rounded-[12px]">
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#92929d]">
                {state?.phone ?? "+60 12-345 6789"}
              </p>
            </div>
          </div>

          {/* Full name */}
          <div className="mb-[16px]">
            <label className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#92929d] block mb-[6px]">
              Full Name <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); }}
              placeholder="e.g. Joanne Chan"
              className="w-full px-[14px] py-[14px] bg-[#fafafa] border rounded-[12px] outline-none font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] placeholder-[#c8c8d0] transition-all"
              style={{ borderColor: errors.name ? "#ef4444" : name ? "#db43ae" : "#e0e0e0" }}
            />
            {errors.name && (
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#ef4444] mt-[4px]">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-[16px]">
            <label className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#92929d] block mb-[6px]">
              Email Address <span className="text-[#92929d] font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); }}
              placeholder="you@example.com"
              className="w-full px-[14px] py-[14px] bg-[#fafafa] border rounded-[12px] outline-none font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] placeholder-[#c8c8d0] transition-all"
              style={{ borderColor: errors.email ? "#ef4444" : email ? "#db43ae" : "#e0e0e0" }}
            />
            {errors.email && (
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#ef4444] mt-[4px]">
                {errors.email}
              </p>
            )}
          </div>

          {/* Date of birth */}
          <div className="mb-[16px]">
            <label className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#92929d] block mb-[6px]">
              Date of Birth <span className="text-[#92929d] font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-[14px] py-[14px] bg-[#fafafa] border rounded-[12px] outline-none font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] transition-all"
              style={{ borderColor: dob ? "#db43ae" : "#e0e0e0" }}
            />
          </div>

          {/* Gender */}
          <div className="mb-[16px]">
            <label className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#92929d] block mb-[8px]">
              Gender <span className="text-[#92929d] font-normal">(optional)</span>
            </label>
            <div className="flex gap-[8px] flex-wrap">
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g === gender ? "" : g)}
                  className="px-[14px] py-[8px] rounded-[20px] border cursor-pointer transition-all"
                  style={{
                    borderColor: gender === g ? "#db43ae" : "#e0e0e0",
                    background: gender === g ? "#fdf0fa" : "white",
                    color: gender === g ? "#db43ae" : "#92929d",
                  }}
                >
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px]">{g}</p>
                </button>
              ))}
            </div>
          </div>

          {/* How did you hear */}
          <div className="mb-[16px]">
            <label className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#92929d] block mb-[8px]">
              How did you hear about us? <span className="text-[#92929d] font-normal">(optional)</span>
            </label>
            <div className="flex gap-[8px] flex-wrap">
              {referralSources.map((src) => (
                <button
                  key={src}
                  onClick={() => setReferral(src === referral ? "" : src)}
                  className="px-[12px] py-[7px] rounded-[20px] border cursor-pointer transition-all"
                  style={{
                    borderColor: referral === src ? "#db43ae" : "#e0e0e0",
                    background: referral === src ? "#fdf0fa" : "white",
                    color: referral === src ? "#db43ae" : "#92929d",
                  }}
                >
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px]">{src}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Referral code */}
          <div className="mb-[24px]">
            <label className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#92929d] block mb-[6px]">
              Referral Code <span className="text-[#92929d] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="e.g. JOANNE2026"
              className="w-full px-[14px] py-[14px] bg-[#fafafa] border rounded-[12px] outline-none font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15] placeholder-[#c8c8d0] tracking-widest transition-all"
              style={{ borderColor: referralCode ? "#db43ae" : "#e0e0e0" }}
            />
          </div>
        </div>

        {/* Sticky bottom button */}
        <div className="absolute bottom-[20px] left-[24px] right-[24px] z-10">
          <button
            onClick={handleDone}
            className="w-full h-[52px] rounded-[12px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-[0px_4px_20px_rgba(219,67,174,0.3)]"
            style={{ background: "linear-gradient(90deg, #db43ae 0%, #c72d98 100%)" }}
          >
            <p className="font-['Poppins:SemiBold',sans-serif] text-white text-[15px]">
              Complete Registration
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