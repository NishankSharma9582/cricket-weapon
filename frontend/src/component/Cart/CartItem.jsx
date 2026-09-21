import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

function CartItem({
  deleteCartItems,
  item,
  decreaseQuantity,
  increaseQuantity,
}) {
  let finalPrice = generateDiscountedPrice(item.price);
  let discountedPrice = item.price - finalPrice;
  discountedPrice = dispalyMoney(discountedPrice);
  let total = finalPrice * item.quantity;
  total = dispalyMoney(total);
  finalPrice = dispalyMoney(finalPrice);

  return (
    <div className="glass glass-card flex w-full flex-col gap-5 p-5 sm:flex-row sm:items-center">
      <img
        src={item.image}
        alt={item.name}
        className="h-36 w-36 shrink-0 rounded-xl bg-white/80 object-contain p-2"
      />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <LinkWrapper name={item.name} />
          <button
            aria-label={`Remove ${item.name}`}
            onClick={() => deleteCartItems(item.productId)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-500 transition hover:bg-brand/10 hover:text-brand"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Price
            </p>
            <p className="mt-0.5 flex items-baseline gap-2">
              <span className="text-base font-bold text-ink-900">{finalPrice}</span>
              <del className="text-xs text-ink-400">{discountedPrice}</del>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              QTY
            </p>
            <div className="glass mt-1 flex items-center gap-1 rounded-lg p-1">
              <button
                onClick={() => decreaseQuantity(item.productId, item.quantity)}
                aria-label="Decrease quantity"
                className="grid h-8 w-8 place-items-center rounded-md text-ink-700 transition hover:bg-brand/5 hover:text-brand"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-ink-900">
                {item.quantity}
              </span>
              <button
                onClick={() => increaseQuantity(item.productId, item.quantity, item.stock)}
                aria-label="Increase quantity"
                className="grid h-8 w-8 place-items-center rounded-md text-ink-700 transition hover:bg-brand/5 hover:text-brand"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <div className="ml-auto">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Total
            </p>
            <p className="mt-0.5 text-base font-bold text-ink-900">{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkWrapper({ name }) {
  return <h3 className="text-base font-semibold leading-snug text-ink-800">{name}</h3>;
}

export default CartItem;