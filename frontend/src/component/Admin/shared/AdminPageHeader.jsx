import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";

function AdminPageHeader({
  title,
  subtitle,
  action,
  back,
  breadcrumbs = [],
  variant = "banner",
}) {
  if (variant === "plain") {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {back && (
            <Link
              to={typeof back === "string" ? back : "/admin/dashboard"}
              className="mb-2 inline-flex items-center gap-1.5 text-sm font-bold text-brand transition hover:text-brand-dark"
            >
              <ArrowLeft size={16} /> Go back
            </Link>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 max-w-2xl text-sm text-ink-500">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-6 text-white shadow-glow sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5 blur-xl" />

      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/70">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} />}
                {crumb.to ? (
                  <Link to={crumb.to} className="transition hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {back && (
            <Link
              to={typeof back === "string" ? back : "/admin/dashboard"}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/80 transition hover:text-white"
            >
              <ArrowLeft size={14} /> Go back
            </Link>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 max-w-2xl text-sm text-white/75">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export default AdminPageHeader;