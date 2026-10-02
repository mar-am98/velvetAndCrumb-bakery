"use client";

import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "../context";
import { useAuth } from "@/features/auth/context";
import { formatPrice } from "@/features/products/lib/utils";
import {
  amountAwayFromFreeShipping,
  freeShippingProgress,
  orderTotal,
  shippingCostForSubtotal,
} from "../lib/shipping";
import { useCheckout } from "@/features/checkout/context";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal } = useCart();
  const { user, openAccountDialog } = useAuth();
  const { openCheckout } = useCheckout();

  const handleCheckout = () => {
    if (!user) {
      openAccountDialog("Sign in to proceed to checkout.");
      return;
    }
    setIsOpen(false);
    openCheckout();
  };

  const shippingAway = amountAwayFromFreeShipping(subtotal);
  const progressPercentage = freeShippingProgress(subtotal);
  const total = orderTotal(subtotal);
  const deliveryCost = shippingCostForSubtotal(subtotal);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-brand-cream border-l-brand-border">
        {/* Header */}
        <SheetHeader className="p-6 pb-4 bg-brand-espresso text-brand-cream border-b border-white/10 text-left space-y-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-brand-cream font-heading text-xl flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-gold" />
              Your Cart
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Free Shipping Progress */}
        <div className="bg-white px-6 py-4 border-b border-border shadow-sm z-10">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-brand-espresso">Free Shipping Threshold</span>
            {shippingAway > 0 ? (
              <span className="text-brand-crimson">{formatPrice(shippingAway)} away from Free Shipping</span>
            ) : (
              <span className="text-brand-success">You qualify for free shipping!</span>
            )}
          </div>
          <div className="h-2 w-full bg-brand-cream rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-crimson transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <p className="text-brand-espresso font-medium">Your cart is empty</p>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="mt-4 border-brand-espresso text-brand-espresso hover:bg-brand-espresso hover:text-brand-cream"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-border shadow-sm">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-brand-cream flex-shrink-0">
                    <Image 
                      src={item.product.image_url} 
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-heading font-bold text-sm text-brand-espresso line-clamp-2 leading-tight">
                          {item.product.name}
                        </h4>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-brand-crimson transition-colors mt-0.5 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-brand-crimson mt-1">
                        {item.portion.label}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="font-bold text-brand-espresso">
                        {formatPrice(item.product.base_price * item.portion.priceModifier)}
                      </div>
                      
                      <div className="flex items-center border border-border rounded-full bg-brand-cream/50 overflow-hidden h-8">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 h-full text-brand-espresso hover:bg-black/5 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-brand-espresso">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 h-full text-brand-espresso hover:bg-black/5 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="bg-white p-6 border-t border-border shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-brand-espresso">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Chilled Courier Delivery</span>
                <span className="font-medium text-brand-espresso">
                  {deliveryCost > 0 ? formatPrice(deliveryCost) : "Free"}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-heading font-bold text-lg text-brand-espresso">
                <span>Total</span>
                <span className="text-brand-crimson">{formatPrice(total)}</span>
              </div>
            </div>
            
            <Button
              onClick={handleCheckout}
              className="w-full h-12 rounded-xl bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-base shadow-md"
            >
              Proceed to Checkout <span className="ml-2">→</span>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
