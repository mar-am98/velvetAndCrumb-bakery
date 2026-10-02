import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-brand-espresso-light text-brand-cream mt-auto border-t border-white/10">
      <div className="container mx-auto px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-espresso text-brand-cream">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                </svg>
              </div>
              <span className="font-heading text-xl font-bold tracking-tight">Velvet & Crumb</span>
            </div>
            <p className="text-sm text-brand-cream/80 leading-relaxed max-w-xs">
              Artisan Cheesecakes & Tarts crafted with organic dairy and pure vanilla bean. Freshly delivered in chilled, temperature-monitored packaging.
            </p>
          </div>

          {/* Popular Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-brand-gold uppercase">Popular Categories</h4>
            <ul className="space-y-3 text-sm text-brand-cream/80">
              <li><Link href="#" className="hover:text-brand-cream transition-colors">New York Cheesecakes</Link></li>
              <li><Link href="#" className="hover:text-brand-cream transition-colors">Fruit & Berry Tarts</Link></li>
              <li><Link href="#" className="hover:text-brand-cream transition-colors">Dark Chocolate Tarts</Link></li>
              <li><Link href="#" className="hover:text-brand-cream transition-colors">Gluten-Free Selections</Link></li>
            </ul>
          </div>

          {/* Kitchen Hours */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-brand-gold uppercase">Kitchen Hours</h4>
            <div className="space-y-3 text-sm text-brand-cream/80">
              <p>Monday - Saturday: 8:00 AM - 7:00 PM</p>
              <p>Sunday: 9:00 AM - 4:00 PM</p>
              <p className="text-brand-gold font-medium mt-4">Same-day local courier delivery</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-brand-gold uppercase">Bakery Address</h4>
            <div className="space-y-3 text-sm text-brand-cream/80">
              <p>124 Baker Street, Culinary District</p>
              <p>hello@velvetandcrumb.com</p>
              <div className="flex gap-4 pt-2">
                <Link href="#" className="hover:text-brand-gold transition-colors">Instagram</Link>
                <span className="text-brand-cream/30">•</span>
                <Link href="#" className="hover:text-brand-gold transition-colors">Facebook</Link>
                <span className="text-brand-cream/30">•</span>
                <Link href="#" className="hover:text-brand-gold transition-colors">Pinterest</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
