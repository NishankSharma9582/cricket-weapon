import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, Save } from "lucide-react";
import { Link, useHistory } from "react-router-dom";
import Loader from "../layouts/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstanat";
import MetaData from "../layouts/MataData/MataData";
import { PageShell } from "../../ui/kit";

function UpdatePassword() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { loading, isUpdated, error } = useSelector((state) => state.profileData);
  const alert = useAlert();

  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setIsValidPassword(e.target.value.length >= 8);
  };

  const updatePasswordSubmitHandler = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert.error("Password and Confirm Password do not match");
      return;
    }
    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Profile Updated Successfully");
      dispatch({ type: UPDATE_PASSWORD_RESET });
      history.push("/account");
    }
  }, [dispatch, error, alert, isUpdated, loading, history]);

  const isSignInDisabled = !(newPassword && confirmPassword && oldPassword && isValidPassword);

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
      <MetaData title="Update Password" />
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
              <ShieldCheck size={24} />
            </div>
            <h1 className="mt-5 text-center text-2xl font-bold text-ink-900">Update Password</h1>

            <form onSubmit={updatePasswordSubmitHandler} className="mt-8 space-y-5">
              <div>
                <label htmlFor="up-old" className="mb-1.5 block text-sm font-semibold text-ink-700">Old Password</label>
                {pwdInput("up-old", oldPassword, (e) => setOldPassword(e.target.value), "Current password")}
              </div>
              <div>
                <label htmlFor="up-new" className="mb-1.5 block text-sm font-semibold text-ink-700">New Password</label>
                {pwdInput("up-new", newPassword, handlePasswordChange, "At least 8 characters")}
                {!isValidPassword && newPassword !== "" && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">Password must be at least 8 characters.</p>
                )}
              </div>
              <div>
                <label htmlFor="up-confirm" className="mb-1.5 block text-sm font-semibold text-ink-700">Confirm Password</label>
                {pwdInput("up-confirm", confirmPassword, (e) => setConfirmPassword(e.target.value), "Re-enter new password")}
                {confirmPassword !== "" && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">Passwords do not match.</p>
                )}
              </div>

              <button type="submit" disabled={isSignInDisabled} className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50">
                <Save size={18} /> Update New Password
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-600">
              <Link to="/account" className="font-semibold text-brand hover:text-brand-dark">Cancel</Link>
            </p>
          </motion.div>
        </div>
      )}
    </PageShell>
  );
}

export default UpdatePassword;