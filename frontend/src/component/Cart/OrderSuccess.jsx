import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { PageShell } from "../../ui/kit";

function OrderSuccess() {
  return (
    <PageShell>
      <div className="flex min-h-[70vh] items-center justify-center px-5 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="glass glass-card w-full max-w-lg px-8 py-14 text-center"
        >
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 shadow-glow">
            <CheckCircle2 size={56} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-ink-900">
            Congratulations!
          </h1>
          <p className="mt-2 text-lg font-medium text-ink-600">
            Your Order has been Placed Successfully
          </p>
          <Link to="/orders" className="btn-brand mx-auto mt-8 w-fit">
            <PackageCheck size={18} /> View Orders
          </Link>
        </motion.div>
      </div>
    </PageShell>
  );
}

export default OrderSuccess;