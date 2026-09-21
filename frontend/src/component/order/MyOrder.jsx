import React, { useEffect } from "react";
import { Package, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { myOrders, clearErrors } from "../../actions/orderAction";
import MetaData from "../layouts/MataData/MataData";
import CricketBallLoader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import OrderCard from "./OrderCard";
import { Link } from "react-router-dom";

const MyOrder = () => {
  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { orders, loading, error } = useSelector((state) => state.myOrder);
  const { user } = useSelector((state) => state.userData);
  const safeOrders = Array.isArray(orders) ? orders : [];

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, alert, error]);

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <MetaData title="My Orders" />

      {/* Page header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Your Orders
              </h1>
              <p className="text-sm text-gray-500">
                Track, review or re-order your purchases.
              </p>
            </div>
          </div>
          <span className="rounded-full border border-gray-300 bg-gray-50 px-4 py-1.5 text-sm font-semibold text-gray-700">
            {safeOrders.length} order{safeOrders.length !== 1 && "s"} in {currentYear}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <CricketBallLoader />
          </div>
        ) : safeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Package size={30} className="text-gray-400" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">No orders yet</h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              When you place an order it will show up here. Head to the shop and
              grab some cricket gear!
            </p>
            <Link
              to="/products"
              className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-7">
            {safeOrders.map((o) => (
              <OrderCard key={o._id} item={o} user={user} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrder;