# Agent Rules — Cheesecake & Tart Shop

## Project Overview
An e-commerce storefront: browse products, add to cart, checkout, confirm order via email, sign in with Google. Data persisted in a real database (Supabase/Postgres).

## Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database/Auth**: Supabase
- **Email**: Mailgun API

## Folder Structure — Read This Before Creating Any File

**`app/`** — routing ONLY. No business logic, no data fetching logic, no reusable UI.
- Files allowed here: `page.tsx`, `layout.tsx`, `loading.tsx`, `route.ts`.
- A `page.tsx` should mostly just import and arrange components from `features/` and `components/`. If a `page.tsx` file is doing real logic (fetching + transforming data, form handling), that logic belongs in `features/` instead.

**`features/<domain>/`** — one folder per business domain (e.g. `features/products/`, `features/cart/`, `features/orders/`, `features/auth/`). Each domain folder contains:
- `actions.ts` — server actions for that domain only (e.g. `features/orders/actions.ts` has `createOrder`, not cart logic).
- `components/` — components used ONLY by this domain (e.g. `product-card.tsx`, `checkout-form.tsx`).
- `lib/` or `types.ts` — domain-specific helpers/types (e.g. price formatting, cart total calculation).

**`components/ui/`** — shadcn primitives ONLY (button, input, card, dialog, etc.). Never write feature logic here.

**`components/`** (top level, outside `ui/`) — shared components used across MORE THAN ONE feature domain (e.g. `site-header.tsx`, `site-footer.tsx`). If a component is only used inside one domain, it belongs in that domain's `features/<domain>/components/` instead, not here.

**`lib/`** (top level) — app-wide utilities not tied to one domain: `supabase.ts` (client setup), `utils.ts` (`cn()` helper), `mailgun.ts`.

## Zero Duplication Rule — Non-Negotiable

Before writing any JSX or logic, check if it already exists.

- **If the same UI block appears in 2+ places** (even with small differences like a different title or button text), it MUST be extracted into a single component that takes props. Never copy-paste a block and tweak it.
  - Example: if a "product card" is used on the homepage AND inside search results, it's ONE `<ProductCard />` component, not two similar blocks.
- **If the same calculation/logic appears in 2+ places** (e.g. formatting a price, calculating cart total, checking if a field is valid), extract it into a single function in that domain's `lib/` file and import it everywhere it's needed. Never retype the same logic.
- Before creating a new component, search the codebase for an existing one that already does this or something close to it. Reuse and extend with props rather than duplicating.

## Never Build From Scratch What shadcn Already Provides

Before writing any custom-styled `<div>`, `<button>`, `<input>`, `<span>` etc. that mimics a UI pattern, check if shadcn already has it. This project commonly needs:

- Buttons → `Button` (components/ui/button.tsx)
- Text inputs → `Input`
- Cart/checkout forms → `Form`, `Label`, `Input`, `Textarea`
- Product cards / order summary → `Card`, `CardHeader`, `CardContent`, `CardFooter`
- Status tags ("In Stock", "Out of Stock", order status) → `Badge`
- Cart drawer / product quick-view → `Sheet` or `Dialog`
- Quantity selector, category filter → `Select`
- "Are you sure you want to remove this item" → `AlertDialog`
- Success/error feedback after checkout → `Sonner` (toast)
- Loading state while fetching products → `Skeleton`

If a needed component is not yet installed in `components/ui/`, install it via the shadcn CLI (`npx shadcn add <component>`) instead of hand-building a styled equivalent. Only build a custom component from raw HTML when no shadcn primitive reasonably covers the need — and say so explicitly when you do.

## Database
- All persisted data (products, orders, order items) goes through Supabase, not local/mock arrays.
- Product data is seeded manually via the Supabase Table Editor, not a seed script — there is no "empty state" requirement for this project, products should always be present.

## Code Quality
- Keep components small and focused on one responsibility.
- Add short comments only where logic isn't self-explanatory (e.g. cart total calculation, not on every line).
- Before finishing any task, run `npx tsc --noEmit` and fix all type errors.

## Responsive Design — Check Every Screen, Every Time
- Every page and component MUST be checked at three widths minimum: mobile (~375px), tablet (~768px), and desktop (~1280px+). Do not consider a UI task "done" until all three look correct.
- Use responsive Tailwind classes (`sm:`, `md:`, `lg:`) rather than fixed pixel widths/heights. Avoid hardcoded `w-[600px]` style values — use `max-w-*` with `w-full` instead so elements shrink on small screens.
- On large screens, content should NOT stretch edge-to-edge or oversized. Wrap page content in a centered container with a sensible max width (e.g. `max-w-6xl mx-auto px-4`) so text, cards, and forms stay readable instead of spreading too wide or components looking oversized.
- Product grids: stack to 1 column on mobile, 2 on tablet, 3–4 on desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` pattern) — never a fixed column count that breaks on small screens.
- Touch targets (buttons, cart icons, quantity steppers) must stay comfortably tappable on mobile — don't shrink interactive elements below a reasonable size just to fit more on screen.
- After building any component, explicitly resize the browser (or use dev tools device toolbar) and confirm nothing overflows horizontally, text doesn't get cut off, and nothing looks stretched or oversized on a large monitor.

## Image Optimization
- All product images MUST be served from Supabase Storage and displayed via `<Image />` from next/image.
- **Never use `<img>` tags for product images**, always use `import Image from 'next/image'` and `<Image ... />` with `width`, `height`, and `alt` props.
- Ensure every `<Image />` component has `alt="Product name"` for accessibility.
- When a component resizes the image (e.g. in a responsive grid), use `fill` mode with `className="object-cover"` to let the image adapt cleanly to different card sizes without distortion.
- Do NOT use inline `width`/`height` values for `Image` when the size varies by breakpoint — let `fill` + responsive `className` handle the scaling so images never break layouts or overflow.
- Never rely on automatic sizing without `width`/`height` or `fill` — Next.js requires size information for `Image`, so always provide it via props or `fill` + CSS sizing.

## Colors — Use the Theme, Never Hardcode

- Never hardcode raw Tailwind color utilities like `bg-red-400`, `text-blue-500`, `border-gray-200`, etc. directly in components.
- Use the semantic color tokens already defined by the shadcn theme (in `globals.css` / `tailwind.config`) instead: `bg-primary`, `text-primary-foreground`, `bg-destructive`, `text-muted-foreground`, `bg-secondary`, `bg-accent`, `border-border`, `bg-background`, `text-foreground`, etc.
- If a needed semantic color doesn't exist yet (e.g. a "success" green for "Order confirmed", or a specific brand color for the shop), add it ONCE as a CSS variable/token in the theme file, then reference it by name everywhere — never repeat the same raw hex or Tailwind color class across multiple components.
- This applies to every use case: buttons, badges, borders, backgrounds, hover/focus states, and status indicators (in stock / out of stock / order status).
- Before styling anything with a color, check the existing theme tokens first. Only introduce a new token if none of the existing ones fit — and if you do, explain why in your response.
