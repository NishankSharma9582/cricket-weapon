import React from "react";
import { Search, RotateCcw } from "lucide-react";

function FilterBar({ search, onSearchChange, filters = [], onReset, resultCount }) {
  const hasFilters = filters.some((f) => f.value);

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search…"
            aria-label="Search"
            className="field w-full !rounded-2xl !py-3 !pl-10"
          />
        </div>

        {filters.map((f) => (
          <select
            key={f.key}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            aria-label={f.label}
            className="field !rounded-2xl !py-3 lg:w-48"
          >
            <option value="">{f.label}</option>
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {(hasFilters || search) && onReset && (
          <button
            onClick={onReset}
            className="btn-ghost !rounded-2xl !py-3"
            aria-label="Reset filters"
          >
            <RotateCcw size={16} /> Reset
          </button>
        )}
      </div>

      {typeof resultCount === "number" && (
        <p className="mt-3 text-xs font-semibold text-ink-400">
          Showing <span className="text-brand">{resultCount}</span> result
          {resultCount === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}

export default FilterBar;