import { useEffect } from "react";
import { useNavigate } from "react-router";

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div
        className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(160deg, #db43ae 0%, #c72d98 50%, #9c1a74 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-60px] right-[-60px] size-[220px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-80px] left-[-40px] size-[260px] rounded-full bg-white/10" />
        <div className="absolute top-[30%] left-[-80px] size-[160px] rounded-full bg-white/5" />

        {/* Logo mark */}
        <div className="relative z-10 flex flex-col items-center gap-[16px]">
          <div className="size-[96px] bg-white rounded-[28px] flex items-center justify-center shadow-[0px_16px_48px_rgba(0,0,0,0.2)]">
            <svg width="52" height="52" fill="none" viewBox="0 0 52 52">
              <path
                d="M26 4C26 4 10 16 10 28a16 16 0 0 0 32 0C42 16 26 4 26 4Z"
                fill="#db43ae"
              />
              <path
                d="M26 14C26 14 18 20 18 28a8 8 0 0 0 16 0C34 20 26 14 26 14Z"
                fill="white"
                opacity="0.9"
              />
            </svg>
          </div>

          <div className="text-center">
            <p className="font-['Poppins:Bold',sans-serif] text-white text-[32px] leading-[38px] tracking-[-0.5px]">
              Luxe Locks
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-white/70 text-[14px] leading-[20px] mt-[4px]">
              Hair Studio & Loyalty
            </p>
          </div>

          {/* Tagline */}
          <p className="font-['Poppins:Regular',sans-serif] text-white/60 text-[12px] text-center mt-[8px] px-[40px] leading-[18px]">
            Earn points, redeem rewards &amp; book appointments effortlessly
          </p>

          {/* Loading dots */}
          <div className="flex gap-[8px] mt-[32px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-[8px] rounded-full bg-white/60"
                style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-[40px] flex flex-col items-center gap-[6px]">
          <p className="font-['Poppins:Regular',sans-serif] text-white/40 text-[10px] text-center">
            © 2026 Luxe Locks. All rights reserved.
          </p>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}