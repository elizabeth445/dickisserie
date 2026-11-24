import { Icon } from "./Icon";
import { MAX_QUANTITY } from "../hooks/useCart";
export function Quantity({
  value,
  onChange,
  label,
  min = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
}) {
  return (
    <div className="quantity" role="group" aria-label={`Quantity for ${label}`}>
      <button
        className="icon-button"
        aria-label={`Decrease ${label} quantity`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Icon name="minus" />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        className="icon-button"
        aria-label={`Increase ${label} quantity`}
        disabled={value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}
