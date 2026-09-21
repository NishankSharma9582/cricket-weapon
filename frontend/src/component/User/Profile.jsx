import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Mail,
  Calendar,
  Package,
  KeyRound,
  PencilLine,
  ShieldCheck,
} from "lucide-react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { PageShell, GlassCard, fadeUp, stagger, item } from "../../ui/kit";

const ProfilePage = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, isAuthenticated } = useSelector((state) => state.userData);

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
    history.push("/login");
  };

  useEffect(() => {
    if (isAuthenticated === false) history.push("/login");
  }, [history, isAuthenticated]);

  const createdAt = (user) => {
    const date = new Date(user.createdAt);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-10 flex flex-wrap items-center gap-6"
        >
          <img
            src={user.avatar?.url}
            alt={user.name}
            className="h-24 w-24 rounded-2xl border-2 border-white object-cover shadow-glow"
          />
          <div>
            <h1 className="text-3xl font-bold text-ink-900">Hi, {user.name}!</h1>
            <p className="mt-1 text-sm text-ink-500">
              Welcome back! Happy shopping.
            </p>
            {user.role === "admin" && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-bold text-brand-dark">
                <ShieldCheck size={13} /> Admin Account
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Left column */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
            <motion.div variants={item}>
              <GlassCard className="p-6">
                <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-ink-500">
                  Profile Overview
                </h3>
                <div className="space-y-4 text-sm">
                  <p className="flex items-start gap-3">
                    <User size={16} className="mt-0.5 text-brand" />
                    <span>
                      <b className="block text-xs uppercase tracking-wide text-ink-500">Name</b>
                      {user.name}
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Mail size={16} className="mt-0.5 text-brand" />
                    <span>
                      <b className="block text-xs uppercase tracking-wide text-ink-500">Email</b>
                      {user.email}
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Calendar size={16} className="mt-0.5 text-brand" />
                    <span>
                      <b className="block text-xs uppercase tracking-wide text-ink-500">Member since</b>
                      {createdAt(user)}
                    </span>
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-ink-200/70 pt-5">
                  <Link to="/orders" className="btn-ghost !py-2 text-sm">
                    <Package size={16} /> My Orders
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* Right column */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
            <motion.div variants={item}>
              <GlassCard className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-ink-900">Personal Information</h3>
                    <p className="mt-1 text-sm text-ink-500">
                      Feel free to edit any of your details so your account stays up to date.
                    </p>
                  </div>
                  <Link to="/profile/update" className="btn-ghost text-sm">
                    <PencilLine size={16} /> Edit Details
                  </Link>
                </div>

                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-500">
                      My Details
                    </h4>
                    <dl className="space-y-2 text-sm">
                      <dt className="font-semibold text-ink-700">Name</dt>
                      <dd className="text-ink-800">{user.name}</dd>
                      <dt className="pt-2 font-semibold text-ink-700">Email</dt>
                      <dd className="break-all text-ink-800">{user.email}</dd>
                    </dl>
                  </div>

                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-500">
                      Security
                    </h4>
                    <Link to="/password/update" className="btn-ghost w-full text-sm">
                      <KeyRound size={16} /> Update Password
                    </Link>
                    <div className="glass mt-4 rounded-xl p-4">
                      <h5 className="text-sm font-bold text-ink-800">Log out from all devices</h5>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                        You&apos;ll need to provide your credentials again to access the store.
                      </p>
                    </div>
                    <button onClick={logoutHandler} className="btn-brand mt-4 w-full">
                      <LogOut size={16} /> Logout Account
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
};

export default ProfilePage;