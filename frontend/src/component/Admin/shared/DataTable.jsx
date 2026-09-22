import React from "react";
import { EmptyState } from "../../../ui/kit";

function DataTable({
  columns,
  rows,
  loading,
  onRowClick,
  emptyTitle = "No data found",
  emptySubtitle = "Try adjusting your search or filters.",
  emptyIcon,
}) {
  if (loading) {
    return (
      <div className="flex min-h-[32vh] flex-col items-center justify-center gap-3">
        <span className="grid h-12 w-12 animate-spin place-items-center rounded-2xl bg-gradient-brand text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </span>
        <p className="text-sm font-semibold text-ink-500">Loading…</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="glass-card rounded-2xl">
        <EmptyState title={emptyTitle} subtitle={emptySubtitle} icon={emptyIcon} />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink-200 bg-white/80 backdrop-blur">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-500"
                  style={col.align ? { textAlign: col.align } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.key ?? i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-ink-100 transition last:border-0 ${
                  onRowClick ? "cursor-pointer hover:bg-brand/5" : "hover:bg-ink-50/60"
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3.5 text-sm text-ink-700"
                    style={col.align ? { textAlign: col.align } : undefined}
                  >
                    {col.render ? col.render(row, i) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;