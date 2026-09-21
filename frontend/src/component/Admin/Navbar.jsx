import React from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ toggleHandler }) => {
  return (
    <nav className="glass-strong admin-bar sticky top-0 z-[999] flex items-center justify-between rounded-xl px-4 py-3">
      <button
        onClick={toggleHandler}
        aria-label="Toggle sidebar"
        className="grid h-11 w-11 place-items-center rounded-xl text-ink-800 transition hover:bg-brand/10 hover:text-brand"
      >
        <Menu size={26} />
      </button>

      <Link to="/admin/dashboard" className="mx-auto">
        <img
          src={require("../../Image/logo.png")}
          alt="logo"
          className="h-12 w-auto"
        />
      </Link>

      <Link to="/contact" className="btn-brand !px-5 !py-2 text-sm">
        Contact Us
      </Link>
    </nav>
  );
};

export default Navbar;