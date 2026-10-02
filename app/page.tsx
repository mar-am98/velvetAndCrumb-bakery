import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getProducts } from "@/features/products/actions";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-brand-espresso text-brand-cream py-12">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 px-4 py-1.5 text-xs font-bold tracking-widest text-brand-gold uppercase">
                  <span>✨</span> Handcrafted Daily • Organic Grass-Fed Dairy
                </div>
                
                <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
                  Velvety Cheesecakes & <br />
                  <span className="text-brand-gold italic font-heading font-normal">Artisanal Fruit Tarts</span>
                </h1>
                
                <p className="text-lg text-brand-cream/80 leading-relaxed">
                  Indulge in rich, slow-baked Philadelphia cheesecakes and golden butter-crust tarts layered with fresh raspberries, Valrhona dark chocolate, and organic vanilla bean.
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <a href="#menu" className="inline-flex h-12 items-center justify-center rounded-full bg-brand-crimson px-8 text-sm font-bold text-white hover:bg-brand-crimson/90 transition-colors">
                    Explore Dessert Menu <span className="ml-2">→</span>
                  </a>
                  <a href="/story" className="inline-flex h-12 items-center justify-center rounded-full border border-brand-cream/30 px-8 text-sm font-bold hover:bg-brand-cream/5 transition-colors">
                    Our Bakery Story
                  </a>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-brand-cream/10">
                  <div>
                    <div className="font-heading text-2xl font-bold text-brand-gold">100%</div>
                    <div className="text-xs text-brand-cream/60 mt-1">Natural Ingredients</div>
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-bold text-brand-gold flex items-center gap-1">
                      4.9 <span className="text-lg">★</span>
                    </div>
                    <div className="text-xs text-brand-cream/60 mt-1">Over 2,400 Reviews</div>
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-bold text-brand-gold">Chilled</div>
                    <div className="text-xs text-brand-cream/60 mt-1">Temperature Controlled</div>
                  </div>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-md lg:translate-y-8">
                {/* 1. Background Glow Layer (Must sit behind card) */}
                <div className="absolute inset-0 rounded-3xl  bg-brand-gold/60 transform rotate-3 scale-105 blur-md pointer-events-none z-0" />

                {/* 2. Main Card Container */}
                <div className="relative z-10 aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-[#d97706]/30 bg-[#211612]">
                  <Image 
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80"
                    alt="Madagascar Vanilla Bean Cheesecake"
                    fill
                    className="object-cover"
                    priority
                  />
    
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/90 via-brand-espresso/20 to-transparent" />
                
                {/* Text Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-block bg-brand-crimson text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                    Chef&apos;s Signature
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-2">
                    Madagascar Vanilla Bean Cheesecake
                  </h3>
                  <p className="text-sm text-brand-cream/80">
                    Slow-baked on crisp graham crust, topped with Chantilly cream.
                  </p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-20 bg-brand-cream">
          <div className="container mx-auto px-4 sm:px-8">
            <ProductGrid products={products} />
          </div>
        </section>
        
        {/* Heritage Section */}
        <section className="bg-brand-espresso text-brand-cream py-20">
           <div className="container mx-auto px-4 sm:px-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-6">
                 <h2 className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Our Heritage</h2>
                 <h3 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
                   Slow Baking & Uncompromising Passion
                 </h3>
                 <p className="text-brand-cream/80 leading-relaxed text-lg">
                   At Velvet & Crumb, we believe true luxury takes time. Every cheesecake is slow-baked in a gentle water bath for over three hours, ensuring an impossibly smooth, cloud-like texture without artificial fillers or preservatives.
                 </p>
                 <p className="text-brand-cream/80 leading-relaxed text-lg">
                   Our tart crusts are hand-pressed daily using Grade A European cultured butter, paired with organic fruits sourced directly from local orchards.
                 </p>
                 
                 <div className="flex gap-12 pt-6">
                    <div>
                      <div className="font-heading text-3xl font-bold text-brand-gold">0%</div>
                      <div className="text-sm text-brand-cream/70 mt-1">Artificial Additives</div>
                    </div>
                    <div>
                      <div className="font-heading text-3xl font-bold text-brand-gold">3 Hours</div>
                      <div className="text-sm text-brand-cream/70 mt-1">Slow Water-Bath Bake</div>
                    </div>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-6 relative">
                  <div className="relative aspect-4/5 rounded-2xl overflow-hidden translate-y-8">
                    <Image 
                      src="https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80"
                      alt="Handcrafted Tarts"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-4/5 rounded-2xl overflow-hidden -translate-y-8">
                    <Image 
                      src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80"
                      alt="Fresh Ingredients"
                      fill
                      className="object-cover"
                    />
                  </div>
               </div>
             </div>
           </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
