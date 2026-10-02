"use client";

import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/context";
import { AccountButton } from "@/features/auth/components/account-button";

export function SiteHeader() {
  const { totalItems, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-brand-cream/80 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-brand-espresso px-4 py-2 text-center text-xs text-brand-cream flex items-center justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-brand-gold"></span>
        <p>
          Free Chilled Express Shipping on orders over <span className="font-semibold">$50</span>! | Code:{" "}
          <span className="font-semibold text-brand-gold">VELVET2026</span>
        </p>
      </div>

      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-espresso text-brand-cream">
            {/* Simple logo icon placeholder */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-2xl font-bold tracking-tight text-brand-espresso">Velvet & Crumb</span>
            <span className="text-[10px] font-bold tracking-widest text-brand-crimson uppercase max-lg:hidden">Artisan Cheesecakes & Tarts</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-espresso">
          <Link href="/catalog" className="hover:text-brand-crimson transition-colors">Catalog</Link>
          <Link href="/bestsellers" className="hover:text-brand-crimson transition-colors">Bestsellers</Link>
          <Link href="/story" className="hover:text-brand-crimson transition-colors">Our Story</Link>
          <Link href="/reviews" className="hover:text-brand-crimson transition-colors">Reviews</Link>
        </nav> */}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search flavors, tarts..." 
              className="h-10 w-64 rounded-full border border-border bg-secondary pl-10 pr-4 text-sm outline-none focus:border-brand-espresso transition-colors"
            />
          </div>
          
          <AccountButton />

          <button 
            onClick={() => setIsOpen(true)}
            aria-label="Open cart"
            className="flex h-10 items-center gap-2 rounded-full bg-brand-espresso px-3 text-sm font-medium text-brand-cream hover:bg-brand-espresso-light transition-colors sm:px-4"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-crimson text-[10px] font-bold">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
