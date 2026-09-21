import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { dispalyMoney, generateDiscountedPrice } from "../DisplayMoney/DisplayMoney";
import { addItemToCart } from "../../actions/cartAction";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const discountPrice = dispalyMoney(generateDiscountedPrice(product.price));
  const oldPrice = dispalyMoney(product.price);

  const truncated =
    product.description.split(" ").slice(0, 8).join(" ") + "...";
  const nameTruncated =
    product.name.length > 42 ? product.name.substring(0, 42) + "..." : product.name;

  const addTocartHandler = (id, qty) => dispatch(addItemToCart(id, qty));

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }}
    >
      <div className="glass glass-card group flex w-full flex-col overflow-hidden">
        <Link
          to={`/product/${product._id}`}
          className="block"
          aria-label={product.name}
        >
          <div className="relative m-3 overflow-hidden rounded-xl bg-white/80">
            <img
              src={product.images[0].url}
              alt={product.name}
              loading="lazy"
              className="aspect-square w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 rounded-full bg-gradient-brand px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-glow">
              New
            </span>
          </div>
        </Link>

        <div className="flex flex-1 flex-col px-4 pb-4">
          <Link to={`/product/${product._id}`}>
            <h3 className="line-clamp-2 min-h-[2.8em] text-[0.95rem] font-semibold leading-snug text-ink-800 hover:text-brand">
              {nameTruncated}
            </h3>
          </Link>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="flex items-center gap-px text-brand">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  strokeWidth={2}
                  className={i <= Math.round(product.ratings) ? "fill-brand" : "fill-ink-200 text-ink-300"}
                />
              ))}
            </span>
            <span className="text-xs text-ink-500">({product.numOfReviews})</span>
          </div>

          <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-500">
            {truncated}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-ink-900">{discountPrice}</span>
            <del className="text-sm text-ink-400">{oldPrice}</del>
          </div>

          <button
            onClick={() => addTocartHandler(product._id, 1)}
            className="btn-brand mt-4 w-full !py-2.5 text-sm"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;