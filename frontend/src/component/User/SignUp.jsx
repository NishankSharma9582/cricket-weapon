import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, UploadCloud } from "lucide-react";
import Loader from "../layouts/loader/Loader";
import MetaData from "../layouts/MataData/MataData";
import { Link } from "react-router-dom";
import { signUp, clearErrors } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { PageShell } from "../../ui/kit";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [areCheckboxesChecked, setAreCheckboxesChecked] = useState({
    checkbox1: false,
    checkbox2: false,
  });
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { isAuthenticated, error } = useSelector((state) => state.userData);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      alert.success("User Registered Successfully");
      history.push("/account");
    }
  }, [dispatch, isAuthenticated, loading, error, alert, history]);

  const handleEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    setIsValidEmail(v !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      };
    }
  };

  const handleNameChange = (e) => {
    const v = e.target.value;
    setName(v);
    setIsValidName(v.length >= 4 && v.length <= 20);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsValidPassword(e.target.value.length >= 8);
  };

  const handleCheckboxChange = (checkboxName) => (e) => {
    setAreCheckboxesChecked((p) => ({ ...p, [checkboxName]: e.target.checked }));
  };

  const isSignInDisabled = !(
    email &&
    password &&
    isValidEmail &&
    confirmPassword &&
    name &&
    isValidName &&
    areCheckboxesChecked.checkbox1 &&
    areCheckboxesChecked.checkbox2
  );

  function handleSignUpSubmit(e) {
    setLoading(true);
    e.preventDefault();
    if (password !== confirmPassword) {
      alert.error("Password and Confirm Password do not match");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    if (avatar) formData.set("avatar", avatar);
    dispatch(signUp(formData));
    setLoading(false);
  }

  return (
    <PageShell>
      <MetaData title="Sign Up" />
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
              <UserPlus size={24} />
            </div>
            <h1 className="mt-5 text-center text-2xl font-bold text-ink-900">
              Create your account
            </h1>
            <p className="mt-1 text-center text-sm text-ink-500">
              Join CricketWeapon and gear up for greatness
            </p>

            <form onSubmit={handleSignUpSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="su-name" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  Name
                </label>
                <input
                  id="su-name"
                  className="field"
                  placeholder="Your name"
                  value={name}
                  onChange={handleNameChange}
                />
                {!isValidName && name !== "" && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">
                    Name must be between 4 and 20 characters.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="su-email" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  Email
                </label>
                <input
                  id="su-email"
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
                <label htmlFor="su-password" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="su-password"
                    type={showPassword ? "text" : "password"}
                    className="field !pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
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
                {!isValidPassword && password !== "" && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">
                    Password must be at least 8 characters.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="su-cpassword" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  Confirm Password
                </label>
                <input
                  id="su-cpassword"
                  type={showPassword ? "text" : "password"}
                  className="field"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
                {confirmPassword !== "" && password !== confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Avatar */}
              <div className="glass flex items-center gap-4 rounded-xl p-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-ink-100 text-2xl font-bold text-ink-500">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                  ) : (
                    "CW"
                  )}
                </span>
                <label
                  htmlFor="avatar-input"
                  className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-700 hover:text-brand"
                >
                  <UploadCloud size={17} className="text-brand" />
                  {avatar ? "Change avatar" : "Upload avatar"}
                  <input
                    id="avatar-input"
                    accept="image/*"
                    type="file"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5 text-sm text-ink-700">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={areCheckboxesChecked.checkbox1}
                    onChange={handleCheckboxChange("checkbox1")}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />
                  <span>I accept the CricketWeapon Terms &amp; Conditions</span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={areCheckboxesChecked.checkbox2}
                    onChange={handleCheckboxChange("checkbox2")}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />
                  <span>I accept the CricketWeapon Terms of Use</span>
                </label>
              </div>

              <p className="text-xs leading-relaxed text-ink-500">
                I acknowledge CricketWeapon will use my information in accordance
                with its{" "}
                <Link to="/policy/privacy" className="font-semibold text-brand">
                  Privacy Policy.
                </Link>
              </p>

              <button
                type="submit"
                disabled={isSignInDisabled || loading}
                className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserPlus size={18} /> Create Account
              </button>
            </form>

            <p className="mt-5 border-t border-ink-200/70 pt-5 text-center text-sm text-ink-600">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-brand hover:text-brand-dark">
                Login
              </Link>
            </p>
          </motion.div>
        </div>
      )}
    </PageShell>
  );
}

export default Signup;