import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { KeyRound, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import { Link } from "react-router-dom";
import { PageShell } from "../../ui/kit";

export default function ForgetPassword() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, message, loading } = useSelector((state) => state.forgetPassword);

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const handleEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    setIsValidEmail(v !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  };

  function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    setIsDone(!isDone);
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgetPassword(myForm));
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      alert.success(message);
      setEmail("");
    }
  }, [dispatch, error, alert, message, loading]);

  const isSignInDisabled = !(email && isValidEmail);

  return (
    <PageShell>
      <MetaData title="Forget Password" />
      {loading ? (
        <Loader />
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center px-5 py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="glass glass-card w-full max-w-md p-8 sm:p-10"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <KeyRound size={24} />
            </div>
            <h1 className="mt-5 text-center text-2xl font-bold text-ink-900">
              Forgot your password?
            </h1>
            <p className="mt-1 text-center text-sm text-ink-500">
              Enter your email and we&apos;ll help you reset it.
            </p>

            {isDone && (
              <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">
                A password reset email has been sent to your address.
              </p>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="fp-email" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  Email
                </label>
                <input
                  id="fp-email"
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

              <button type="submit" disabled={isSignInDisabled} className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50">
                <Send size={18} /> Send Email
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-600">
              <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">
                Cancel — back to login
              </Link>
            </p>
          </motion.div>
        </div>
      )}
    </PageShell>
  );
}