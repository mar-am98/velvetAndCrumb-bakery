"use client";

import { useState } from "react";
import { ProductCard } from "./product-card";
import type { ProductStub, ProductCategory } from "../types";

const CATEGORIES: { label: string; value: ProductCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Cheesecakes", value: "Cheesecakes" },
  { label: "Fruit Tarts", value: "Fruit Tarts" },
  { label: "Chocolate Tarts", value: "Chocolate Tarts" },
  { label: "Mini Bites", value: "Mini Bites" },
  { label: "Vegan / GF", value: "Vegan / GF" },
];

interface ProductGridProps {
  products: ProductStub[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "All">("All");

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/60">
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Handcrafted Bakery Menu</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-brand-espresso">
            Discover Our Desserts
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                activeCategory === cat.value
                  ? "bg-brand-espresso text-brand-cream border-brand-espresso"
                  : "bg-card text-brand-espresso border-border hover:border-brand-espresso/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <p className="text-lg text-muted-foreground">No desserts found in this category.</p>
        </div>
      )}
    </div>
  );
}
