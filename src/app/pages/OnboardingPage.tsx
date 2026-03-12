import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1676149037576-9eaa9192f60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWF1dHklMjBzYWxvbiUyMHBpbmslMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzczMTYyODE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Earn Points Every Visit",
    description:
      "Book services, buy products and earn loyalty points that unlock amazing rewards.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Redeem Exclusive Rewards",
    description:
      "Use your points to redeem vouchers, free services and special member-only offers.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Book in One Tap",
    description:
      "Schedule appointments anytime, anywhere with our fast and easy booking system.",
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate("/login");
    }
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">
        {/* Skip button */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-[52px] right-[20px] z-20 cursor-pointer"
        >
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">Skip</p>
        </button>

        {/* Image section */}
        <div className="relative h-[460px] overflow-hidden shrink-0">
          <ImageWithFallback
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 40%, white 100%)" }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center px-[32px] pt-[8px]">
          {/* Dots indicator */}
          <div className="flex gap-[8px] mb-[24px]">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="cursor-pointer"
              >
                <div
                  className="h-[6px] rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "24px" : "6px",
                    background: i === current ? "#db43ae" : "#e0e0e0",
                  }}
                />
              </button>
            ))}
          </div>

          <p className="font-['Poppins:Bold',sans-serif] text-[22px] text-[#1b1c15] text-center leading-[28px] mb-[12px]">
            {slide.title}
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center leading-[20px] px-[8px]">
            {slide.description}
          </p>

          {/* CTA buttons */}
          <div className="mt-auto mb-[40px] w-full flex flex-col gap-[12px]">
            <button
              onClick={handleNext}
              className="w-full h-[52px] rounded-[12px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(90deg, #db43ae 0%, #c72d98 100%)" }}
            >
              <p className="font-['Poppins:SemiBold',sans-serif] text-white text-[15px]">
                {current === slides.length - 1 ? "Get Started" : "Next"}
              </p>
            </button>

            {current === slides.length - 1 && (
              <button
                onClick={() => navigate("/login")}
                className="w-full h-[52px] rounded-[12px] border border-[#dedede] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-[#1b1c15]">
                  I already have an account
                </p>
              </button>
            )}
          </div>
        </div>

        {/* Gesture bar */}
        <div className="absolute bottom-[8px] left-0 right-0 flex justify-center pointer-events-none">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}