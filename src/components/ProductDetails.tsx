import { useState } from "react";
import { type Product, money } from "../data/products";
import { Quantity } from "./Quantity";
import { ProductImage } from "./ProductImage";
export function ProductDetails({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="product-details">
      <div className={`detail-image ${product.image}`}>
        <ProductImage
          image={product.image}
          alt={product.imageAlt || product.contents}
        />
      </div>
      <div className="detail-content">
        <p className="detail-contents">{product.contents}</p>
        <p>{product.description}</p>
        <p className="small-note">
          Decoration shown is illustrative. Ask the bar about ingredients and
          allergens before ordering.
        </p>
        <div className="detail-order">
          <Quantity
            value={quantity}
            onChange={setQuantity}
            label={product.name}
          />
          <span className="detail-price">
            {money(product.price * quantity)}
          </span>
        </div>
        <button
          className="button primary full-width"
          onClick={() => onAdd(quantity)}
        >
          Add to bag · {money(product.price * quantity)}
        </button>
        <p className="small-note">
          Reference menu price. Availability is confirmed at the bar.
        </p>
      </div>
    </div>
  );
}
