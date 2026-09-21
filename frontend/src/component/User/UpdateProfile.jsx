import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PencilLine, UploadCloud } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { clearErrors, updateProfile, load_UserProfile } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstanat";
import MetaData from "../layouts/MataData/MataData";
import { useHistory, Link } from "react-router-dom";
import { PageShell } from "../../ui/kit";

function UpdateProfile() {
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { error, isUpdated, loading } = useSelector((state) => state.profileData);
  const { user } = useSelector((state) => state.userData);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

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

  const UpdateProfileSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    if (avatar) myForm.set("avatar", avatar);
    dispatch(updateProfile(myForm));
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || "");
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Profile Updated Successfully");
      dispatch({ type: UPDATE_PROFILE_RESET });
      history.push("/account");
      dispatch(load_UserProfile());
    }
  }, [dispatch, error, alert, history, user, isUpdated]);

  const isSignInDisabled = !(email && isValidEmail && name.length >= 4);

  return (
    <PageShell>
      <MetaData title="Update Profile" />
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
              <PencilLine size={24} />
            </div>
            <h1 className="mt-5 text-center text-2xl font-bold text-ink-900">
              Update Profile Details
            </h1>

            <form onSubmit={UpdateProfileSubmitHandler} className="mt-8 space-y-5">
              <div>
                <label htmlFor="up-name" className="mb-1.5 block text-sm font-semibold text-ink-700">Name</label>
                <input
                  id="up-name"
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="up-email" className="mb-1.5 block text-sm font-semibold text-ink-700">Email</label>
                <input
                  id="up-email"
                  type="email"
                  className="field"
                  value={email}
                  onChange={handleEmailChange}
                />
                {!isValidEmail && email !== "" && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">Please enter a valid email address.</p>
                )}
              </div>

              <div className="glass flex items-center gap-4 rounded-xl p-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-ink-100 text-xl font-bold text-ink-500">
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

              <button type="submit" disabled={isSignInDisabled} className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50">
                <PencilLine size={18} /> Update Profile
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

export default UpdateProfile;