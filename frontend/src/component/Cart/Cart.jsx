import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Tag, RotateCcw } from "lucide-react";
import { Link, useHistory } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import CartItem from "./CartItem";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";
import { PageShell, EmptyState, stagger, item } from "../../ui/kit";

const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.userData);

  const [couponCode, setCouponCode] = useState("");
  const [isValid, setIsValid] = useState(true);

  const increaseQuantity = (id, quantity, stock) => {
    if (stock <= quantity) return;
    dispatch(addItemToCart(id, quantity + 1));
  };

  const decreaseQuantity = (id, quantity) => {
    if (1 >= quantity) return;
    dispatch(addItemToCart(id, quantity - 1));
  };

  const handleApplyCoupon = () => {
    setIsValid(false);
  };

  const deleteCartItems = (id) => dispatch(removeItemFromCart(id));

  const checkoutHandler = () => {
    history.push(isAuthenticated ? "/shipping" : "/login?redirect=/shipping");
  };

  let totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  let discountedPrice = generateDiscountedPrice(totalPrice);
  let totalDiscount = totalPrice - discountedPrice;
  let final = totalPrice - totalDiscount;
  final = dispalyMoney(final);
  totalDiscount = dispalyMoney(totalDiscount);
  totalPrice = dispalyMoney(totalPrice);

  return (
    <PageShell>
      <MetaData title="Your Cart" />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              <ShoppingBag size={14} /> Cart
            </span>
            <h1 className="mt-2 text-3xl font-bold text-ink-900">Shopping Cart</h1>
            <p className="mt-1 text-sm text-ink-500">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} ·{" "}
              <b className="text-ink-800">{final}</b>
            </p>
          </div>
          <button
            onClick={() => history.push("/products")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            <RotateCcw size={15} /> Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="glass glass-card">
            <EmptyState
              title="Your cart is empty"
              subtitle="Nothing here yet. Let's get shopping!"
            />
            <div className="pb-10 text-center">
              <Link to="/products" className="btn-brand">
                Shop Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {cartItems.map((item) => (
                <motion.div key={item.productId} variants={item}>
                  <CartItem
                    item={item}
                    deleteCartItems={deleteCartItems}
                    decreaseQuantity={decreaseQuantity}
                    increaseQuantity={increaseQuantity}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Summary */}
            <motion.aside
              variants={item}
              initial="hidden"
              animate="visible"
              className="lg:self-start"
            >
              <div className="glass glass-card space-y-5 p-6 lg:sticky lg:top-24">
                <h3 className="text-base font-bold text-ink-800">
                  Order Summary ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})
                </h3>

                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Original Price</dt>
                    <dd className="font-semibold text-ink-800">{totalPrice}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Discount</dt>
                    <dd className="font-semibold text-emerald-600">- {totalDiscount}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Delivery</dt>
                    <dd className="font-bold text-emerald-600">FREE</dd>
                  </div>
                  <div className="h-px bg-ink-200/70" />
                  <div className="flex items-center justify-between">
                    <dt className="text-base font-bold text-ink-900">Total Price</dt>
                    <dd className="text-lg font-bold text-ink-900">{final}</dd>
                  </div>
                  <p className="text-xs text-ink-500">(Inclusive of all taxes)</p>
                </dl>

                {/* Coupon */}
                <div>
                  <label htmlFor="coupon" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
                    <Tag size={13} /> Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon"
                      className="field !py-2.5 text-sm"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setIsValid(true);
                      }}
                    />
                    <button onClick={handleApplyCoupon} className="btn-ghost whitespace-nowrap !px-4 text-sm">
                      Apply
                    </button>
                  </div>
                  {!isValid && (
                    <p className="mt-1 text-xs font-medium text-brand-dark">Invalid coupon code</p>
                  )}
                </div>

                <button onClick={checkoutHandler} className="btn-brand w-full">
                  Checkout <ArrowRight size={18} />
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Cart;