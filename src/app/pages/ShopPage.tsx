import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search, SlidersHorizontal, ChevronDown, Heart, ShoppingCart, X, Plus, Minus } from "lucide-react";
import svgPaths from "../../imports/svg-rso0tpw68w";
import imgProduct from "figma:asset/9d6accb511ecb75e972b489726907e765cb42944.png";

type Category = "Favourite" | "Top Selling" | "Packages" | "Category 1" | "Category 2";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  hasImage: boolean;
  category: Category[];
  isFavourite: boolean;
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Package 2",
    price: 188.90,
    hasImage: false,
    category: ["Favourite", "Packages"],
    isFavourite: true,
  },
  {
    id: "2",
    name: "Package 1 – 3 Laser Sessions + 1 Signature Facial",
    price: 888.90,
    originalPrice: 1200,
    hasImage: true,
    category: ["Favourite", "Top Selling", "Packages"],
    isFavourite: true,
  },
  {
    id: "3",
    name: "Package 3",
    price: 999.90,
    hasImage: true,
    category: ["Top Selling", "Packages"],
    isFavourite: false,
  },
  {
    id: "4",
    name: "Package 3",
    price: 999.90,
    hasImage: true,
    category: ["Top Selling", "Packages"],
    isFavourite: false,
  },
  {
    id: "5",
    name: "Laser Glow Treatment",
    price: 299.00,
    hasImage: true,
    category: ["Category 1"],
    isFavourite: false,
  },
  {
    id: "6",
    name: "Hydration Facial",
    price: 150.00,
    hasImage: false,
    category: ["Category 2"],
    isFavourite: false,
  },
];

const categories: Category[] = ["Favourite", "Top Selling", "Packages", "Category 1", "Category 2"];

interface CartItem {
  product: Product;
  qty: number;
}

