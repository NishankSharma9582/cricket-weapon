import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { dispalyMoney, generateDiscountedPrice } from "../DisplayMoney/DisplayMoney";
import { addItemToCart } from "../../actions/cartAction";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const restoredPrice = Number(product.price) || 0;
  const discounted = +generateDiscountedPrice(restoredPrice);
  const discountPct =
    restoredPrice > 0
      ? Math.round(((restoredPrice - discounted) / restoredPrice) * 100)
      : 0;

  const outOfStock = Number(product.Stock) === 0;
  const rating = Number(product.ratings) || 0;
  const reviews = Number(product.numOfReviews) || 0;

  const addTocartHandler = (id, qty) => dispatch(addItemToCart(id, qty));

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass glass-card group flex h-full w-full flex-col overflow-hidden rounded-2xl"
    >
      {/* Image area — fixed ratio, badge floats over image only */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Link to={`/product/${product._id}`} aria-label={product.name}>
          <img
            src={product.images[0].url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {discountPct > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-brand px-2.5 py-1 text-[0.7rem] font-bold text-white shadow-glow">
            −{discountPct}%
          </span>
        )}
      </div>

      {/* Content block */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category chip — 1 line, fixed height */}
        <p className="h-4 truncate text-[0.7rem] font-bold uppercase tracking-wide text-brand">
          {product.category || "Cricket Gear"}
        </p>

        {/* Product name — exactly 2 reserved lines */}
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-ink-900">
          <Link
            to={`/product/${product._id}`}
            className="transition hover:text-brand"
          >
            {product.name}
          </Link>
        </h3>

        {/* Rating row — always present, fixed height */}
        <div className="mt-1.5 flex h-4 items-center gap-1.5">
          {rating > 0 ? (
            <>
              <span className="flex items-center gap-px text-brand">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    strokeWidth={2}
                    className={
                      i <= Math.round(rating)
                        ? "fill-brand"
                        : "fill-ink-200 text-ink-300"
                    }
                  />
                ))}
              </span>
              <span className="text-xs text-ink-500">({reviews})</span>
            </>
          ) : (
            <span className="text-xs text-ink-400">No reviews yet</span>
          )}
        </div>

        {/* Footer — pinned to bottom via mt-auto */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink-200/60 pt-3">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <span className="truncate text-base font-extrabold text-ink-900">
              {dispalyMoney(discounted)}
            </span>
            <del className="shrink-0 text-xs text-ink-400">
              {dispalyMoney(restoredPrice)}
            </del>
          </div>

          <button
            onClick={() => addTocartHandler(product._id, 1)}
            disabled={outOfStock}
            aria-label={outOfStock ? "Out of stock" : "Add to cart"}
            title={outOfStock ? "Out of stock" : "Add to cart"}
            className={
              outOfStock
                ? "grid h-9 w-9 shrink-0 cursor-not-allowed place-items-center rounded-full bg-ink-200 text-ink-500"
                : "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-brand text-white shadow-glow transition hover:scale-105"
            }
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;