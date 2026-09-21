import React from "react";
import { Link, useHistory } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Package,
  PlusCircle,
  ClipboardList,
  MessageSquareText,
  Contact,
  UserRound,
} from "lucide-react";
import { useSelector } from "react-redux";

function Sidebar() {
  const { user, loading } = useSelector((state) => state.userData);
  const history = useHistory();

  function accountHandler() {
    history.push("/account");
  }

  const menu = [
    { to: "/admin/dashboard", Icon: LayoutDashboard, label: "Dashboard" },
    { to: "/", Icon: Home, label: "Home" },
    { to: "/admin/products", Icon: Package, label: "Products" },
    { to: "/admin/new/product", Icon: PlusCircle, label: "Add Product" },
    { to: "/admin/orders", Icon: ClipboardList, label: "Orders" },
    { to: "/admin/reviews", Icon: MessageSquareText, label: "Reviews" },
    { to: "/contact", Icon: Contact, label: "Contact" },
  ];

  return (
    <>
      {!loading && (
        <aside className="glass-strong glass-card flex h-full flex-col overflow-hidden rounded-2xl p-6">
          <div className="flex flex-col items-center border-b border-ink-200/60 pb-5">
            <span className="grid h-20 w-20 overflow-hidden rounded-full border-4 border-brand/30 bg-ink-100">
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="grid h-full w-full place-items-center text-xl font-bold text-ink-500">
                  {user?.name?.charAt(0)}
                </span>
              )}
            </span>
            <p className="mt-3 font-semibold text-ink-900">{user && user.name}</p>
            <p className="text-sm text-ink-500">{user && user.email}</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto py-5">
            {menu.map(({ to, Icon, label }) => (
              <Link
                key={label}
                to={to}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink-700 transition hover:bg-brand hover:text-white"
              >
                <Icon size={20} className="text-ink-500 transition group-hover:text-white" />
                {label}
              </Link>
            ))}
          </nav>

          <button onClick={accountHandler} className="btn-ghost w-full">
            <UserRound size={18} /> Account
          </button>
        </aside>
      )}
    </>
  );
}

export default Sidebar;