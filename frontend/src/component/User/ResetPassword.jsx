import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import Loader from "../layouts/loader/Loader";
import { PageShell } from "../../ui/kit";

function ResetPassword() {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, success, loading } = useSelector((state) => state.forgetPassword);

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsValidPassword(e.target.value.length >= 8);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Password Updated Successfully");
      history.push("/login");
    }
  }, [dispatch, error, alert, success, history]);

  function resetPasswordSubmitHandler(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert.error("Password and Confirm Password do not match");
      return;
    }
    const myForm = new FormData();
    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(match.params.token, myForm));
  }

  const isSignInDisabled = !(password && confirmPassword && isValidPassword);

  const pwdInput = (id, value, onChange, ph) => (
    <div className="relative">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        className="field !pr-12"
        placeholder={ph}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label="Toggle password"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-brand"
      >
        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
  );

  return (
    <PageShell>
      <MetaData title="Reset Password" />
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
              Reset Password
            </h1>
            <p className="mt-1 text-center text-sm text-ink-500">
              Choose a new, strong password.
            </p>

            <form onSubmit={resetPasswordSubmitHandler} className="mt-8 space-y-5">
              <div>
                <label htmlFor="rp-password" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  Password
                </label>
                {pwdInput("rp-password", password, handlePasswordChange, "At least 8 characters")}
                {!isValidPassword && password !== "" && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">
                    Password must be at least 8 characters.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="rp-cpassword" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  Confirm Password
                </label>
                {pwdInput("rp-cpassword", confirmPassword, (e) => setConfirmPassword(e.target.value), "Re-enter password")}
                {confirmPassword !== "" && password !== confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">Passwords do not match.</p>
                )}
              </div>

              <button type="submit" disabled={isSignInDisabled} className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50">
                <CheckCircle2 size={18} /> Confirm New Password
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-600">
              <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">
                Cancel
              </Link>
            </p>
          </motion.div>
        </div>
      )}
    </PageShell>
  );
}

export default ResetPassword;