export function ShopPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { cartUpdated?: boolean; productName?: string; checkout?: boolean } | null;

  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState<Category>("Favourite");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(!!state?.checkout);
  const [notification, setNotification] = useState<string | null>(
    state?.cartUpdated ? `${state.productName ?? "Product"} added to cart!` : null
  );

  // Auto-dismiss notification
  if (notification) {
    setTimeout(() => setNotification(null), 3000);
  }

  const toggleFavourite = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isFavourite: !p.isFavourite, category: p.isFavourite ? p.category.filter((c) => c !== "Favourite") : [...p.category, "Favourite"] }
          : p
      )
    );
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
    setNotification(`${product.name.slice(0, 20)}${product.name.length > 20 ? "…" : ""} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => i.product.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const filteredProducts = products.filter((p) => {
    const inCategory = activeCategory === "Favourite" ? p.isFavourite : p.category.includes(activeCategory);
    const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    return inCategory && matchSearch;
  });

  // Group filtered products by section heading
  const getSectionLabel = (cat: Category) => cat;

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="bg-white relative w-full min-h-screen md:w-full md:max-w-md md:h-[800px] md:rounded-lg md:shadow-xl overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-[40px] shrink-0 flex items-center justify-between px-[12px] bg-white z-30">
          <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)]">12:30</p>
          <div className="flex gap-[6px] items-center">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d={svgPaths.p30908d00} fill="black" fillOpacity="0.9" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d={svgPaths.pee63b00} fill="black" fillOpacity="0.9" />
            </svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <path d={svgPaths.p354c5080} fill="black" fillOpacity="0.9" opacity="0.4" />
              <rect fill="black" fillOpacity="0.9" height="7.76471" rx="1.33333" width="17.7573" x="1.97303" y="2.11765" />
            </svg>
          </div>
        </div>

        {/* Search + Filter bar */}
        <div className="bg-white px-[12px] pb-[8px] shrink-0 z-20 shadow-[0px_2px_8px_rgba(0,0,0,0.04)]">
          {/* Search */}
          <div className="flex items-center gap-[8px] mb-[8px]">
            <div className="flex-1 h-[36px] bg-[#fdfdff] border border-[#e2e2ea] rounded-[50px] flex items-center gap-[8px] px-[12px]">
              <Search size={16} className="text-[#92929d] shrink-0" />
              <input
                type="text"
                placeholder="Search Product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none bg-transparent font-['Poppins:Regular',sans-serif] text-[13px] text-[#1b1c15] placeholder-[#757575]"
              />
            </div>
            <button className="size-[36px] shrink-0 flex items-center justify-center cursor-pointer">
              <SlidersHorizontal size={20} className="text-[#696974]" />
            </button>
          </div>

          {/* Filter chips */}
          
        </div>

        {/* Main content: sidebar + product grid */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left category sidebar */}
          <div className="w-[90px] shrink-0 border-r border-[#ddd] overflow-y-auto bg-white">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="w-full h-[52px] flex items-center justify-center px-[8px] cursor-pointer transition-all relative"
                style={{
                  borderRight: activeCategory === cat ? "2.4px solid #db43ae" : "2.4px solid transparent",
                  background: "white",
                }}
              >
                <p
                  className="font-['Poppins:Regular',sans-serif] text-[12px] text-center leading-[16px]"
                  style={{
                    color: activeCategory === cat ? "#db43ae" : "#444",
                    fontWeight: activeCategory === cat ? "700" : "400",
                  }}
                >
                  {cat}
                </p>
              </button>
            ))}
          </div>

          {/* Right product area */}
          <div className="flex-1 overflow-y-auto bg-white px-[12px] pt-[12px] pb-[20px]">
            {/* Section heading */}
            <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-[#1b1c15] mb-[12px]">
              {getSectionLabel(activeCategory)}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[40px] gap-[12px]">
                <ShoppingCart size={48} className="text-[#e0e0e0]" strokeWidth={1} />
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d] text-center">
                  No products found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-[12px]">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex flex-col gap-[6px]">
                    {/* Product image */}
                    <button
                      onClick={() =>
                        navigate("/product", {
                          state: {
                            hasImage: product.hasImage,
                            productName: product.name,
                            price: `RM ${product.price.toFixed(2)}`,
                            originalPrice: product.originalPrice ? `RM ${product.originalPrice.toFixed(2)}` : undefined,
                          },
                        })
                      }
                      className="cursor-pointer relative"
                    >
                      <div className="h-[110px] rounded-[4px] overflow-hidden bg-[#eaeaf0] relative">
                        {product.hasImage ? (
                          <img
                            src={imgProduct}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-[4px]">
                            <ShoppingCart size={36} className="text-[#db43ae]" strokeWidth={1.5} />
                            <p className="font-['Poppins:SemiBold',sans-serif] text-[#db43ae] text-[11px]">No Image</p>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Product name */}
                    <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#1b1c15] leading-[15px] line-clamp-3">
                      {product.name}
                    </p>

                    {/* Price */}
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-black">
                      RM {product.price.toFixed(2)}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => addToCart(product)}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                      >
                        <ShoppingCart size={18} className="text-black" />
                      </button>
                      <button
                        onClick={() => toggleFavourite(product.id)}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                      >
                        <Heart
                          size={18}
                          className={product.isFavourite ? "text-[#db43ae] fill-[#db43ae]" : "text-black"}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom nav / Cart bar */}
        <div className="absolute bottom-0 left-0 right-0 shrink-0 border-t border-[#dedede] bg-[#f9f9f9]">
          {cart.length > 0 ? (
            /* Cart bar */
            <div className="h-[68px] flex items-center justify-between px-[16px]">
              <button
                onClick={() => setShowCart(true)}
                className="flex items-center gap-[8px] cursor-pointer"
              >
                <div className="relative">
                  <ShoppingCart size={24} className="text-[#1b1c15]" />
                  {cartCount > 0 && (
                    <div className="absolute -top-[6px] -right-[6px] size-[16px] bg-[#f94144] rounded-full flex items-center justify-center">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[9px] text-white">{cartCount}</p>
                    </div>
                  )}
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#1b1c15]">Cart</p>
              </button>
              <button
                onClick={() => setShowCart(true)}
                className="bg-[#db43ae] h-[40px] px-[24px] rounded-[4px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              >
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Checkout</p>
              </button>
            </div>
          ) : (
            /* Bottom navigation */
            <div className="flex items-start h-[56px]">
              {/* Home */}
              <button
                onClick={() => navigate("/")}
                className="flex-1 flex flex-col items-center justify-center h-full gap-[4px] cursor-pointer"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#92929d" />
                </svg>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#92929d]">Home</p>
              </button>

              {/* Shop (active) */}
              <button className="flex-1 flex flex-col items-center justify-center h-full gap-[4px] cursor-pointer">
                <ShoppingCart size={24} className="text-[#1d1b20]" strokeWidth={2.5} />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#1d1b20]">Shop</p>
              </button>

              {/* Appointment */}
              <button className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer relative">
                <div className="absolute -top-[18px] bg-[#db43ae] rounded-full size-[52px] flex items-center justify-center shadow-[0px_6px_20px_rgba(219,67,174,0.3)]">
                  <svg width="26" height="26" fill="none" viewBox="0 0 30 30">
                    <path d="M22.5 3.75h-1.25V2.5a1.25 1.25 0 0 0-2.5 0v1.25h-7.5V2.5a1.25 1.25 0 0 0-2.5 0v1.25H7.5A3.75 3.75 0 0 0 3.75 7.5v17.5A3.75 3.75 0 0 0 7.5 28.75h15a3.75 3.75 0 0 0 3.75-3.75V7.5A3.75 3.75 0 0 0 22.5 3.75Zm1.25 21.25a1.25 1.25 0 0 1-1.25 1.25H7.5a1.25 1.25 0 0 1-1.25-1.25V13.75h17.5V25Zm0-13.75H6.25V7.5A1.25 1.25 0 0 1 7.5 6.25h1.25V7.5a1.25 1.25 0 0 0 2.5 0V6.25h7.5V7.5a1.25 1.25 0 0 0 2.5 0V6.25h1.25A1.25 1.25 0 0 1 23.75 7.5v3.75Z" fill="white" />
                  </svg>
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#92929d] mt-[32px]">Appointment</p>
              </button>

              {/* Rewards */}
              <button
                onClick={() => navigate("/rewards")}
                className="flex-1 flex flex-col items-center justify-center h-full gap-[4px] cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6h-2.18c.07-.42.18-.83.18-1.28C18 2.57 15.64 1 13.5 1 12 1 10.67 1.8 10 3L9 5.05 8 3C7.34 1.8 6 1 4.5 1 2.36 1 0 2.57 0 4.72c0 .45.1.86.18 1.28H0v14h24V6h-4zm-8.5 12H4V8h7.5v10zm8.5 0h-7.5V8H20v10z" fill="#92929d" />
                </svg>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#92929d]">Rewards</p>
              </button>

              {/* Me */}
              <button
                onClick={() => navigate("/login")}
                className="flex-1 flex flex-col items-center justify-center h-full gap-[4px] cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="#92929d" />
                </svg>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#92929d]">Me</p>
              </button>
            </div>
          )}
        </div>

        {/* Notification toast */}
        {notification && (
          <div className="absolute top-[52px] left-[12px] right-[12px] z-50 bg-[#1b1c15] rounded-[8px] px-[14px] py-[10px] flex items-center justify-between shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white">{notification}</p>
            <button onClick={() => setNotification(null)} className="cursor-pointer ml-[8px] shrink-0">
              <X size={14} className="text-white/60" />
            </button>
          </div>
        )}

        {/* Cart modal */}
        {showCart && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
            <div className="relative bg-white rounded-t-[24px] max-h-[80%] flex flex-col">
              {/* Handle */}
              <div className="flex justify-center pt-[12px] pb-[8px]">
                <div className="w-[40px] h-[4px] bg-[#d1d5db] rounded-full" />
              </div>

              <div className="flex items-center justify-between px-[20px] pb-[12px] border-b border-[#f0f0f0]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#1b1c15]">
                  My Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                </p>
                <button onClick={() => setShowCart(false)} className="cursor-pointer">
                  <X size={20} className="text-[#92929d]" />
                </button>
              </div>

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto px-[20px] py-[12px]">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-[32px] gap-[12px]">
                    <ShoppingCart size={48} className="text-[#e0e0e0]" strokeWidth={1} />
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#92929d]">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-[12px] py-[12px] border-b border-[#f0f0f0]">
                      {/* Thumbnail */}
                      <div className="size-[64px] rounded-[8px] overflow-hidden bg-[#eaeaf0] shrink-0">
                        {item.product.hasImage ? (
                          <img src={imgProduct} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart size={24} className="text-[#db43ae]" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#1b1c15] leading-[16px] line-clamp-2 mb-[6px]">
                          {item.product.name}
                        </p>
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-black">
                          RM {item.product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-[6px]">
                        <button
                          onClick={() => updateQty(item.product.id, -1)}
                          className="size-[28px] bg-[#f7f7f7] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                        >
                          <Minus size={12} className="text-[#333]" />
                        </button>
                        <span className="font-['Poppins:SemiBold',sans-serif] text-[14px] w-[20px] text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product.id, 1)}
                          className="size-[28px] bg-[#f7f7f7] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                        >
                          <Plus size={12} className="text-[#333]" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="size-[28px] ml-[4px] flex items-center justify-center cursor-pointer"
                        >
                          <X size={14} className="text-[#92929d]" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total + Checkout */}
              {cart.length > 0 && (
                <div className="px-[20px] py-[16px] border-t border-[#f0f0f0]">
                  <div className="flex items-center justify-between mb-[14px]">
                    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#92929d]">Total</p>
                    <p className="font-['Poppins:Bold',sans-serif] text-[18px] text-black">
                      RM {cartTotal.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setCart([]);
                      setNotification("Order placed successfully!");
                    }}
                    className="w-full h-[48px] bg-[#db43ae] rounded-[8px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
                      Checkout • RM {cartTotal.toFixed(2)}
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gesture bar */}
        <div className="absolute bottom-[6px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="w-[108px] h-[4px] bg-[#1d1b20] rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}