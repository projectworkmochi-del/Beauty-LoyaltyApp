import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Heart, Share2, ChevronLeft, Star, ShoppingCart, Tag, X } from "lucide-react";
import svgPathsProduct from "../../imports/svg-rso0tpw68w";
import imgProduct from "figma:asset/9d6accb511ecb75e972b489726907e765cb42944.png";

const treatmentTypes = ["Laser", "Facial", "Combo"];
const skinTypes = ["Normal Skin", "Dry Skin", "Oily Skin"];

interface AppliedVoucher {
  id: string;
  title: string;
  discount: string;
  type: "discount" | "free" | "cashback";
  description: string;
}

interface ProductPageProps {
  productId?: string;
}

export function ProductPage(_props: ProductPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    hasImage?: boolean;
    productName?: string;
    price?: string;
    originalPrice?: string;
    appliedVoucher?: AppliedVoucher;
    fromRewards?: boolean;
  } | null;

  const hasImage = state?.hasImage !== false;
  const productName = state?.productName ?? "Package 1 – 3 Laser Sessions + 1 Signature Facial";
  const price = state?.price ?? "RM 188.90";
  const originalPrice = state?.originalPrice ?? "RM 398.90";
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(
    state?.appliedVoucher ?? null
  );

  const [qty, setQty] = useState(1);
  const [selectedTreatment, setSelectedTreatment] = useState("Laser");
  const [selectedSkin, setSelectedSkin] = useState("Dry Skin");
  const [isFavourite, setIsFavourite] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  // Compute discounted price if a voucher is applied
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
  const discountedPrice = (() => {
    if (!appliedVoucher) return null;
    const d = appliedVoucher.discount;
    if (d.includes("%")) {
      const pct = parseFloat(d);
      return numericPrice * (1 - pct / 100);
    }
    if (d.startsWith("RM")) {
      const off = parseFloat(d.replace(/[^0-9.]/g, ""));
      return Math.max(0, numericPrice - off);
    }
    return null;
  })();

  const handleAddToCart = () => {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
    navigate("/shop", { state: { cartUpdated: true, productName } });
  };

  const handleBuyNow = () => {
    navigate("/checkout", { state: { appliedVoucher, finalPrice: discountedPrice ?? numericPrice } });
  };

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-[40px] z-30 flex items-center justify-between px-[12px]">
          <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)]">12:30</p>
          <div className="flex gap-[6px] items-center">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d={svgPathsProduct.p30908d00} fill="black" fillOpacity="0.9" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d={svgPathsProduct.pee63b00} fill="black" fillOpacity="0.9" />
            </svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <path d={svgPathsProduct.p354c5080} fill="black" fillOpacity="0.9" opacity="0.4" />
              <rect fill="black" fillOpacity="0.9" height="7.76471" rx="1.33333" width="17.7573" x="1.97303" y="2.11765" />
            </svg>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="absolute inset-0 bottom-[115px] top-[40px] overflow-y-auto">
          {/* Product Image / Header area */}
          <div className="relative h-[356px] overflow-hidden">
            {/* Pink header bar */}
            <div className="absolute top-0 left-0 right-0 h-[47px] bg-[#db43ae] z-10 flex items-center justify-between px-[4px]">
              <button
                onClick={() => navigate(-1)}
                className="size-[34px] flex items-center justify-center cursor-pointer hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <div className="flex items-center gap-[4px]">
                <button
                  onClick={() => setIsFavourite(!isFavourite)}
                  className="size-[34px] flex items-center justify-center cursor-pointer hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 20.33 20.33">
                    <path
                      d={svgPathsProduct.p172b4e80}
                      fill={isFavourite ? "red" : "white"}
                    />
                  </svg>
                </button>
                <button
                  className="size-[34px] flex items-center justify-center cursor-pointer hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 20.33 20.33">
                    <path d={svgPathsProduct.p34735200} fill="white" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product image or placeholder */}
            {hasImage ? (
              <img
                src={imgProduct}
                alt={productName}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center" }}
              />
            ) : (
              <div className="absolute inset-0 bg-[#eaeaf0] flex flex-col items-center justify-center gap-[8px]">
                <ShoppingCart size={80} className="text-[#db43ae]" strokeWidth={1.5} />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[#db43ae] text-[32px]">No Image</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white px-[16px] pt-[20px] pb-[20px]">

            {/* Applied Voucher Banner */}
            {appliedVoucher && (
              <div className="flex items-center gap-[10px] bg-[rgba(219,67,174,0.08)] border border-[rgba(219,67,174,0.25)] rounded-[10px] px-[12px] py-[10px] mb-[14px]">
                <Tag size={16} className="text-[#db43ae] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#db43ae]">
                    {appliedVoucher.discount} voucher applied!
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#92929d] truncate">
                    {appliedVoucher.title}
                  </p>
                </div>
                <button
                  onClick={() => setAppliedVoucher(null)}
                  className="size-[20px] flex items-center justify-center cursor-pointer hover:bg-white/60 rounded-full shrink-0"
                >
                  <X size={14} className="text-[#92929d]" />
                </button>
              </div>
            )}

            {/* Product name */}
            <p className="font-['Poppins:Bold',sans-serif] text-[#3a3a3a] text-[18px] leading-[26px] mb-[8px]">
              {productName}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-[6px] mb-[12px]">
              <div className="flex items-center gap-[2px]">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} className={s <= 4 ? "text-[#fbbf24] fill-[#fbbf24]" : "text-[#e0e0e0]"} />
                ))}
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#888]">4.0 (128 reviews)</p>
            </div>

            {/* Description */}
            <p className="font-['Poppins:Regular',sans-serif] text-[#888] text-[13px] leading-[20px] mb-[20px]">
              A complete rejuvenation package designed to brighten, smooth, and restore your skin with 3 laser sessions and a customized treatment facial.
            </p>

            {/* Treatment Type */}
            <div className="mb-[20px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#212529] text-[14px] mb-[10px]">
                Choose Treatment Type:
              </p>
              <div className="flex items-center gap-[10px] flex-wrap">
                {treatmentTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTreatment(t)}
                    className="px-[18px] py-[7px] rounded-[999px] border cursor-pointer transition-all"
                    style={{
                      borderColor: selectedTreatment === t ? "#db43ae" : "#ccc",
                      background: selectedTreatment === t ? "#db43ae" : "white",
                      color: selectedTreatment === t ? "white" : "#333",
                    }}
                  >
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px]">{t}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Type */}
            <div className="mb-[20px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#212529] text-[14px] mb-[10px]">
                Skin Type:
              </p>
              <div className="flex items-center gap-[10px] flex-wrap">
                {skinTypes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSkin(s)}
                    className="px-[18px] py-[7px] rounded-[999px] border cursor-pointer transition-all"
                    style={{
                      borderColor: selectedSkin === s ? "#db43ae" : "#ccc",
                      background: selectedSkin === s ? "#db43ae" : "white",
                      color: selectedSkin === s ? "white" : "#333",
                    }}
                  >
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px]">{s}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* What's included */}
            <div className="bg-[#fdf0fa] rounded-[12px] p-[16px]">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[#db43ae] text-[13px] mb-[10px]">
                What's Included:
              </p>
              {[
                "3× Laser Treatment Sessions",
                "1× Signature Facial Treatment",
                "Post-treatment care kit",
                "Free consultation with aesthetician",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-[8px] mb-[6px]">
                  <div className="size-[16px] rounded-full bg-[#db43ae] flex items-center justify-center shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#555]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[115px] bg-white shadow-[0px_-2px_10px_rgba(0,0,0,0.05)]">
          {/* Price row */}
          <div className="flex items-center justify-between px-[16px] pt-[14px] pb-[4px]">
            <div className="flex items-baseline gap-[8px]">
              {discountedPrice !== null ? (
                <>
                  <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-[#db43ae]">
                    RM {discountedPrice.toFixed(2)}
                  </p>
                  <p className="font-['Poppins:Bold',sans-serif] text-[13px] text-[#808080] line-through">
                    {price}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-black">{price}</p>
                  <p className="font-['Poppins:Bold',sans-serif] text-[13px] text-[#808080] line-through">{originalPrice}</p>
                </>
              )}
            </div>
            {/* Quantity selector */}
            <div className="flex items-center border border-[#e5e7eb] rounded-[4px] overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-[36px] h-[36px] bg-[#f7f7f7] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <span className="text-[#333] text-[18px] leading-none">−</span>
              </button>
              <div className="w-[48px] h-[36px] bg-white flex items-center justify-center">
                <span className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-black">{qty}</span>
              </div>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-[36px] h-[36px] bg-[#f7f7f7] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <span className="text-[#333] text-[18px] leading-none">+</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-[12px] px-[16px] pt-[6px]">
            <button
              onClick={handleBuyNow}
              className="flex-1 h-[38px] border border-[#db43ae] rounded-[4px] flex items-center justify-center cursor-pointer hover:bg-[#fdf0fa] transition-colors"
            >
              <p className="font-['Poppins:Regular',sans-serif] text-[#db43ae] text-[15px]">Buy Now</p>
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 h-[38px] bg-[#db43ae] rounded-[4px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              <p className="font-['Poppins:Regular',sans-serif] text-white text-[15px]">
                {cartAdded ? "Added! ✓" : "Add To Cart"}
              </p>
            </button>
          </div>
        </div>

        {/* Gesture bar */}
        <div className="absolute bottom-[6px] left-0 right-0 flex justify-center pointer-events-none z-20">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}