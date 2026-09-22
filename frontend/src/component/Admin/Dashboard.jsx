import React, { useEffect, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Package,
  ClipboardList,
  Users,
  IndianRupee,
  CalendarDays,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";

import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import AdminLayout from "./shared/AdminLayout";
import AdminPageHeader from "./shared/AdminPageHeader";
import StatCard from "./shared/StatCard";

import { getAdminProducts, clearErrors } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";

/* ---------- theme tokens ---------- */
const T = {
  brand: "#ED1C24",
  brandRgb: "237, 28, 36",
  success: "#22C55E",
  inkMuted: "#8b8b8b",
  gridLine: "rgba(18, 18, 18, 0.07)",
  axisLine: "#E5E7EB",
  font: "Archivo, system-ui, sans-serif",
};

const inr = (n) =>
  "₹" +
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

/* Build last-7-days revenue series from orders */
function buildRevenueSeries(orders) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      value: 0,
    });
  }
  const map = new Map(days.map((d) => [d.key, d]));
  (orders || []).forEach((o) => {
    const raw = o.createdAt ? new Date(o.createdAt) : null;
    if (!raw || isNaN(raw)) return;
    const bucket = map.get(raw.toISOString().slice(0, 10));
    if (bucket) bucket.value += Number(o.totalPrice) || 0;
  });
  return {
    categories: days.map((d) => d.label),
    data: days.map((d) => d.value),
  };
}

