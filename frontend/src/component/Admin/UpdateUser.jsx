import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Mail, UserRound, ShieldCheck } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { UPDATE_USER_RESET } from "../../constants/userConstanat";
import { getUserDetails, updateUser, clearErrors } from "../../actions/userAction";
import { useHistory, useRouteMatch } from "react-router-dom";
import AdminLayout from "./shared/AdminLayout";
import AdminPageHeader from "./shared/AdminPageHeader";
import Loader from "../layouts/loader/Loader";
import MetaData from "../layouts/MataData/MataData";

function UpdateUser() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const userId = useRouteMatch().params.id;
  const history = useHistory();

  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { loading: updateLoading, error: updateError, isUpdated } = useSelector(
    (state) => state.profileData
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("User Updated Successfully");
      history.push("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else if (user && user._id === userId) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
    }
  }, [dispatch, alert, error, history, isUpdated, updateError, user, userId]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);
    dispatch(updateUser(userId, myForm));
  };

  return (
    <AdminLayout>
      <MetaData title="Update User — Admin Panel" />
      <AdminPageHeader
        variant="plain"
        title="Update User"
        subtitle="Edit the name, email and role for this account."
        back="/admin/users"
        breadcrumbs={[
          { label: "Admin" },
          { label: "Users", to: "/admin/users" },
          { label: "Update User" },
        ]}
      />

      {loading ? (
        <div className="grid place-items-center py-24">
          <Loader />
        </div>
      ) : (
        <div className="mx-auto max-w-xl">
          <form
            onSubmit={updateUserSubmitHandler}
            className="glass-card space-y-5 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col items-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                <ShieldCheck size={30} />
              </span>
              <h2 className="mt-3 text-lg font-bold text-ink-900">
                Update role & details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="update-name"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500"
                >
                  Name
                </label>
                <div className="relative">
                  <UserRound
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                  />
                  <input
                    id="update-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field w-full !pl-11"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="update-email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                  />
                  <input
                    id="update-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field w-full !pl-11"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="update-role"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500"
                >
                  Role
                </label>
                <select
                  id="update-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="field w-full"
                >
                  <option value="">Choose role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateLoading || !role}
              className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateLoading ? "Updating…" : "Update"}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

export default UpdateUser;