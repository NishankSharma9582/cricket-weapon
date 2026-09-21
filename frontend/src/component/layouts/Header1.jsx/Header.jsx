import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, X, MapPin, User, LogIn, UserPlus } from "lucide-react";
import CartIcon from "./CartIcon";
import FlagSelect from "../../Home/Flag";
import Sidebar from "./Sidebar";
import ProfileModal from "./ProfileModel";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about_us" },
];

function Header() {
  const history = useHistory();
  const { isAuthenticated, user } = useSelector((state) => state.userData);

  const [sideMenu, setSideMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    history.push(searchValue.trim() ? `/products/${searchValue}` : "/products");
  };

  return (
    <>
      {/* ===== Utility bar ===== */}
      <div className="bg-ink-900 text-ink-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[0.72rem] font-medium tracking-wide sm:px-6 lg:px-8">
          <p className="truncate">We Offer Free Shipping On Orders Above ₹999</p>
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <MapPin size={14} />
              FIND LOCATION
            </span>
            <span className="hidden md:inline-flex">
              <FlagSelect value="in" onChange={() => {}} />
            </span>
            {isAuthenticated ? (
              <Link
                to="/account"
                className="flex items-center gap-1.5 text-white hover:text-brand-light"
              >
                <User size={14} /> My Account
              </Link>
            ) : (
              <span className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-white hover:text-brand-light"
                >
                  <LogIn size={14} /> Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 text-white hover:text-brand-light"
                >
                  <UserPlus size={14} /> Sign Up
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ===== Main glass navbar ===== */}
      <header className="sticky top-0 z-50 border-b border-ink-200/60 bg-white/70 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={require("../../../Image/logo.png")}
              alt="CricketWeapon Store"
              className="h-10 w-auto"
            />
            <span className="hidden text-lg font-bold tracking-tight text-ink-900 sm:block">
              Cricket<span className="text-brand">Weapon</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-4 py-2 text-[0.9rem] font-semibold text-ink-600 transition-colors hover:bg-brand/5 hover:text-brand"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Desktop search */}
            <form
              onSubmit={handleSearchFormSubmit}
              className="relative hidden md:block"
              role="search"
            >
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search cricket gear…"
                aria-label="Search products"
                className="field !w-52 !rounded-full !py-2 !pl-10 lg:!w-64"
              />
            </form>

            {/* Mobile search */}
            <button
              aria-label="Search"
              onClick={() => setSideMenu(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink-700 hover:bg-brand/5 hover:text-brand md:hidden"
            >
              <Search size={20} />
            </button>

            <Link
              to="/cart"
              aria-label="Cart"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-700 hover:bg-brand/5 hover:text-brand"
            >
              <CartIcon />
            </Link>

            <div className="hidden items-center sm:flex">
              <ProfileModal user={user} isAuthenticated={isAuthenticated} />
            </div>

            <button
              aria-label="Open menu"
              aria-expanded={sideMenu}
              onClick={() => setSideMenu(!sideMenu)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink-700 hover:bg-brand/5 hover:text-brand lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {sideMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSideMenu(false)}
                className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
                className="glass-strong fixed right-0 top-0 z-50 flex h-full w-[300px] max-w-[85vw] flex-col p-6 shadow-soft lg:hidden"
                aria-label="Mobile menu"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-ink-900">
                    Cricket<span className="text-brand">Weapon</span>
                  </span>
                  <button
                    aria-label="Close menu"
                    onClick={() => setSideMenu(false)}
                    className="grid h-9 w-9 place-items-center rounded-full text-ink-700 hover:bg-brand/5 hover:text-brand"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSearchFormSubmit} className="relative mt-6">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                  />
                  <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search products…"
                    aria-label="Search products"
                    className="field !rounded-full !pl-10"
                  />
                </form>

                <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile primary">
                  {NAV.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setSideMenu(false)}
                      className="rounded-xl px-4 py-3 text-[0.95rem] font-semibold text-ink-700 transition-colors hover:bg-brand/5 hover:text-brand"
                    >
                      {n.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto border-t border-ink-200/60 pt-4">
                  <Sidebar
                    handleSideBarMenu={() => setSideMenu(false)}
                    isAuthenticated={isAuthenticated}
                    user={user}
                  />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;