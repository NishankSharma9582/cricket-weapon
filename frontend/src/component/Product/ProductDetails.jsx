import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Check, X, Truck, ShoppingCart, Star, Package } from "lucide-react";
import {
  generateDiscountedPrice,
  calculateDiscount,
  dispalyMoney,
} from "../DisplayMoney/DisplayMoney";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import useActive from "../hook/useActive";
import ReviewCard from "./ReviewCard";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import { addItemToCart } from "../../actions/cartAction";
import Loader from "../layouts/loader/Loader";
import { PRODUCT_DETAILS_RESET } from "../../constants/productsConstatns";
import { PageShell, fadeUp } from "../../ui/kit";

const ProductDetails = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [quantity, setQuantity] = useState(1);
  const [previewImg, setPreviewImg] = useState("");
  const { handleActive, activeClass } = useActive(0);

  const { product, loading, error, success } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success && product.images && product.images.length > 0) {
      setPreviewImg(product.images[0].url);
      handleActive(0);
      dispatch({ type: PRODUCT_DETAILS_RESET });
    }
    dispatch(getProductDetails(match.params.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, alert, success, match.params.id]);

  const handleAddItem = () => {
    dispatch(addItemToCart(match.params.id, quantity));
    alert.success("Item Added To Cart");
  };

  const handlePreviewImg = (images, i) => {
    setPreviewImg(images[i].url);
    handleActive(i);
  };

  function increaseQuantityHandler() {
    if (product.Stock <= quantity) return;
    setQuantity((prv) => prv + 1);
  }

  function deceraseQuantityHandler() {
    if (quantity <= 1) return;
    setQuantity((prv) => prv - 1);
  }

  const finalPrice = product.price ? generateDiscountedPrice(product.price) : 0;
  const discountedPrice = product.price ? product.price - finalPrice : 0;
  const newPrice = dispalyMoney(finalPrice);
  const oldPrice = dispalyMoney(product.price);
  const savedPrice = dispalyMoney(discountedPrice);
  const savedDiscount = product.price ? calculateDiscount(discountedPrice, product.price) : 0;

  return (
    <PageShell>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={product.name} />
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="grid gap-10 lg:grid-cols-2"
            >
              {/* Gallery */}
              <div className="flex flex-col-reverse gap-4 sm:flex-row">
                <div className="flex gap-3 sm:flex-col">
                  {product.images &&
                    product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => handlePreviewImg(product.images, i)}
                        aria-label="Select image"
                        className={`w-20 overflow-hidden rounded-xl border-2 bg-white/80 p-1 transition ${
                          activeClass(i)
                            ? "border-brand shadow-glow"
                            : "border-ink-200 hover:border-brand/40"
                        }`}
                      >
                        <img src={img.url} alt="product" className="aspect-square w-full object-contain" />
                      </button>
                    ))}
                </div>
                <div className="glass glass-card relative flex-1 overflow-hidden p-6">
                  <span className="absolute right-5 top-5 rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-bold text-white shadow-glow">
                    {savedDiscount}% OFF
                  </span>
                  <img
                    src={previewImg}
                    alt={product.name}
                    className="aspect-square w-full object-contain"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-dark">
                    <Package size={13} /> {product.category}
                  </span>
                  <h1 className="mt-3 text-2xl font-bold leading-snug text-ink-900 md:text-3xl">
                    {product.name}
                  </h1>
                  {product.info && (
                    <p className="mt-2 text-sm text-ink-500">{product.info}</p>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex items-center gap-px text-brand">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={16} className={i <= Math.round(product.ratings) ? "fill-brand" : "fill-ink-200 text-ink-300"} />
                      ))}
                    </span>
                    <Link
                      to="#"
                      className="text-sm font-medium text-ink-500 hover:text-brand"
                    >
                      {product.numOfReviews} Ratings
                    </Link>
                  </div>
                </div>

                <div className="glass glass-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="text-3xl font-bold text-ink-900">{newPrice}</span>
                        <del className="text-base text-ink-400">{oldPrice}</del>
                      </p>
                      <p className="mt-1 text-sm font-semibold text-emerald-600">
                        You save: {savedPrice} ({savedDiscount}%)
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        (Inclusive of all taxes)
                      </p>
                    </div>
                    {product.Stock >= 1 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        <Check size={14} /> In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3 py-1.5 text-xs font-bold text-brand-dark">
                        <X size={14} /> Out of stock
                      </span>
                    )}
                  </div>
                </div>

                <div className="glass glass-card space-y-4 p-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-ink-700">
                      Description
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {product.description}
                    </p>
                  </div>
                  <div className="h-px bg-ink-200/70" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-ink-700">
                      Offers &amp; Discounts
                    </h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink-600">
                      <li>No Cost EMI on Credit Card</li>
                      <li>Pay Later &amp; Avail Cashback</li>
                    </ul>
                  </div>
                  <div className="h-px bg-ink-200/70" />
                  <p className="flex items-center gap-2 text-sm font-medium text-ink-600">
                    <Truck size={17} className="text-brand" />
                    We deliver! Just say when and how.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="glass flex items-center gap-1 rounded-xl p-1.5">
                    <button
                      onClick={deceraseQuantityHandler}
                      aria-label="Decrease quantity"
                      className="grid h-10 w-10 place-items-center rounded-lg text-ink-700 transition hover:bg-brand/5 hover:text-brand"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      readOnly
                      type="number"
                      value={quantity}
                      aria-label="Quantity"
                      className="w-12 bg-transparent text-center text-base font-semibold text-ink-900 outline-none"
                    />
                    <button
                      onClick={increaseQuantityHandler}
                      aria-label="Increase quantity"
                      className="grid h-10 w-10 place-items-center rounded-lg text-ink-700 transition hover:bg-brand/5 hover:text-brand"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddItem}
                    disabled={product.Stock <= 0}
                    className="btn-brand flex-1 !justify-center sm:flex-none"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-16">
              <ReviewCard product={product} />
            </motion.div>
          </div>
        </>
      )}
    </PageShell>
  );
};

export default ProductDetails;