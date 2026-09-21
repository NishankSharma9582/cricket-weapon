import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, LogIn } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import { login, clearErrors } from "../../actions/userAction";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import { PageShell } from "../../ui/kit";

export default function Login() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { isAuthenticated, loading, error } = useSelector((state) => state.userData);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    setIsValidEmail(v !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      history.push(redirect);
    }
    // eslint-disable-next-line
  }, [dispatch, isAuthenticated, loading, error, alert, history, redirect]);

  function handleLoginSubmit(e) {
    e.preventDefault();
    dispatch(login(email, password));
  }

  const isSignInDisabled = !(email && password && isValidEmail);

  return (
    <PageShell>
      <MetaData title="Login" />
      {loading ? (
        <Loader />
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center px-5 py-14 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="glass glass-card w-full max-w-md p-8 sm:p-10"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Lock size={24} />
            </div>
            <h1 className="mt-5 text-center text-2xl font-bold text-ink-900">
              Welcome back
            </h1>
            <p className="mt-1 text-center text-sm text-ink-500">
              Sign in to your CricketWeapon account
            </p>

            <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                />
                {!isValidEmail && email !== "" && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="field !pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-brand"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/password/forgot" className="font-semibold text-brand hover:text-brand-dark">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={isSignInDisabled} className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50">
                <LogIn size={18} /> Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-relaxed text-ink-500">
              I accept the CricketWeapon Terms of Use and acknowledge CricketWeapon
              will use my information in accordance with its{" "}
              <Link to="/policy/privacy" className="font-semibold text-brand">
                Privacy Policy.
              </Link>
            </p>

            <p className="mt-5 border-t border-ink-200/70 pt-5 text-center text-sm text-ink-600">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-bold text-brand hover:text-brand-dark">
                Create Account
              </Link>
            </p>
          </motion.div>
        </div>
      )}
    </PageShell>
  );
}