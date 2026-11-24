import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { SiteHeader } from "./components/SiteHeader";
import { Hero } from "./sections/Hero";
import { AboutSection } from "./sections/AboutSection";
import { VisitSection } from "./sections/VisitSection";
import { ProductGallery } from "./sections/ProductGallery";
import { Overlay } from "./components/Overlay";
import { ProductDetails } from "./components/ProductDetails";
import { CartDrawer } from "./components/CartDrawer";
import { useCart, MAX_QUANTITY } from "./hooks/useCart";
import { type Category, type Product } from "./data/products";
import { Icon } from "./components/Icon";
const ReviewTools = import.meta.env.DEV
  ? lazy(() => import("./components/ReviewTools"))
  : null;
type Panel =
  | { type: "product"; product: Product }
  | { type: "cart" }
  | { type: "navigation" }
  | null;
export default function App() {
  const cart = useCart();
  const [panel, setPanel] = useState<Panel>(null);
  const [category, setCategory] = useState<Category>("all");
  const [feedback, setFeedback] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  function add(product: Product, quantity: number) {
    const existing =
      cart.items.find((item) => item.id === product.id)?.quantity || 0;
    const added = Math.min(quantity, MAX_QUANTITY - existing);
    if (added > 0) cart.add(product.id, added);
    setFeedback(
      added > 0
        ? `${added === 1 ? product.name : `${added} × ${product.name}`} added to your bag.`
        : `Your bag already holds the limit of ${MAX_QUANTITY} for this item.`,
    );
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(""), 4000);
  }
  return (
    <>
      <div className="site-backdrop" aria-hidden="true">
        <picture>
          <source type="image/avif" srcSet="/assets/continuous-velvet.avif" />
          <img
            src="/assets/continuous-velvet.webp"
            width="724"
            height="2172"
            alt=""
            decoding="async"
          />
        </picture>
      </div>
      <a className="skip-link" href="#menu">
        Skip to menu
      </a>
      <SiteHeader
        count={cart.count}
        onCart={() => setPanel({ type: "cart" })}
        onMenu={() => setPanel({ type: "navigation" })}
      />
      <main>
        <Hero />
        <ProductGallery
          category={category}
          onCategory={setCategory}
          onDetails={(product) => setPanel({ type: "product", product })}
          onAdd={add}
        />
        <AboutSection />
        <VisitSection />
      </main>
      {panel ? (
        <Overlay
          title={
            panel.type === "product"
              ? panel.product.name
              : panel.type === "cart"
                ? "Your bag"
                : "Come on in."
          }
          variant={
            panel.type === "product"
              ? "product"
              : panel.type === "navigation"
                ? "navigation"
                : "drawer"
          }
          onClose={() => setPanel(null)}
        >
          {panel.type === "product" ? (
            <ProductDetails
              key={panel.product.id}
              product={panel.product}
              onAdd={(quantity) => {
                add(panel.product, quantity);
                setPanel(null);
              }}
            />
          ) : panel.type === "cart" ? (
            <CartDrawer cart={cart} onClose={() => setPanel(null)} />
          ) : (
            <nav className="mobile-navigation" aria-label="Mobile navigation">
              <a href="#menu" onClick={() => setPanel(null)}>
                Menu
              </a>
              <a href="#bar" onClick={() => setPanel(null)}>
                The bar
              </a>
              <a href="#visit" onClick={() => setPanel(null)}>
                Find us
              </a>
              <button onClick={() => setPanel({ type: "cart" })}>
                Your bag <span>({cart.count})</span>
              </button>
            </nav>
          )}
        </Overlay>
      ) : null}
      <div
        className={`toast ${feedback ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {feedback ? (
          <>
            <Icon name="check" />
            <span>{feedback}</span>
            <button
              onClick={() => {
                setFeedback("");
                setPanel({ type: "cart" });
              }}
            >
              View bag
            </button>
          </>
        ) : null}
      </div>
      {ReviewTools ? (
        <Suspense fallback={null}>
          <ReviewTools />
        </Suspense>
      ) : null}
    </>
  );
}
