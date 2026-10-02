import type { Metadata } from "next";
import { Geist_Mono, Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/features/auth/context";
import { AccountDialog } from "@/features/auth/components/account-dialog";
import { CartProvider } from "@/features/cart/context";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { CheckoutProvider } from "@/features/checkout/components/checkout-provider";
import { CheckoutDialog } from "@/features/checkout/components/checkout-dialog";
import { Toaster } from "@/components/ui/sonner";

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});
const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans", weight: ["300", "400", "500", "700"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Velvet & Crumb — Artisan Cheesecakes & Tarts",
  description:
    "Slow-baked Philadelphia cheesecakes and golden butter-crust tarts crafted with organic ingredients. Order online for chilled, same-day delivery.",
  keywords: ["cheesecake", "artisan tarts", "bakery", "delivery", "organic"],
  openGraph: {
    title: "Velvet & Crumb — Artisan Cheesecakes & Tarts",
    description: "Handcrafted daily with organic grass-fed dairy. Free chilled shipping on orders over $50.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", geistMono.variable, roboto.variable, headingFont.variable)}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <CheckoutProvider>
              {children}
              <CartDrawer />
              <CheckoutDialog />
            </CheckoutProvider>
            <AccountDialog />
          </CartProvider>
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

