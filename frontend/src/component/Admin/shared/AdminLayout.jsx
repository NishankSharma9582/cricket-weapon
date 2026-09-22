import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const COLLAPSE_KEY = "admin-sidebar-collapsed";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === "true"
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleCollapse = () => {
    setCollapsed((v) => {
      localStorage.setItem(COLLAPSE_KEY, String(!v));
      return !v;
    });
  };

  return (
    <div className="app-ambient min-h-screen">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64"
        }`}
      >
        <AdminTopbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            {children}
          </motion.div>
        </main>

        <footer className="border-t border-ink-200/60 px-6 py-5 text-center text-xs font-semibold text-ink-400">
          Cricket<span className="text-brand">Weapon</span> Admin &copy;{" "}
          {new Date().getFullYear()} — crafted with care
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;