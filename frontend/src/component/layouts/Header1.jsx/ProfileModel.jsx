import React, { useEffect, useRef, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Modal, Avatar } from "@mui/material";
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./ProfileModel.css";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";
import { logout } from "../../../actions/userAction";

const ProfileModal = ({ user, isAuthenticated }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const createdAt = (user) => {
   const createdAt = new Date(user.createdAt);
   const options = {
     year: "numeric",
     month: "2-digit",
     day: "2-digit",
     hour: "2-digit",
     minute: "2-digit",
     hour12: true,
     timeZone: "Asia/Kolkata",
   };

   const formatter = new Intl.DateTimeFormat("en-IN", options);
   const formattedDate = formatter.format(createdAt);
   return formattedDate;
 };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleOpen = (event) => {
    event.stopPropagation();
    setIsOpen((prevState) => !prevState);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  function dashboardHandler() {
     setIsOpen(false);
    history.push("/admin/dashboard");
  }

  function accountHandler() {
     setIsOpen(false);
    history.push("/account");
  }

  function ordersHandler() {
     setIsOpen(false);
    history.push("/orders");
  }

  function logoutUserHandler() {
     setIsOpen(false);
     dispatch(logout());
    alert.success("Logout Successfully");
  }

  function cartHandler() {
      setIsOpen(false);

    history.push("/cart");
  }

  function loginHandler() {
      setIsOpen(false);

    history.push("/login");
  }

  return (
    <>
      <div className="profile-icon" onClick={handleOpen}>
        <PersonIcon
          className={`icon smaller ${isOpen ? "active" : ""}`}
          fontSize="large"
        />
        {isOpen ? (
          <ArrowDropUpIcon className="arrow-icon" />
        ) : (
          <ArrowDropDownIcon className="arrow-icon" />
        )}
      </div>
      {isOpen && (
        <Modal open={isOpen} onClose={onClose} className="modal-container">
          <div className="profile-menu-card" ref={modalRef}>
            {!isAuthenticated ? (
              <div className="welcome-section">
                <span className="welcome-badge">
                  <LockOpenIcon className="welcome-badge-icon" />
                  Welcome!
                </span>
                <p className="welcome-text">
                  To access your account and manage orders, please log in.
                </p>
                <button className="login-btn" onClick={loginHandler}>
                  Login / Signup
                </button>
              </div>
            ) : (
              <div className="user-section">
                <div className="avatar-ring">
                  <Avatar
                    src={user.avatar.url}
                    alt="User Avatar"
                    className="profile-avatar"
                  />
                </div>
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
                <span className="user-id">ID: {user._id.substring(0, 8)}</span>
                <span className="joined-at">Joined {createdAt(user)}</span>
              </div>
            )}

            <div className="divider" />

            <div className="profile-menu">
              {user && user.role === "admin" && (
                <div className="menu-item" onClick={dashboardHandler}>
                  <span className="menu-item-badge">
                    <DashboardIcon className="menu-icon" />
                  </span>
                  <span className="menu-label">Dashboard</span>
                </div>
              )}
              <div className="menu-item" onClick={accountHandler}>
                <span className="menu-item-badge">
                  <AccountCircleIcon className="menu-icon" />
                </span>
                <span className="menu-label">Profile</span>
              </div>
              <div className="menu-item" onClick={ordersHandler}>
                <span className="menu-item-badge">
                  <AssignmentIcon className="menu-icon" />
                </span>
                <span className="menu-label">Orders</span>
              </div>
              <div className="menu-item" onClick={cartHandler}>
                <span className="menu-item-badge">
                  <ShoppingCartIcon className="menu-icon" />
                </span>
                <span className="menu-label">Cart</span>
              </div>
              {!isAuthenticated ? (
                <div className="menu-item" onClick={loginHandler}>
                  <span className="menu-item-badge">
                    <LockOpenIcon className="menu-icon" />
                  </span>
                  <span className="menu-label">Login</span>
                </div>
              ) : (
                <div className="menu-item menu-item-danger" onClick={logoutUserHandler}>
                  <span className="menu-item-badge">
                    <ExitToAppIcon className="menu-icon" />
                  </span>
                  <span className="menu-label">Logout</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProfileModal;