import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  ShoppingBag,
} from "lucide-react";
import GooglePlay from "../../../Image/Footer/google-play-black.svg";
import AppStore from "../../../Image/Footer/app-store-black.svg";

const footMenu = [
  {
    id: 1,
    title: "Help",
    menu: [
      { id: 1, link: "Track Order", path: "/orders" },
      { id: 2, link: "FAQs", path: "/terms/conditions" },
      { id: 3, link: "Cancel Order", path: "/policy/return" },
      { id: 4, link: "Return Order", path: "/policy/return" },
      { id: 5, link: "Warranty Info", path: "/policy/Terms" },
    ],
  },
  {
    id: 2,
    title: "Policies",
    menu: [
      { id: 1, link: "Return Policy", path: "/policy/return" },
      { id: 2, link: "Security", path: "/policy/privacy" },
      { id: 3, link: "Sitemap", path: "/policy/Terms" },
      { id: 4, link: "Privacy Policy", path: "/policy/privacy" },
      { id: 5, link: "T&C", path: "/terms/conditions" },
    ],
  },
  {
    id: 3,
    title: "Company",
    menu: [
      { id: 1, link: "About Us", path: "/about" },
      { id: 2, link: "Contact Us", path: "/contact" },
      { id: 3, link: "Service Centres", path: "/" },
      { id: 4, link: "Careers", path: "/" },
      { id: 5, link: "Affiliates", path: "/terms/conditions" },
    ],
  },
];

const IconFb = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.3H7.5v3h2.4v7h3.6z" />
  </svg>
);
const IconTw = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.2 4h3l-6.6 7.6L22.5 20h-6.1l-4.8-6.3L6 20H3l7.1-8.1L2.4 4h6.2l4.3 5.7L18.2 4zm-1 14.4h1.7L7.8 5.5H6L17.2 18.4z" />
  </svg>
);
const IconIg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.1-.1 1.7-.1 4.9-.1zm0 1.8c-3.1 0-3.5 0-4.8.1-1.1.1-1.4.2-1.6.3-.4.2-.7.4-1 .7-.3.3-.5.6-.7 1-.1.3-.3.5-.4 1.6-.1 1.3-.1 1.6-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.4.3 1.6.2.4.4.7.7 1 .3.3.6.5 1 .7.3.1.5.3 1.6.4 1.3.1 1.6.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.4-.2 1.6-.3.4-.2.7-.4 1-.7.3-.3.5-.6.7-1 .1-.3.3-.5.4-1.6.1-1.3.1-1.6.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.4-.3-1.6-.2-.4-.4-.7-.7-1-.3-.3-.6-.5-1-.7-.3-.1-.5-.3-1.6-.4-1.3-.1-1.6-.1-4.8-.1zm0 3.1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.2-3.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
  </svg>
);
const IconLn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.5 8.2H3.2V20.6h3.3V8.2zM4.8 3.4a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.6 14c0-3.1-1.6-4.9-4-4.9-1.5 0-2.5.7-3 1.6V8.2h-3.3c.1 1.1 0 12.4 0 12.4h3.3v-6.9c0-.4.1-.7.3-1 .4-.7 1.1-1 1.9-.9 1.4 0 2 1 2 2.7v6.1h3.4V14z" />
  </svg>
);

const footSocial = [
  { id: 1, icon: <IconFb />, path: "https://www.instagram.com/iam_nightbot/" },
  { id: 2, icon: <IconTw />, path: "https://twitter.com/Iam_DEv22" },
  { id: 3, icon: <IconIg />, path: "https://www.instagram.com/cricket_weapon_store17" },
  { id: 4, icon: <IconLn />, path: "https://www.linkedin.com/in/iam-devesh/" },
];

const Footer = () => {
  const [subValue, setSubValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubValue("");
    alert("Thankyou, you are subscribed to receive our daily newsletter");
  };

  const currYear = new Date().getFullYear();

  return (
    <footer className="glass-dark relative mt-16 !rounded-none text-ink-100 shadow-soft">
      <div className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <ShoppingBag size={20} />
              </span>
              <span className="text-xl font-bold text-white">CricketWeapon</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
              Premium cricket equipment trusted by players across the nation.
              Gear up, play fearless.
            </p>

            <form onSubmit={handleSubmit} className="mt-6">
              <label
                htmlFor="newsletter"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Newsletter
              </label>
              <div className="flex overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={subValue}
                  onChange={(e) => setSubValue(e.target.value)}
                  placeholder="Email Address*"
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-ink-400 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="grid w-14 shrink-0 place-items-center bg-gradient-brand text-white transition hover:brightness-110"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 text-xs text-ink-400">
                Submitting agrees to our{" "}
                <Link to="/terms/conditions" className="text-brand-light hover:underline">
                  Terms &amp; Conditions
                </Link>
              </p>
            </form>
          </div>

          {/* Menu columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {footMenu.map((item) => (
              <div key={item.id}>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
                  {item.title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {item.menu.map((m) => (
                    <li key={m.id}>
                      <Link
                        to={m.path}
                        className="text-sm text-ink-300 transition-colors hover:text-brand-light"
                      >
                        {m.link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* App + social */}
          <div className="lg:col-span-3">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
              Download App
            </h4>
            <div className="flex flex-col gap-3">
              <a href="/" className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-brand/50">
                <img src={GooglePlay} alt="Google Play Store" className="h-5 w-5" />
                Google Play
              </a>
              <a href="/" className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-brand/50">
                <img src={AppStore} alt="App Store" className="h-5 w-5" />
                App Store
              </a>
            </div>

            <div className="mt-6">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-white">
                Follow Us
              </h4>
              <div className="flex items-center gap-3">
                {footSocial.map((s) => (
                  <a
                    key={s.id}
                    href={s.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Social link"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 text-ink-200 transition hover:border-brand/50 hover:bg-gradient-brand hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 text-xs text-ink-400 sm:px-6 md:flex-row lg:px-8">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li><Link to="/policy/privacy" className="hover:text-brand-light">Privacy Policy</Link></li>
            <li><Link to="/terms/conditions" className="hover:text-brand-light">Terms &amp; Conditions</Link></li>
            <li><Link to="/policy/Terms" className="hover:text-brand-light">Terms of Use</Link></li>
          </ul>
          <p>
            &copy; {currYear} Cricket Weapon, All Rights Reserved.{" "}
            <a href="iam-devesh.tech" className="text-ink-300 hover:text-brand-light">
              Built by Iam_DEv
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;