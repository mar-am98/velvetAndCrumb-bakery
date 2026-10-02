"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Plus, Info } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatPrice } from "../lib/utils";
import { ProductQuickView } from "./product-quick-view";
import { useCart } from "@/features/cart/context";
import type { ProductStub } from "../types";

interface ProductCardProps {
  product: ProductStub;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use the default portion (Single Slice) for quick add; false = sign-in dialog opened
    const added = addItem(product, { label: "Single Slice", priceModifier: 1 }, 1);
    if (added) {
      toast.success(`1x ${product.name} added to your cart!`);
    }
  };

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border-border/50 bg-white py-0 gap-0 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
        <CardHeader 
          className="p-0 relative aspect-4/3 overflow-hidden bg-brand-cream/50 cursor-pointer"
          onClick={() => setShowQuickView(true)}
        >
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Top Badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <Badge variant="secondary" className="bg-brand-espresso/80 text-brand-cream hover:bg-brand-espresso text-[10px] uppercase tracking-wider font-semibold border-none backdrop-blur-sm">
              {product.category}
            </Badge>
            
            {product.badge && (
              <Badge variant="outline" className="bg-white text-brand-espresso text-[11px] font-medium border-none shadow-sm backdrop-blur-sm">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 bg-brand-espresso/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickView(true);
              }}
              className="bg-brand-espresso text-brand-cream hover:bg-brand-espresso-light border-none rounded-full h-9 px-5 text-[13px] font-medium shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300 relative z-20"
            >
              <Info className="h-4 w-4 mr-1.5" />
              Quick View
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-5 flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-brand-gold">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-sm font-bold text-brand-espresso">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.review_count})</span>
          </div>
          
          <div className="space-y-2 flex-1">
            <h3 className="font-heading font-bold text-lg leading-tight text-brand-espresso truncate transition-colors group-hover:text-brand-crimson">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-4 bg-card flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground font-medium mb-0.5">From</span>
            <span className="font-heading font-bold text-xl text-brand-espresso">
              {formatPrice(product.base_price)}
            </span>
          </div>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleQuickAdd}
            className="rounded-full bg-brand-espresso hover:bg-brand-espresso-light text-brand-cream px-4 h-9 font-medium relative z-20"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </CardFooter>
      </Card>

      <ProductQuickView 
        product={product} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
    </>
  );
}

