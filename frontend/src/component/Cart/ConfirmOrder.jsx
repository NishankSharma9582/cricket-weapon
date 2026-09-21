import React from "react";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Package } from "lucide-react";
import CheckoutSteps from "./CheckoutSteps ";
import { useSelector } from "react-redux";
import MetaData from "../layouts/MataData/MataData";
import { Link } from "react-router-dom";
import Loader from "../layouts/loader/Loader";
import { PageShell } from "../../ui/kit";

function ConfirmOrder() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.userData);

  const subTotal = cartItems.reduce((acc, currItem) => {
    return acc + currItem.quantity * currItem.price;
  }, 0);

  const shippingCharges = subTotal > 1000 ? 0 : 99;
  const gst = subTotal * 0.18;
  const totalFinalPrice = subTotal + gst + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  function proceedToPayment() {
    const data = { subTotal, shippingCharges, gst, totalFinalPrice };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
  }

  return (
    <PageShell>
      <MetaData title="Confirm Order" />
      {loading ? (
        <Loader />
      ) : (
        <div className="mx-auto w-full max-w-6xl px-5 pb-16">
          <CheckoutSteps activeStep={1} />

          <div className="mt-2 grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left: shipping + items */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass glass-card p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
                  <MapPin size={18} className="text-brand" /> Shipping Info
                </h2>
                <div className="mt-4 space-y-3 text-sm">
                  <Row label="Name" value={user.name} />
                  <Row label="Phone" value={shippingInfo.phoneNo} />
                  <Row label="Address" value={address} />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass glass-card p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
                  <Package size={18} className="text-brand" /> Your Cart Items
                </h2>
                <div className="mt-4 divide-y divide-ink-200/60">
                  {cartItems &&
                    cartItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-4 py-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 shrink-0 rounded-lg bg-white/80 object-contain p-1"
                        />
                        <Link
                          to={`/product/${item.productId}`}
                          className="flex-1 text-sm font-medium text-ink-800 hover:text-brand"
                        >
                          {item.name}
                        </Link>
                        <span className="text-sm text-ink-600">
                          {item.quantity} × ₹{item.price} ={" "}
                          <b className="text-ink-900">₹{item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>

            {/* Right: summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="glass glass-card h-fit p-6 lg:sticky lg:top-28"
            >
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
                <ShieldCheck size={18} className="text-brand" /> Order Summary
              </h2>
              <div className="mt-4 space-y-3 border-b border-ink-200/60 pb-4 text-sm">
                <SummaryRow label="Subtotal" value={`₹${subTotal}`} />
                <SummaryRow label="Shipping Charges" value={`₹${shippingCharges}`} />
                <SummaryRow label="GST (18%)" value={`₹${gst.toFixed(2)}`} />
              </div>
              <div className="mt-4 flex items-center justify-between text-base font-bold text-ink-900">
                <span>Total:</span>
                <span className="text-brand">₹{totalFinalPrice.toFixed(2)}</span>
              </div>
              <Link to="/process/payment" className="btn-brand mt-6 w-full" onClick={proceedToPayment}>
                Proceed To Payment
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

const Row = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:gap-2">
    <b className="w-24 shrink-0 uppercase tracking-wide text-ink-500">{label}:</b>
    <span className="text-ink-800">{value}</span>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-ink-600">{label}</span>
    <span className="font-semibold text-ink-900">{value}</span>
  </div>
);

export default ConfirmOrder;