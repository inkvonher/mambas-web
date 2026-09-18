"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  type Language,
  type ProductCategory,
  type Product,
  type CartItem,
  copy,
  products,
  contacts,
} from "./data";

export default function StoreSection({ language }: { language: Language }) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});

  const t = copy[language];

  const categories: { key: ProductCategory; label: string }[] = [
    { key: "all", label: t.allCategories },
    { key: "aftercare", label: t.catAftercare },
    { key: "apparel", label: t.catApparel },
    { key: "piercing", label: t.catPiercing },
    { key: "barber", label: t.catBarber },
    { key: "cards", label: t.catCards },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const addToCart = (product: Product) => {
    const size = product.sizes ? selectedSizes[product.id] || product.sizes[0] : undefined;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }

      return [...prev, { product, quantity: 1, selectedSize: size }];
    });

    // Trigger feedback animation
    setAddedAnimation((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity += delta;
      if (next[index].quantity <= 0) {
        return next.filter((_, i) => i !== index);
      }
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalMXN = cart.reduce(
    (acc, item) => acc + item.product.priceMXN * item.quantity,
    0
  );
  const totalUSD = cart.reduce(
    (acc, item) => acc + item.product.priceUSD * item.quantity,
    0
  );
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const generateWhatsAppOrderLink = () => {
    if (cart.length === 0) return "#";

    const itemsSummary = cart
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name[language]}${
            item.selectedSize ? ` (Talla: ${item.selectedSize})` : ""
          } - $${
            language === "es"
              ? `${item.product.priceMXN * item.quantity} MXN`
              : `${item.product.priceUSD * item.quantity} USD`
          }`
      )
      .join("\n");

    const message =
      language === "es"
        ? `Hola Mambas Tattoo & Cuts, quiero hacer el siguiente pedido de la tienda oficial:\n\n${itemsSummary}\n\n*Total Estimado: $${totalMXN.toLocaleString(
            "es-MX"
          )} MXN*\n\n💳 *Formas de pago:* Transferencia SPEI • Mercado Pago • Efectivo en tienda\n\n¿Me confirman disponibilidad y entrega en el estudio / envío?`
        : `Hi Mambas Tattoo & Cuts, I'd like to place an order from the official store:\n\n${itemsSummary}\n\n*Estimated Total: $${totalUSD.toLocaleString(
            "en-US"
          )} USD*\n\n💳 *Payment options:* SPEI Transfer • Mercado Pago • In-studio Cash\n\nCan you confirm availability and pickup / shipping?`;

    return `https://wa.me/${contacts.barber.phone}?text=${encodeURIComponent(
      message
    )}`;
  };

  const getDirectBuyLink = (product: Product) => {
    const size = product.sizes ? selectedSizes[product.id] || product.sizes[0] : undefined;
    const message =
      language === "es"
        ? `Hola Mambas, quiero comprar "${product.name.es}"${
            size ? ` en talla ${size}` : ""
          } por $${product.priceMXN} MXN. ¿Tienen disponible? (Pago por SPEI, Mercado Pago o Efectivo).`
        : `Hi Mambas, I want to purchase "${product.name.en}"${
            size ? ` size ${size}` : ""
          } for $${product.priceUSD} USD. Is it available? (Payment via SPEI, Mercado Pago or Cash).`;

    return `https://wa.me/${contacts.barber.phone}?text=${encodeURIComponent(
      message
    )}`;
  };

  return (
    <section id="tienda" className="service-section pt-24 pb-20 px-4 sm:px-6">
      {/* Section Header */}
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <p className="section-kicker">{t.storeSlogan}</p>
        <h2 className="section-title">{t.storeTitle}</h2>
        <p className="mt-4 max-w-2xl mx-auto text-base text-zinc-300 leading-relaxed">
          {t.storeSubtitle}
        </p>
      </div>

      {/* Category Filter Pills & Cart Button Bar */}
      <div className="mx-auto max-w-7xl mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#d6ad4a]/15 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-200 ${
                selectedCategory === cat.key
                  ? "bg-[#d6ad4a] text-black shadow-[0_0_15px_rgba(214,173,74,0.35)] scale-105"
                  : "border border-[#d6ad4a]/20 bg-[#070707] text-zinc-400 hover:border-[#d6ad4a]/50 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Floating Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-3 rounded-full border border-[#d6ad4a]/40 bg-[#0a0a0a] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#d6ad4a] shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all hover:scale-105 hover:bg-[#d6ad4a] hover:text-black"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span>{t.cartTitle}</span>
          {totalItems > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d6ad4a] text-[10px] font-black text-black">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => {
          const selectedSize =
            selectedSizes[product.id] || (product.sizes ? product.sizes[0] : "");
          const isAdded = addedAnimation[product.id];

          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#d6ad4a]/20 bg-[#080808] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#d6ad4a]/50 hover:shadow-[0_18px_50px_rgba(214,173,74,0.12)] hover:-translate-y-1"
            >
              <div>
                {/* Product Badge */}
                {product.badge && (
                  <div className="absolute right-4 top-4 z-10 rounded-full border border-[#d6ad4a]/50 bg-black/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#d6ad4a] backdrop-blur-md">
                    {product.badge[language]}
                  </div>
                )}

                {/* Product Image Container */}
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl border border-[#d6ad4a]/12 bg-[#040404]">
                  <Image
                    src={product.image}
                    alt={product.name[language]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </div>

                {/* Product Title & Category */}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d6ad4a]">
                  {categories.find((c) => c.key === product.category)?.label}
                </span>
                <h3 className="mt-1 text-base font-bold text-white group-hover:text-[#d6ad4a] transition-colors leading-snug">
                  {product.name[language]}
                </h3>

                {/* Product Description */}
                <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                  {product.description[language]}
                </p>

                {/* Size Selector if available */}
                {product.sizes && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                      {t.selectSize}
                    </span>
                    <div className="flex gap-1.5">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(product.id, size)}
                          className={`flex h-6 w-7 items-center justify-center rounded border text-[10px] font-bold transition-all ${
                            selectedSize === size
                              ? "border-[#d6ad4a] bg-[#d6ad4a] text-black"
                              : "border-[#d6ad4a]/20 bg-black text-zinc-400 hover:border-[#d6ad4a]/60 hover:text-white"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Action Buttons */}
              <div className="mt-6 border-t border-[#d6ad4a]/12 pt-4">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xl font-black text-[#d6ad4a]">
                    ${language === "es" ? product.priceMXN : product.priceUSD}{" "}
                    <span className="text-xs font-semibold text-zinc-400">
                      {language === "es" ? "MXN" : "USD"}
                    </span>
                  </span>
                  <span className="text-xs text-zinc-500">
                    ≈ ${language === "es" ? product.priceUSD : product.priceMXN}{" "}
                    {language === "es" ? "USD" : "MXN"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                      isAdded
                        ? "border-green-500 bg-green-500/20 text-green-400"
                        : "border-[#d6ad4a]/30 bg-black text-[#d6ad4a] hover:bg-[#d6ad4a]/10 hover:border-[#d6ad4a]"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {t.addedToCart}
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        {t.addToCart}
                      </>
                    )}
                  </button>

                  <a
                    href={getDirectBuyLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold flex items-center justify-center text-center px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-wider shadow-md hover:scale-[1.02]"
                  >
                    {t.buyNow}
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Perks & Pickup Note */}
      <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-[#d6ad4a]/20 bg-gradient-to-r from-[#070707] via-[#0c0c0c] to-[#070707] p-6 text-center shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="text-lg text-[#d6ad4a]">📍</span>
            <span>{t.pickupNote}</span>
          </div>
          <div className="h-px w-full sm:h-8 sm:w-px bg-[#d6ad4a]/20" />
          <div className="flex items-center gap-2">
            <span className="text-lg text-[#d6ad4a]">💳</span>
            <span>{t.storePaymentNote}</span>
          </div>
          <div className="h-px w-full sm:h-8 sm:w-px bg-[#d6ad4a]/20" />
          <div className="flex items-center gap-2">
            <span className="text-lg text-[#d6ad4a]">👑</span>
            <span>{t.memberDiscountNote}</span>
          </div>
        </div>
      </div>

      {/* Slide-over Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-[#070707] border-l border-[#d6ad4a]/25 p-6 shadow-2xl flex flex-col justify-between"
              >
                {/* Cart Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-[#d6ad4a]/20 pb-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/logo.png"
                        alt="Mambas Logo"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                      <h3 className="text-lg font-black uppercase tracking-wider text-white">
                        {t.cartTitle} ({totalItems})
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="mt-6 max-h-[55vh] overflow-y-auto space-y-4 pr-1">
                    {cart.length === 0 ? (
                      <div className="py-12 text-center text-zinc-500 text-sm">
                        <p className="text-3xl mb-3">🛍️</p>
                        <p>{t.cartEmpty}</p>
                      </div>
                    ) : (
                      cart.map((item, index) => (
                        <div
                          key={`${item.product.id}-${item.selectedSize}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#d6ad4a]/15 bg-[#030303] p-3"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#d6ad4a]/10">
                            <Image
                              src={item.product.image}
                              alt={item.product.name[language]}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-xs font-bold text-white">
                              {item.product.name[language]}
                            </h4>
                            {item.selectedSize && (
                              <p className="text-[10px] text-[#d6ad4a]">
                                Talla: {item.selectedSize}
                              </p>
                            )}
                            <p className="text-xs font-semibold text-zinc-300 mt-0.5">
                              ${language === "es"
                                ? item.product.priceMXN * item.quantity
                                : item.product.priceUSD * item.quantity}{" "}
                              {language === "es" ? "MXN" : "USD"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center rounded border border-[#d6ad4a]/30 bg-black">
                              <button
                                onClick={() => updateQuantity(index, -1)}
                                className="px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
                              >
                                -
                              </button>
                              <span className="px-1 text-xs font-bold text-[#d6ad4a]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(index, 1)}
                                className="px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-zinc-500 hover:text-red-400 text-xs p-1"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Cart Footer */}
                {cart.length > 0 && (
                  <div className="border-t border-[#d6ad4a]/20 pt-4 mt-4">
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                        {t.cartTotal}
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#d6ad4a]">
                          ${language === "es"
                            ? totalMXN.toLocaleString("es-MX")
                            : totalUSD.toLocaleString("en-US")}{" "}
                          <span className="text-xs text-zinc-400">
                            {language === "es" ? "MXN" : "USD"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 rounded-lg border border-[#d6ad4a]/15 bg-black/60 p-2 text-center text-[10px] text-zinc-400">
                      <span>💳 Transferencia SPEI • Mercado Pago • Efectivo en tienda</span>
                    </div>

                    <a
                      href={generateWhatsAppOrderLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold flex w-full items-center justify-center gap-2 py-3.5 text-xs font-extrabold uppercase tracking-widest shadow-xl"
                    >
                      <span>💬</span>
                      <span>{t.checkoutWhatsApp}</span>
                    </a>

                    <button
                      onClick={() => setCart([])}
                      className="mt-3 w-full text-center text-[10px] uppercase tracking-wider text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      {t.clearCart}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