function Dashboard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();

  const {
    products = [],
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.products);

  const {
    orders = [],
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.allOrders);

  const {
    users = [],
    loading: usersLoading,
    error: usersError,
  } = useSelector((state) => state.allUsers);

  const loading = productsLoading || ordersLoading || usersLoading;

  /* ---------- fetch ---------- */
  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  /* ---------- error handling (correct slice per error) ---------- */
  useEffect(() => {
    if (productsError) {
      alert.error(productsError);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, productsError]);

  useEffect(() => {
    if (ordersError) alert.error(ordersError);
  }, [alert, ordersError]);

  useEffect(() => {
    if (usersError) alert.error(usersError);
  }, [alert, usersError]);

  /* ---------- derived stats ---------- */
  const stats = useMemo(() => {
    const outOfStock = products.filter((p) => Number(p.stock) <= 0).length;
    const inStock = products.length - outOfStock;

    const totalAmount = orders.reduce(
      (acc, o) => acc + (Number(o.totalPrice) || 0),
      0,
    );

    const deliveredOrders = orders.filter(
      (o) => o.orderStatus === "Delivered",
    ).length;
    const cancelledOrders = orders.filter(
      (o) => o.orderStatus === "Cancelled",
    ).length;
    const activeOrders = orders.length - deliveredOrders - cancelledOrders;

    return {
      totalProducts: products.length,
      inStock,
      outOfStock,
      totalOrders: orders.length,
      activeOrders,
      deliveredOrders,
      cancelledOrders,
      totalUsers: users.length,
      totalAmount,
    };
  }, [products, orders, users]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [],
  );

  /* ---------- chart data ---------- */
  const revenueSeries = useMemo(() => buildRevenueSeries(orders), [orders]);

  const revenue7dTotal = useMemo(
    () => revenueSeries.data.reduce((a, b) => a + b, 0),
    [revenueSeries],
  );

  /* ---------- chart configs (memoized to avoid re-animation) ---------- */
  const lineOptions = useMemo(
    () => ({
      chart: {
        type: "areaspline",
        backgroundColor: "transparent",
        style: { fontFamily: T.font },
        reflow: true,
        spacing: [12, 12, 12, 12],
      },
      credits: { enabled: false },
      title: { text: null },
      xAxis: {
        categories: revenueSeries.categories,
        lineColor: T.axisLine,
        tickColor: T.axisLine,
        labels: {
          style: { color: T.inkMuted, fontWeight: 600, fontFamily: T.font },
        },
      },
      yAxis: {
        title: { text: null },
        gridLineColor: T.gridLine,
        labels: {
          style: { color: T.inkMuted, fontWeight: 600, fontFamily: T.font },
          formatter() {
            if (this.value >= 100000) return "₹" + this.value / 100000 + "L";
            if (this.value >= 1000) return "₹" + this.value / 1000 + "k";
            return "₹" + this.value;
          },
        },
      },
      legend: { enabled: false },
      tooltip: {
        valuePrefix: "₹",
        pointFormat: "<b>{point.y:,.0f}</b>",
      },
      plotOptions: {
        areaspline: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, `rgba(${T.brandRgb}, 0.28)`],
              [1, `rgba(${T.brandRgb}, 0.02)`],
            ],
          },
          lineColor: T.brand,
          lineWidth: 3,
          marker: {
            radius: 5,
            fillColor: "#ffffff",
            lineColor: T.brand,
            lineWidth: 2,
            states: { hover: { radius: 7 } },
          },
        },
      },
      series: [{ name: "Revenue", data: revenueSeries.data, color: T.brand }],
    }),
    [revenueSeries],
  );

  const doughnutOptions = useMemo(
    () => ({
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        style: { fontFamily: T.font },
        reflow: true,
        spacing: [12, 12, 12, 12],
      },
      credits: { enabled: false },
      title: { text: null },
      accessibility: { point: { valueSuffix: "%" } },
      tooltip: { pointFormat: "{point.name}: <b>{point.percentage:.1f}%</b>" },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          innerSize: "62%",
          dataLabels: { enabled: false },
          borderWidth: 3,
          borderColor: "#ffffff",
          showInLegend: false,
          states: { hover: { halo: { size: 6 } } },
        },
      },
      series: [
        {
          type: "pie",
          name: "Share",
          data: [
            { name: "In Stock", y: stats.inStock, color: T.success },
            { name: "Out of Stock", y: stats.outOfStock, color: T.brand },
          ],
        },
      ],
    }),
    [stats.inStock, stats.outOfStock],
  );

  const hasOrders = orders.length > 0;
  const hasProducts = stats.totalProducts > 0;

  return (
    <AdminLayout>
      <MetaData title="Dashboard — Admin Panel" />

      <AdminPageHeader
        title="Dashboard"
        subtitle="Quick overview of your store performance"
        breadcrumbs={[{ label: "Admin" }, { label: "Dashboard" }]}
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur">
            <CalendarDays size={14} /> {today}
          </span>
        }
      />

      {loading ? (
        <div className="grid min-h-[60vh] place-items-center text-ink-500">
          <Loader />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              icon={Package}
              label="Total Products"
              value={stats.totalProducts}
              sub={`${stats.inStock} in stock · ${stats.outOfStock} out`}
              onClick={() => history.push("/admin/products")}
            />
            <StatCard
              icon={ClipboardList}
              label="Total Orders"
              value={stats.totalOrders}
              sub={`${stats.activeOrders} active`}
              onClick={() => history.push("/admin/orders")}
            />
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              sub="Registered customers"
              onClick={() => history.push("/admin/users")}
            />
            <StatCard
              icon={IndianRupee}
              label="Total Revenue"
              value={inr(stats.totalAmount)}
              sub={`${stats.deliveredOrders} delivered`}
              onClick={() => history.push("/admin/orders")}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Revenue trend */}
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink-800">
                    Revenue · Last 7 days
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-500">
                    Daily earnings across all orders
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                  {inr(revenue7dTotal)}
                </span>
              </div>

              {hasOrders ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={lineOptions}
                  containerProps={{ className: "w-full" }}
                />
              ) : (
                <div className="grid h-64 place-items-center text-sm text-ink-500">
                  No orders yet — revenue will appear here.
                </div>
              )}
            </div>

            {/* Stock status */}
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink-800">
                    Product Stock Status
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-500">
                    Share of products currently in stock
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {stats.totalProducts} total
                </span>
              </div>

              {hasProducts ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={doughnutOptions}
                  containerProps={{ className: "w-full" }}
                />
              ) : (
                <div className="grid h-64 place-items-center text-sm text-ink-500">
                  No products yet — add products to see stock distribution.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Dashboard;
