"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCart } from "@/features/cart/context";
import { formatPrice } from "@/features/products/lib/utils";
import type { ProductStub, PortionSize } from "@/features/products/types";

const DEFAULT_PORTIONS: PortionSize[] = [
  { label: "Single Slice", priceModifier: 1 },
  { label: 'Whole 8" Cake', priceModifier: 6 },
];

interface ProductQuickViewProps {
  product: ProductStub;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const { addItem } = useCart();
  const portions = DEFAULT_PORTIONS;
  
  const [selectedPortion, setSelectedPortion] = useState<PortionSize>(portions[0]);
  const [quantity, setQuantity] = useState(1);

  const price = product.base_price * selectedPortion.priceModifier;
  const totalPrice = price * quantity;

  const handleAdd = () => {
    if (!addItem(product, selectedPortion, quantity)) return;
    toast.success(`${quantity}x ${product.name} added to your cart!`);
    onClose();
    setTimeout(() => {
      setSelectedPortion(portions[0]);
      setQuantity(1);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden bg-white shadow-2xl sm:rounded-3xl w-[90vw] max-h-[85vh] sm:max-w-170 border-none"
      >
        <div className="flex flex-col md:flex-row w-full h-full max-h-[85vh] overflow-y-auto">
          {/* Accessible Dialog Titles */}
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <DialogDescription className="sr-only">{product.description}</DialogDescription>

          {/* Left Side - Image Container */}
          <div className="w-full md:w-1/2 h-full relative bg-white min-h-75 md:min-h-120">
            <Image 
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw h-full"
            />
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-brand-crimson text-white hover:bg-brand-crimson uppercase tracking-wider font-bold text-[10px] border-none px-3 py-1.5 rounded-full">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Right Side - Details Panel */}
          <div className="w-full md:w-1/2 p-6 md:p-7 flex flex-col justify-between bg-brand-cream">
            <div className="space-y-5">
              <div>
                {/* Rating */}
                <div className="flex items-center gap-1.5 text-brand-gold mb-2">
                  <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                  <span className="text-sm font-bold text-brand-espresso">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.review_count} reviews)</span>
                </div>
                
                {/* Product Title */}
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-espresso leading-tight">
                  {product.name}
                </h2>
                
                {/* Description */}
                <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Allergens Box */}
              <div className="bg-secondary rounded-2xl p-4 text-xs space-y-2">
                <div>
                  <span className="font-bold text-brand-espresso">Allergens:</span>{" "}
                  <span className="text-brand-crimson font-medium">Tree Nuts (Pistachio), Dairy, Gluten</span>
                </div>
                <div>
                  <span className="font-bold text-brand-espresso">Ingredients:</span>{" "}
                  <span className="text-muted-foreground">Pistachio Frangipane, Fresh Raspberries, European Butter, Flour, Organic Cane Sugar, Sea Salt.</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Portion Size */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-espresso">
                    Portion Size
                  </label>
                  <div className="flex gap-2">
                    {portions.map((portion) => (
                      <button
                        key={portion.label}
                        onClick={() => setSelectedPortion(portion)}
                        className={`flex-1 py-2.5 px-3 text-xs rounded-xl border transition-all ${
                          selectedPortion.label === portion.label
                            ? "border-brand-crimson bg-brand-crimson/5 text-brand-crimson font-semibold"
                            : "border-black/10 bg-white text-brand-espresso hover:border-brand-espresso/30"
                        }`}
                      >
                        {portion.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between pt-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-espresso">
                    Quantity
                  </label>
                  <div className="flex items-center border border-black/10 rounded-xl bg-white w-28 h-9 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex-1 flex items-center justify-center h-full text-brand-espresso hover:bg-black/5 transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-brand-espresso">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex-1 flex items-center justify-center h-full text-brand-espresso hover:bg-black/5 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground mb-0.5">Total Price</p>
                <p className="font-heading text-2xl font-bold text-brand-espresso">
                  {formatPrice(totalPrice)}
                </p>
              </div>
              
              <Button
                onClick={handleAdd}
                className="h-11 px-5 rounded-full bg-brand-espresso hover:bg-brand-espresso-light text-brand-cream font-semibold text-xs transition-all"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add To Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}