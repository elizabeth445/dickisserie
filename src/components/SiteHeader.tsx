import { Icon } from "./Icon";
import { content } from "../data/content";
export function SiteHeader({
  count,
  onCart,
  onMenu,
}: {
  count: number;
  onCart: () => void;
  onMenu: () => void;
}) {
  return (
    <>
      <header className="site-header shell">
        <a className="brand" href="#home">
          <img src="/assets/monogram.webp" width="53" height="52" alt="" />
          <span>
            {content.brand}
            <small>{content.descriptor}</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#menu">Menu</a>
          <a href="#bar">The bar</a>
          <a href="#visit">Find us</a>
        </nav>
        <div className="header-actions">
          <button className="cart-trigger" onClick={onCart}>
            <Icon name="bag" />
            <span className="bag-label">Your bag</span>{" "}
            <span className="bag-count">{count}</span>{" "}
            <span className="sr-only">{count === 1 ? "item" : "items"}</span>
          </button>
          <button
            className="mobile-menu icon-button"
            aria-label="Open navigation"
            onClick={onMenu}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
    </>
  );
}
