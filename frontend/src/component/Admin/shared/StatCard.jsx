import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, delta, trend, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-card group relative flex w-full items-start justify-between gap-4 overflow-hidden rounded-2xl p-5 text-left transition hover:border-brand/30 hover:shadow-glow"
    >
      {/* soft ambient glow on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative z-10 min-w-0 flex-1">
        {/* label + trend badge */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="truncate text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
            {label}
          </span>
          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                trend === "up"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {delta}
            </span>
          )}
        </div>

        {/* big value — solid color, no gradient clipping */}
        <p className="truncate text-xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
          {value}
        </p>

        {sub && (
          <p className="mt-2 truncate text-xs font-semibold text-ink-400">
            {sub}
          </p>
        )}
      </div>

      {/* small icon chip */}
      {Icon && (
        <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-brand text-white shadow-soft transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11">
          <Icon size={18} className="sm:hidden" />
          <Icon size={20} className="hidden sm:block" />
        </span>
      )}
    </button>
  );
}

export default StatCard;
