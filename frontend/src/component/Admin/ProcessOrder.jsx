import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateOrder,
  clearErrors,
  getOrderDetails,
} from "../../actions/orderAction";
import { useAlert } from "react-alert";
import { useParams, Link } from "react-router-dom";
import { MapPin, GitBranch, ArrowUpRight, CalendarDays } from "lucide-react";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstant";
import AdminLayout from "./shared/AdminLayout";
import AdminPageHeader from "./shared/AdminPageHeader";
import StatusPill from "./shared/StatusPill";
import Loader from "../layouts/loader/Loader";

function ProcessOrder() {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.deleteUpdateOrder
  );

  const dispatch = useDispatch();
  const alert = useAlert();
  const params = useParams();
  const productId = params.id;

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
    dispatch(getOrderDetails(productId));
  }, [dispatch, alert, error, isUpdated, updateError, productId]);

  useEffect(() => {
    if (order?.orderStatus) setStatus("");
  }, [order?.orderStatus]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(updateOrder(productId, { status }));
  };

  const shippingInfo = order?.shippingInfo;

  return (
    <AdminLayout>
      <AdminPageHeader
        variant="plain"
        title="Process Order"
        subtitle="Review the order and update its shipping status."
        back="/admin/orders"
        breadcrumbs={[
          { label: "Admin" },
          { label: "Orders", to: "/admin/orders" },
          { label: "Process Order" },
        ]}
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-ink-100/80 px-4 py-2 text-xs font-bold text-ink-600">
            <CalendarDays size={14} /> #{productId.slice(-10)}
          </span>
        }
      />

      {loading || !order ? (
        <div className="grid place-items-center py-24">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Order items */}
          <div className="space-y-6 xl:col-span-2">
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <h2 className="text-base font-bold text-ink-900">
                User Order Details
              </h2>
              <div className="mt-4 space-y-4">
                {order.orderItems &&
                  order.orderItems.map((item, idx) => (
                    <Link
                      to={`/product/${item.productId}`}
                      key={idx}
                      className="flex items-center gap-4 rounded-2xl border border-ink-200/60 bg-white/60 p-4 transition hover:border-brand/30 hover:shadow-glow"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-xl border border-ink-200 object-cover sm:h-20 sm:w-20"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1 font-bold text-ink-900">
                          {item.name}
                          <ArrowUpRight size={14} className="text-brand" />
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-ink-500">
                          Quantity: {item.quantity}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <span className="font-bold text-ink-900">
                            ₹{item.price * item.quantity}
                          </span>
                          <span className="text-xs text-ink-400 line-through">
                            ₹{(item.price * item.quantity * 1.2).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
                <MapPin size={17} className="text-brand" /> Delivery Address
              </h2>
              <div className="mt-4 rounded-2xl bg-ink-50/70 p-4 text-sm">
                <p className="font-bold text-ink-900">
                  {order.user && order.user.name}
                </p>
                <p className="mt-1 text-ink-600">
                  {shippingInfo &&
                    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`}
                </p>
                <p className="mt-1 text-ink-500">
                  {shippingInfo && shippingInfo.phoneNo}
                </p>
                <p className="mt-1 text-ink-500">
                  {order.user && order.user.email}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <h2 className="text-base font-bold text-ink-900">Order Summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="font-semibold text-ink-500">Total Price</dt>
                  <dd className="text-xs text-ink-400">
                    (Inclusive of all taxes)
                  </dd>
                  <dd className="font-extrabold text-ink-900">
                    ₹{order.totalPrice && order.totalPrice}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-ink-200/60 pt-3">
                  <dt className="font-semibold text-ink-500">Order Status</dt>
                  <dd>
                    <StatusPill status={order.orderStatus} />
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-semibold text-ink-500">Payment Status</dt>
                  <dd>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
                        ? "PAID"
                        : "NOT PAID"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Process form */}
          {order.orderStatus && order.orderStatus !== "Delivered" && (
            <div className="glass-card h-fit rounded-2xl p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
                <GitBranch size={17} className="text-brand" /> Process Order
              </h2>
              <p className="mt-1 text-xs font-semibold text-ink-500">
                Advance the order to its next stage.
              </p>

              <form onSubmit={updateOrderSubmitHandler} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="order-status"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500"
                  >
                    Next Status
                  </label>
                  <select
                    id="order-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="field w-full"
                  >
                    <option value="">Choose status</option>
                    {order.orderStatus === "Processing" && (
                      <option value="Shipped">Shipped</option>
                    )}
                    {order.orderStatus === "Shipped" && (
                      <option value="Delivered">Delivered</option>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!status}
                  className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Process
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

export default ProcessOrder;