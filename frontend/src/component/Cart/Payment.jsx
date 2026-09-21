import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CreditCard,
  CalendarDays,
  Lock,
  ShieldCheck,
  Pencil,
  Tag,
} from "lucide-react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { TextField, Radio } from "@mui/material";

import MetaData from "../layouts/MataData/MataData";
import OrderDetailsSection from "./OrderDetails";
import DummyCard from "./DummyCard";
import CheckoutSteps from "./CheckoutSteps ";
import { clearErrors, createOrder } from "../../actions/orderAction";

import { ReactComponent as MasterCard } from "../../Image/payment-svg/mastercard.svg";
import { ReactComponent as Visa } from "../../Image/payment-svg/visa (1).svg";
import { ReactComponent as Paytm } from "../../Image/payment-svg/paytm.svg";

const stripeField =
  "field !py-3.5 font-mono !tracking-wider transition focus-within:!border-brand";

const inr = (n) =>
  "₹" +
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const PaymentComponent = () => {
  const history = useHistory();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.userData);
  const { error } = useSelector((state) => state.newOrder);

  const [, setIsFocused] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showDummyCard, setShowDummyCard] = useState(false);

  const subTotal = cartItems.reduce(
    (acc, currItem) => acc + currItem.quantity * currItem.price,
    0,
  );

  const storedOrderInfo = sessionStorage.getItem("orderInfo");
  let orderInfo = null;
  try {
    orderInfo = storedOrderInfo ? JSON.parse(storedOrderInfo) : null;
  } catch (e) {
    orderInfo = null;
  }

  const shippingCharges =
    orderInfo?.shippingCharges ?? (subTotal > 1000 ? 0 : 99);
  const taxPrice = orderInfo?.gst ?? Math.round(subTotal * 0.18 * 100) / 100;
  const totalFinalPrice =
    orderInfo?.totalFinalPrice ?? subTotal + shippingCharges + taxPrice;

  const handleNameOnCardChange = (e) => setNameOnCard(e.target.value);
  const handleApplyCoupon = () => setIsValid(false);
  const handleFocus = (event) => setIsFocused(event.target.value !== "");
  const handleRadioChange = () => setShowDummyCard((v) => !v);
  const handleCloseDummyCard = () => setShowDummyCard(false);

  const address = `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country || "India"}`;

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: subTotal,
    shippingPrice: shippingCharges,
    taxPrice,
    totalPrice: totalFinalPrice,
  };

  const paymentData = { amount: Math.round(totalFinalPrice * 100) };

  async function paymentSubmitHandler(e) {
    e.preventDefault();

    if (nameOnCard.trim() === "") {
      alert.error("Please enter name on card");
      return;
    }
    if (!stripe || !elements) {
      alert.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      alert.error("Please enter valid card details");
      return;
    }
    if (!paymentData.amount || paymentData.amount <= 0) {
      alert.error("Invalid payment amount");
      return;
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config,
      );
      const client_secret = data.client_secret;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: nameOnCard || user.name || "Customer",
            email: user.email || "",
            address: {
              line1: shippingInfo.address,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: "IN",
            },
          },
        },
      });

      if (result.error) {
        alert.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };
        alert.success("Payment successful");
        dispatch(createOrder(order));
        history.push("/success");
      } else {
        alert.error("There's some issue while processing payment");
      }
    } catch (error) {
      if (error.response) {
        alert.error(
          error.response.data?.message || "Payment processing failed on server",
        );
      } else if (error.request) {
        alert.error(
          "Unable to connect to payment server. Please check your connection.",
        );
      } else {
        alert.error(
          error.message || "An unexpected error occurred during payment",
        );
      }
    }
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  return (
    <>
      <div className="min-h-screen pb-20 pt-4">
        <CheckoutSteps activeStep={2} />
        <MetaData title="Payment" />

        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Payment method */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass glass-card p-6 sm:p-8"
            >
              <h1 className="text-xl font-extrabold uppercase tracking-wide text-ink-900">
                Payment method
              </h1>

              <p className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-600/20 bg-emerald-50/70 px-4 py-3 text-xs font-medium text-emerald-800">
                <ShieldCheck size={18} className="shrink-0" />
                Payments are SSL encrypted so that your credit card and payment
                details stay safe.
              </p>

              <form
                onSubmit={paymentSubmitHandler}
                className="glass mt-6 rounded-2xl p-5 sm:p-6"
              >
                <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
                  <CreditCard size={19} className="text-brand" /> Credit Card
                </h2>

                <div className="mt-5 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-600">
                      Card number
                    </label>
                    <div className="relative">
                      <CreditCard
                        size={18}
                        className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-ink-400"
                      />
                      <CardNumberElement className={`${stripeField} !pl-11`} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <MasterCard style={{ width: "auto", height: 30 }} />
                    <Visa style={{ width: "auto", height: 30 }} />
                    <Paytm style={{ width: "auto", height: 30 }} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-600">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <CalendarDays
                          size={18}
                          className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-ink-400"
                        />
                        <CardExpiryElement
                          className={`${stripeField} !pl-11`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-600">
                        CVV
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-ink-400"
                        />
                        <CardCvcElement className={`${stripeField} !pl-11`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-600">
                      Name on Card
                    </label>
                    <TextField
                      placeholder="John Doe"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{ className: "field !px-0" }}
                      value={nameOnCard}
                      required
                      onChange={handleNameOnCardChange}
                    />
                  </div>
                </div>

                <label className="mt-5 flex cursor-pointer items-center gap-3">
                  <Radio
                    value="dummyCard"
                    checked={showDummyCard}
                    onChange={handleRadioChange}
                    color="default"
                    size="small"
                    className="!p-0 !text-ink-900"
                  />
                  <span className="text-sm font-medium text-ink-700">
                    Use dummy card
                  </span>
                  <CreditCard size={18} className="text-ink-400" />
                </label>
                {showDummyCard && <DummyCard onClose={handleCloseDummyCard} />}

                <p className="mt-4 text-xs leading-relaxed text-ink-500">
                  By clicking "Place Order", you agree to our{" "}
                  <button
                    type="button"
                    className="font-semibold text-ink-900 underline hover:text-brand"
                  >
                    Cricket Weapon Terms & Conditions
                  </button>
                </p>

                <button type="submit" className="btn-brand mt-6 w-full">
                  Place Order · {inr(totalFinalPrice)}
                </button>
              </form>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass glass-card h-fit p-6 lg:sticky lg:top-28"
            >
              <h2 className="text-lg font-bold text-ink-900">
                Order Summary&nbsp;({cartItems.length}{" "}
                {cartItems.length > 1 ? "items" : "item"})
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">
                    Subtotal ({cartItems.length} item
                    {cartItems.length > 1 ? "s" : ""})
                  </span>
                  <p className="font-semibold text-ink-900">{inr(subTotal)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">Delivery</span>
                  <p className="font-semibold text-ink-900">
                    {shippingCharges > 0 ? (
                      inr(shippingCharges)
                    ) : (
                      <b className="text-emerald-600">FREE</b>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">GST (18%)</span>
                  <p className="font-semibold text-ink-900">{inr(taxPrice)}</p>
                </div>
              </div>

              <div className="my-4 border-t border-dashed border-ink-300" />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-ink-900">
                    Total Price
                  </h4>
                  <p className="text-xs text-ink-500">
                    (Inclusive of all taxes)
                  </p>
                </div>
                <p className="text-lg font-extrabold text-brand">
                  {inr(totalFinalPrice)}
                </p>
              </div>

              <div className="mt-6 flex gap-2">
                <TextField
                  label="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={() => setIsFocused(false)}
                  error={!isValid}
                  helperText={!isValid && "Invalid coupon code"}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{ className: "field !px-0" }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="btn-brand shrink-0 !px-5 text-sm"
                >
                  <Tag size={15} /> Apply
                </button>
              </div>

              <div className="mt-6">
                <h5 className="text-sm font-extrabold uppercase tracking-wide text-ink-800">
                  Order Details
                </h5>
                <div className="mt-3 divide-y divide-ink-200/60">
                  {cartItems &&
                    cartItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={`/product/${item.productId}`}
                        className="block text-inherit no-underline"
                      >
                        <OrderDetailsSection
                          item={item}
                          totalDiscount=""
                          totalPrice={inr(item.price * item.quantity)}
                        />
                      </Link>
                    ))}
                </div>
              </div>

              <div className="mt-6 border-t border-ink-200/60 pt-5">
                <AddressBlock
                  title="Delivery Address"
                  userName={user.name}
                  userEmail={user.email}
                  address={address}
                  phoneNo={shippingInfo.phoneNo}
                  history={history}
                />
                <div className="mt-5">
                  <AddressBlock
                    title="Billing Details"
                    userName={user.name}
                    userEmail={user.email}
                    address={address}
                    phoneNo={shippingInfo.phoneNo}
                    history={history}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

const AddressBlock = ({
  title,
  userName,
  userEmail,
  address,
  phoneNo,
  history,
}) => (
  <div>
    <div className="flex items-start justify-between gap-3">
      <h5 className="text-sm font-extrabold uppercase tracking-wide text-ink-800">
        {title}
      </h5>
      <button
        aria-label="Edit address"
        onClick={() => history.push("/shipping")}
        className="text-ink-500 transition hover:text-brand"
      >
        <Pencil size={17} />
      </button>
    </div>
    <div className="mt-2 space-y-1 text-sm font-normal text-ink-700">
      <p>{userName}</p>
      <p>{address}</p>
      <p>{phoneNo},</p>
      <p>{userEmail}</p>
    </div>
  </div>
);

export default PaymentComponent;
