import { useState } from "react";
import { type Cart } from "../hooks/useCart";
import { productById, money } from "../data/products";
import { content } from "../data/content";
import { Quantity } from "./Quantity";
import { Icon } from "./Icon";
export function CartDrawer({
  cart,
  onClose,
}: {
  cart: Cart;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"bag" | "review" | "confirmed">("bag");
  const [pickup, setPickup] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  function confirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pickup || !cart.items.length) return;
    setOrderTotal(cart.total);
    setOrderId(`DCK-${crypto.randomUUID().slice(0, 6).toUpperCase()}`);
    setStep("confirmed");
    cart.clear();
  }
  if (step === "confirmed")
    return (
      <div className="order-confirmation">
        <span className="confirmation-mark">
          <Icon name="check" />
        </span>
        <h3>
          A sweet little
          <br />
          <em>test run</em>
        </h3>
        <p>Your demo order is complete</p>
        <p className="order-reference">
          {orderId}
          <span>{money(orderTotal)}</span>
        </p>
        <p className="demo-note">{content.demo}</p>
        <button className="button primary full-width" onClick={onClose}>
          Keep exploring
        </button>
      </div>
    );
  if (!cart.items.length)
    return (
      <div className="empty-bag">
        <Icon name="bag" />
        <h3>
          Room for
          <br />
          <em>temptation</em>
        </h3>
        <p>Your bag is empty — pick a little pleasure from the menu</p>
        <button
          className="button primary"
          onClick={() => {
            onClose();
            document.getElementById("menu")?.scrollIntoView();
          }}
        >
          Explore the menu
        </button>
      </div>
    );
  return (
    <div className="cart-content">
      {step === "review" ? (
        <div className="review-heading">
          <button className="text-link" onClick={() => setStep("bag")}>
            Back to your bag
          </button>
          <h3>One last look</h3>
        </div>
      ) : null}
      <div className="cart-items">
        {cart.items.map((item) => {
          const product = productById.get(item.id)!;
          return (
            <article className="cart-item" key={item.id}>
              <img
                src={`/assets/${product.image}-thumb.webp`}
                width="96"
                height="96"
                alt=""
              />
              <div className="cart-item-main">
                <h3>{product.name}</h3>
                <p>{money(product.price)} each</p>
                {step === "bag" ? (
                  <Quantity
                    label={product.name}
                    value={item.quantity}
                    onChange={(n) => cart.update(item.id, n)}
                  />
                ) : (
                  <p>Quantity: {item.quantity}</p>
                )}
              </div>
              <div className="cart-item-end">
                <span>{money(product.price * item.quantity)}</span>
                {step === "bag" ? (
                  <button
                    className="remove-button"
                    onClick={() => cart.remove(item.id)}
                    aria-label={`Remove ${product.name}`}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <div className="cart-summary">
        <p>
          <span>Subtotal</span>
          <strong>{money(cart.total)}</strong>
        </p>
        <p className="pickup-location">
          <Icon name="pin" />
          Pickup at Trakų g. 2, Vilnius
        </p>
        {cart.storageError ? (
          <p className="small-note" role="status">
            Your browser could not save the bag — keep this page open to retain
            your selection
          </p>
        ) : null}
        {step === "review" ? (
          <form onSubmit={confirm}>
            <label htmlFor="pickup">Choose a demo pickup window</label>
            <select
              id="pickup"
              name="demo-pickup"
              required
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            >
              <option value="">Select a pickup window</option>
              <option value="soon">As soon as possible (demo)</option>
              <option value="30min">In 30 minutes (demo)</option>
              <option value="60min">In 1 hour (demo)</option>
            </select>
            <p className="demo-note">{content.demo}</p>
            <button className="button primary full-width" type="submit">
              Confirm demo order · {money(cart.total)}
            </button>
          </form>
        ) : (
          <>
            <p className="demo-note">{content.demo}</p>
            <button
              className="button primary full-width"
              onClick={() => setStep("review")}
            >
              Review demo order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
