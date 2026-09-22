import React from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquareText,
  ClipboardList,
  Users,
  Contact,
  UserRound,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";

const NAV = [
  {
    section: "Main",
    items: [
      { label: "Dashboard", to: "/admin/dashboard", Icon: LayoutDashboard },
    ],
  },
  {
    section: "Catalogue",
    items: [
      { label: "Products", to: "/admin/products", Icon: Package },
      { label: "Add Product", to: "/admin/new/product", Icon: PlusCircle },
      { label: "Reviews", to: "/admin/reviews", Icon: MessageSquareText },
    ],
  },
  {
    section: "Orders",
    items: [{ label: "All Orders", to: "/admin/orders", Icon: ClipboardList }],
  },
  {
    section: "Users",
    items: [{ label: "All Users", to: "/admin/users", Icon: Users }],
  },
  {
    section: "Links",
    items: [{ label: "Contact", to: "/contact", Icon: Contact }],
  },
];

const EASE = [0.22, 1, 0.36, 1];
const WIDTH_TRANSITION = { duration: 0.32, ease: EASE };

function AdminSidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const history = useHistory();
  const location = useLocation();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.userData);

  const isActive = (to) =>
    to === "/admin/dashboard"
      ? location.pathname === to
      : location.pathname.startsWith(to);

  const handleLogout = () => {
    onClose?.();
    dispatch(logout());
    alert.success("Logged out successfully");
    history.push("/login");
  };

  const go = (to) => {
    onClose?.();
    history.push(to);
  };

  /* ───────── nav link ───────── */
  const renderLink = ({ label, to, Icon }) => {
    const active = isActive(to);
    return (
      <button
        key={to}
        onClick={() => go(to)}
        aria-label={collapsed ? label : undefined}
        aria-current={active ? "page" : undefined}
        title={collapsed ? label : undefined}
        className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
          collapsed ? "lg:justify-center lg:px-0" : ""
        } ${
          active
            ? "bg-brand/10 text-brand shadow-[0_2px_12px_rgba(237,28,36,0.12)] ring-1 ring-inset ring-brand/20"
            : "text-ink-600 hover:bg-white/60 hover:text-brand hover:shadow-[0_2px_10px_rgba(18,18,18,0.04)]"
        }`}
      >
        {/* subtle glow for active item */}
        {active && (
          <motion.span
            layoutId="sidebar-active-glow"
            className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-brand/10 via-brand/5 to-transparent"
            transition={WIDTH_TRANSITION}
          />
        )}

        <Icon
          size={20}
          strokeWidth={active ? 2.4 : 2}
          className={`relative z-10 shrink-0 transition-transform duration-200 ${
            active ? "" : "group-hover:scale-110"
          }`}
        />

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="label"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="relative z-10 truncate"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? "4.5rem" : "16rem" }}
        transition={WIDTH_TRANSITION}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white/60 backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          boxShadow:
            "0 0 0 1px rgba(18,18,18,0.04), 0 10px 40px -12px rgba(18,18,18,0.10)",
        }}
        role="navigation"
        aria-label="Admin navigation"
      >
        {/* subtle ambient gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(600px 300px at -10% 0%, rgba(237,28,36,0.06), transparent 60%), radial-gradient(500px 400px at 110% 100%, rgba(18,18,18,0.05), transparent 55%)",
          }}
        />

        {/* ─── Brand ─── */}
        <div
          className={`relative flex h-16 shrink-0 items-center transition-all duration-300 ${
            collapsed ? "justify-center px-0" : "px-4"
          }`}
        >
          <Link
            to="/"
            className="flex items-center gap-2 overflow-hidden"
            onClick={onClose}
          >
            <img
              src={require("../../../Image/logo.png")}
              alt="CricketWeapon"
              className="h-9 w-auto shrink-0"
            />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  key="brand"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="whitespace-nowrap text-base font-bold tracking-tight text-ink-900"
                >
                  Cricket<span className="text-brand">Weapon</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Collapse toggle — floating on right edge */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -right-3 top-5 hidden h-6 w-6 place-items-center rounded-full border border-ink-200/70 bg-white text-ink-500 shadow-sm transition-all duration-200 hover:scale-110 hover:border-brand/40 hover:text-brand lg:grid"
          >
            {collapsed ? (
              <ChevronsRight size={13} />
            ) : (
              <ChevronsLeft size={13} />
            )}
          </button>
        </div>

        {/* ─── Profile ─── */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mx-3 mb-2 mt-1 rounded-2xl bg-white/50 px-4 py-4 backdrop-blur-md ring-1 ring-inset ring-white/60 shadow-[0_4px_20px_-8px_rgba(18,18,18,0.08)]">
                {!loading && user && (
                  <div className="flex flex-col items-center">
                    <motion.span
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="grid h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-brand/20 to-brand/5 ring-2 ring-brand/25"
                    >
                      {user.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt="User Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="grid h-full w-full place-items-center text-lg font-bold text-brand">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </motion.span>
                    <p className="mt-2 max-w-full truncate text-sm font-bold text-ink-900">
                      {user.name}
                    </p>
                    <p className="max-w-full truncate text-xs text-ink-500">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Nav ─── */}
        <nav className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-3 py-3">
          {NAV.map((group) => (
            <div key={group.section}>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.p
                    key={`sec-${group.section}`}
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      marginBottom: "0.4rem",
                    }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="overflow-hidden px-3 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-400"
                  >
                    {group.section}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="space-y-1">{group.items.map(renderLink)}</div>

              {collapsed && (
                <div className="mx-auto my-2 h-px w-8 bg-ink-200/60 last:hidden" />
              )}
            </div>
          ))}
        </nav>

        {/* ─── Footer ─── */}
        <div className="shrink-0 p-3">
          <div className="rounded-2xl bg-white/50 p-2 backdrop-blur-md ring-1 ring-inset ring-white/60 shadow-[0_4px_20px_-8px_rgba(18,18,18,0.08)]">
            <AnimatePresence mode="wait" initial={false}>
              {!collapsed ? (
                <motion.div
                  key="expanded-footer"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="space-y-1"
                >
                  <button
                    onClick={() => go("/account")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
                  >
                    <Settings size={20} />
                    <span>Account</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-brand !w-full !py-2.5 text-sm"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-footer"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="space-y-2"
                >
                  <button
                    onClick={() => go("/account")}
                    aria-label="Account"
                    title="Account"
                    className="grid w-full place-items-center rounded-xl py-2.5 text-ink-600 transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
                  >
                    <UserRound size={20} />
                  </button>
                  <button
                    onClick={handleLogout}
                    aria-label="Logout"
                    title="Logout"
                    className="btn-brand grid w-full place-items-center !rounded-xl !py-2.5"
                  >
                    <LogOut size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default AdminSidebar;
