import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Bell, ChevronDown, LogOut, Settings, UserRound, Menu } from "lucide-react";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";

function AdminTopbar({ onMenuToggle }) {
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.userData);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    dispatch(logout());
    alert.success("Logged out successfully");
    history.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-200/60 bg-white/70 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
          className="grid h-9 w-9 place-items-center rounded-full text-ink-700 transition hover:bg-brand/5 hover:text-brand lg:hidden"
        >
          <Menu size={22} />
        </button>
        <Link to="/admin/dashboard" className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold tracking-tight text-ink-900 sm:text-base">
            Admin
          </span>
          <span className="hidden text-xs font-bold uppercase tracking-widest text-ink-400 sm:block">
            / Control Panel
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className={`grid h-10 w-10 place-items-center rounded-full text-ink-700 transition hover:bg-brand/5 hover:text-brand ${
              notifOpen ? "bg-brand/5 text-brand" : ""
            }`}
          >
            <Bell size={20} />
          </button>
          <div
            className={`absolute right-0 top-12 w-72 origin-top-right rounded-2xl border border-ink-200/60 bg-white/95 p-4 shadow-soft backdrop-blur-xl transition ${
              notifOpen
                ? "pointer-events-auto scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            <p className="mb-3 text-sm font-bold text-ink-900">Notifications</p>
            <div className="rounded-xl border border-dashed border-ink-300 bg-ink-50/60 px-4 py-6 text-center">
              <span className="block text-xs font-semibold text-ink-500">
                No notifications yet
              </span>
            </div>
          </div>
        </div>

        {/* Profile */}
        {!loading && user && (
          <div className="relative ml-1" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Profile menu"
              className="flex items-center gap-2 rounded-full border border-ink-200/60 bg-white/70 p-1.5 pr-3 transition hover:border-brand/30"
            >
              <span className="grid h-8 w-8 overflow-hidden rounded-full border border-brand/20 bg-ink-100">
                {user.avatar && user.avatar.url ? (
                  <img
                    src={user.avatar.url}
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-sm font-bold text-brand">
                    {user.name?.charAt(0)}
                  </span>
                )}
              </span>
              <span className="hidden max-w-[9rem] truncate text-sm font-bold text-ink-900 sm:block">
                {user.name}
              </span>
              <ChevronDown size={16} className="text-ink-400" />
            </button>
            <div
              className={`absolute right-0 top-14 w-48 origin-top-right rounded-2xl border border-ink-200/60 bg-white/95 p-2 shadow-soft backdrop-blur-xl transition ${
                profileOpen
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              <button
                onClick={() => {
                  setProfileOpen(false);
                  history.push("/account");
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-brand/5 hover:text-brand"
              >
                <UserRound size={16} /> Profile
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  history.push("/password/update");
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-brand/5 hover:text-brand"
              >
                <Settings size={16} /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminTopbar;