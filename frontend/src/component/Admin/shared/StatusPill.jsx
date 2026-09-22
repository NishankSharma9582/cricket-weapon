import React from "react";

const TONES = {
  Delivered: "bg-emerald-100 text-emerald-700",
  delivered: "bg-emerald-100 text-emerald-700",
  Shipped: "bg-sky-100 text-sky-700",
  shipped: "bg-sky-100 text-sky-700",
  Processing: "bg-amber-100 text-amber-700",
  processing: "bg-amber-100 text-amber-700",
  Cancelled: "bg-rose-100 text-rose-600",
  cancelled: "bg-rose-100 text-rose-600",
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-ink-100 text-ink-500",
};

const DOT = {
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  neutral: "bg-ink-400",
};

function StatusPill({ status = "—" }) {
  const tone = TONES[status] || "bg-ink-100 text-ink-600";
  const toneHint = String(status).toLowerCase();
  const dot =
    DOT[toneHint] ||
    (String(status).toLowerCase().includes("cancel")
      ? DOT.rose
      : String(status).toLowerCase().includes("deliver")
      ? DOT.emerald
      : String(status).toLowerCase().includes("ship")
      ? DOT.sky
      : DOT.neutral);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tone}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

export default StatusPill;