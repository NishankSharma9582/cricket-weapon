import React, { useState } from "react";
import { RotateCcw, Eye, MessageSquareText, MapPin, CheckCircle2, Clock } from "lucide-react";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { addItemToCart } from "../../actions/cartAction";
import { useHistory } from "react-router-dom";
import DialogBox from "../Product/DialogBox";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};

const OrderCard = ({ item, user }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { shippingInfo = {}, orderItems = [] } = item;
  const orderTotal =
    item.totalPrice ??
    orderItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const addToCartHandler = (id, qty = 1) => {
    dispatch(addItemToCart(id, qty));
    alert.success("Item Added to Cart");
    history.push("/cart");
  };

  const handleClickOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const delivered = String(item.orderStatus || "").toLowerCase() === "delivered";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Order meta bar */}
      <div className="flex flex-col gap-3 bg-gray-900 px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Order ID
            </p>
            <p className="font-mono text-sm font-semibold text-red-400">
              #{item._id}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Placed on
            </p>
            <p className="font-medium text-white">{formatDate(item.createdAt)}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Total
            </p>
            <p className="font-bold text-white">₹{Number(orderTotal).toLocaleString("en-IN")}</p>
          </div>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            delivered
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-amber-500/20 text-amber-300"
          }`}
        >
          {delivered ? <CheckCircle2 size={14} /> : <Clock size={14} />}
          {item.orderStatus || "Processing"}
        </span>
      </div>

      {/* Body */}
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_300px]">
        {/* Items */}
        <div className="divide-y divide-gray-100">
          {orderItems.map((product) => (
            <div key={product.productId} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row">
              <img
                src={product.image}
                alt={product.name}
                className="h-24 w-24 shrink-0 rounded-xl border border-gray-100 bg-white object-contain p-2"
              />
              <div className="flex flex-1 flex-col justify-center">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Qty: <b className="text-gray-700">{product.quantity}</b>
                  {"  "}·{"  "}₹{product.price} each
                </p>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  ₹{(product.price * product.quantity).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:flex-col lg:justify-center">
                <button
                  onClick={() => addToCartHandler(product.productId, 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  <RotateCcw size={13} /> Buy Again
                </button>
                <button
                  onClick={() => history.push(`/product/${product.productId}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-red-400 hover:text-red-600"
                >
                  <Eye size={13} /> View Item
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery summary */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
            <MapPin size={15} className="text-red-600" />
            {(user && user.name) || "Customer"}
          </p>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Delivery Address
            </p>
            {shippingInfo.address && <p>{shippingInfo.address}</p>}
            {shippingInfo.city && (
              <p>
                {shippingInfo.city}, {shippingInfo.state}{" "}
                {shippingInfo.country ? `, ${shippingInfo.country}` : ""} -{" "}
                {shippingInfo.pinCode}
              </p>
            )}
            {shippingInfo.phoneNo && <p>Phone: {shippingInfo.phoneNo}</p>}
            {item.paymentInfo && item.paymentInfo.status && (
              <p className="pt-1 text-xs text-gray-500">
                Payment: {item.paymentInfo.status}
              </p>
            )}
          </div>
          <button
            onClick={() => handleClickOpen(orderItems[0]?.productId)}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-red-400 hover:text-red-600"
          >
            <MessageSquareText size={13} /> Write a Review
          </button>
        </div>
      </div>

      {selectedId && <DialogBox open={open} handleClose={handleClose} id={selectedId} />}
    </div>
  );
};

export default OrderCard;