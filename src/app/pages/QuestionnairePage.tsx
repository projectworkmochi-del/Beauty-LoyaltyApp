import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const TOTAL_QUESTIONS = 3;

const Q1_OPTIONS = [
  { id: "haircut", label: "Haircut & Styling", emoji: "✂️" },
  { id: "facial", label: "Facial & Skincare", emoji: "🧴" },
  { id: "nails", label: "Nails", emoji: "💅" },
  { id: "makeup", label: "Makeup", emoji: "💄" },
  { id: "body", label: "Body Treatments", emoji: "🛁" },
];

const Q2_OPTIONS = [
  { id: "weekly", label: "Once a week" },
  { id: "biweekly", label: "Once every 2 weeks" },
  { id: "monthly", label: "Once a month" },
  { id: "quarterly", label: "Every 2–3 months" },
  { id: "occasion", label: "Only when needed / special occasions" },
];

function ProgressBar({ step }: { step: number }) {
  const pct = (step / TOTAL_QUESTIONS) * 100;
  return (
    <div className="relative h-[20px] shrink-0">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#e2e2ea]" />
      <div
        className="absolute top-0 left-0 h-[2px] bg-[#db43ae] shadow-[0px_2px_8px_rgba(0,0,0,0.14)] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SelectionRow({
  label,
  emoji,
  selected,
  onClick,
}: {
  label: string;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-[10px] px-[14px] py-[14px] rounded-[4px] border cursor-pointer transition-all text-left"
      style={{
        borderColor: selected ? "#db43ae" : "#ececec",
        background: selected ? "rgba(219,67,174,0.08)" : "white",
      }}
    >
      {emoji && (
        <span className="text-[20px] shrink-0">{emoji}</span>
      )}
      <p
        className="flex-1 font-['Poppins:Regular',sans-serif] text-[13px] leading-[20px]"
        style={{ color: selected ? "#db43ae" : "#1d1b20" }}
      >
        {label}
      </p>
      <div
        className="size-[22px] rounded-full border flex items-center justify-center shrink-0 transition-all"
        style={{
          borderColor: selected ? "#db43ae" : "#b5b5be",
          background: selected ? "#db43ae" : "white",
        }}
      >
        {selected && <Check size={12} className="text-white" />}
      </div>
    </button>
  );
}

export function QuestionnairePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canNext = () => {
    if (step === 1) return !!q1Answer;
    if (step === 2) return !!q2Answer;
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_QUESTIONS) setStep(step + 1);
    else {
      setSubmitted(true);
      setTimeout(() => navigate("/me"), 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
        <div className="bg-white w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl flex flex-col items-center justify-center gap-[16px] px-[32px]">
          <div className="text-[72px] leading-none">🎉</div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-[#1b1c15] text-center">Thank you!</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center">
            Your responses help us serve you better. Enjoy your bonus benefit!
          </p>
          <div className="w-[60px] h-[4px] bg-[#db43ae] rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="h-[40px] shrink-0 flex items-center justify-between px-[16px] bg-white">
          <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)]">12:30</p>
          <div className="flex gap-[6px] items-center">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 9h2v3H1zM4.5 6h2v6h-2zM8 3h2v9H8zM11.5 0h2v12h-2z" fill="black" fillOpacity="0.9"/></svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="0" y="1" width="20" height="10" rx="2" stroke="black" strokeOpacity="0.35" strokeWidth="1"/><rect x="1" y="2" width="16" height="8" rx="1" fill="black" fillOpacity="0.9"/></svg>
          </div>
        </div>

        {/* Top bar with back + title */}
        <div className="flex items-center gap-[8px] h-[56px] px-[16px] shrink-0 border-b border-[#e0e0e0]">
          <button
            onClick={handleBack}
            className="size-[36px] flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <ChevronLeft size={22} className="text-[#1b1c15]" />
          </button>
          <p className="flex-1 font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15] text-center pr-[36px]">
            Help Us Serve You Better!
          </p>
        </div>

        {/* Pink progress bar (thin, below header) */}
        <ProgressBar step={step} />

        {/* Background gradient */}
        <div className="absolute top-0 left-0 right-0 h-[208px] bg-gradient-to-b from-[rgba(219,67,174,0.12)] to-transparent pointer-events-none" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-[16px] pt-[20px] pb-[100px]">
          {/* Question counter */}
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#868686] mb-[6px]">
            Questions {step} of {TOTAL_QUESTIONS}
          </p>

          {/* Question text */}
          <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1d1b20] leading-[24px] mb-[20px]">
            {step === 1 && "What services are you most interested in?"}
            {step === 2 && "2. How often do you visit a salon?"}
            {step === 3 && "Are you looking for packages or one-time services?"}
          </p>

          {/* Q1: Services */}
          {step === 1 && (
            <div className="flex flex-col gap-[10px]">
              {Q1_OPTIONS.map((opt) => (
                <SelectionRow
                  key={opt.id}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={q1Answer === opt.id}
                  onClick={() => setQ1Answer(opt.id)}
                />
              ))}
            </div>
          )}

          {/* Q2: Frequency */}
          {step === 2 && (
            <div className="flex flex-col gap-[10px]">
              {Q2_OPTIONS.map((opt) => (
                <SelectionRow
                  key={opt.id}
                  label={opt.label}
                  selected={q2Answer === opt.id}
                  onClick={() => setQ2Answer(opt.id)}
                />
              ))}
            </div>
          )}

          {/* Q3: Free text */}
          {step === 3 && (
            <div>
              <textarea
                value={q3Answer}
                onChange={(e) => setQ3Answer(e.target.value)}
                rows={6}
                placeholder="Share your thoughts..."
                className="w-full border border-[#d9d9d9] rounded-[4px] px-[14px] py-[12px] font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15] resize-none outline-none placeholder-[#aaa] focus:border-[#db43ae] transition-colors"
              />
            </div>
          )}
        </div>

        {/* Bottom nav bar with Back + Next/Submit */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] px-[16px] py-[16px] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-[4px] h-[40px] px-[14px] border border-[#db43ae] rounded-[4px] cursor-pointer hover:bg-[#fdf0fa] transition-colors"
            >
              <ChevronLeft size={16} className="text-[#db43ae]" />
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#db43ae]">Back</p>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="flex items-center gap-[4px] h-[40px] px-[16px] rounded-[4px] cursor-pointer transition-all disabled:cursor-not-allowed"
            style={{ background: canNext() ? "#db43ae" : "#e0e0e0" }}
          >
            <p
              className="font-['Poppins:SemiBold',sans-serif] text-[13px]"
              style={{ color: canNext() ? "white" : "#999" }}
            >
              {step === TOTAL_QUESTIONS ? "Submit" : "Next"}
            </p>
            {step < TOTAL_QUESTIONS && (
              <ChevronRight size={16} className={canNext() ? "text-white" : "text-[#999]"} />
            )}
          </button>
        </div>

        {/* Gesture bar */}
        <div className="absolute bottom-[6px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}