import { useRef, useState } from "react";
import { gsap, useGSAP } from "../animations/gsap";
import {
  categories,
  products,
  money,
  type Category,
  type Product,
} from "../data/products";
import { content } from "../data/content";
import { Icon } from "../components/Icon";
import { ProductImage } from "../components/ProductImage";
export function ProductGallery({
  category,
  onCategory,
  onDetails,
  onAdd,
}: {
  category: Category;
  onCategory: (value: Category) => void;
  onDetails: (product: Product) => void;
  onAdd: (product: Product, quantity: number) => void;
}) {
  const [selectedId, setSelectedId] = useState("dick-trio");
  const filtered = products.filter(
    (p) => category === "all" || p.categories.includes(category),
  );
  const active = filtered.find((p) => p.id === selectedId) || filtered[0];
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion:no-preference)", () => {
        gsap.from(".section-heading h2", {
          clipPath: "inset(0% 0% 100% 0%)",
          y: 14,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".featured-photo picture",
          { opacity: 0.25, y: 10 },
          { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
        );
        gsap.fromTo(
          ".featured-caption",
          { opacity: 0.3, y: 6 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [active.id], revertOnUpdate: true },
  );
  return (
    <section
      id="menu"
      className="shell menu-section"
      ref={ref}
      aria-labelledby="menu-heading"
    >
      <div className="section-heading">
        <h2 id="menu-heading">{content.menu.title}</h2>
      </div>
      <div className="menu-layout">
        <div className="menu-showcase">
          <div className="category-tabs" role="group" aria-label="Filter menu">
            {categories.map((item) => (
              <button
                key={item.id}
                aria-pressed={category === item.id}
                onClick={() => onCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="featured-product">
            <button
              className={`featured-photo ${active.image}`}
              onClick={() => onDetails(active)}
              aria-label={`View ${active.name}`}
            >
              <ProductImage
                key={active.image}
                image={active.image}
                alt={active.imageAlt || active.contents}
                loading="lazy"
              />
              <span className="image-action">
                <Icon name="plus" />
              </span>
            </button>
            <div className="featured-caption">
              <h3>{active.name}</h3>
            </div>
          </div>
        </div>
        <div className="product-menu">
          <div className="product-list" aria-label="Products">
            {filtered.map((product) => (
              <button
                className={`product-row ${active.id === product.id ? "selected" : ""}`}
                key={product.id}
                onClick={() => setSelectedId(product.id)}
                aria-pressed={active.id === product.id}
              >
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.contents}</small>
                </span>
                <span className="row-price">{money(product.price)}</span>
                <span className="row-mark" aria-hidden="true">
                  {active.id === product.id ? <Icon name="check" /> : null}
                </span>
              </button>
            ))}
          </div>
          <div className="selected-actions">
            <button className="button primary" onClick={() => onAdd(active, 1)}>
              Add to bag · {money(active.price)}
            </button>
            <button className="text-link" onClick={() => onDetails(active)}>
              Product details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
