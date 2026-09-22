import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import {
  Crosshair,
  Hand,
  Shield,
  HardHat,
  Disc3,
  Backpack,
  ShoppingBag,
  Footprints,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Star,
  ArrowRight,
  Quote,
  Mail,
  Send,
  Package,
  Award,
  Tag,
  Percent,
  ChevronRight,
} from "lucide-react";
import { dispalyMoney, generateDiscountedPrice } from "../DisplayMoney/DisplayMoney";
import { clearErrors, getProduct } from "../../actions/productAction";
import MataData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import ProductCard from "./ProductCard";
import { PageShell, stagger, item, EmptyState } from "../../ui/kit";

/* ------------------------------------------------------------------ */
/*  Shared variants & data                                             */
/* ------------------------------------------------------------------ */

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const TRUST_ITEMS = [
  { Icon: Truck, label: "Free shipping over ₹999" },
  { Icon: RotateCcw, label: "7-day returns" },
  { Icon: ShieldCheck, label: "Secure payments" },
];

const CATEGORIES = [
  { name: "Bats", Icon: Crosshair },
  { name: "Gloves", Icon: Hand },
  { name: "Pads", Icon: Shield },
  { name: "Helmets", Icon: HardHat },
  { name: "Balls", Icon: Disc3 },
  { name: "Kits", Icon: Backpack },
  { name: "Bags", Icon: ShoppingBag },
  { name: "Shoes", Icon: Footprints },
];

const VALUE_PROPS = [
  {
    Icon: ShieldCheck,
    title: "Authentic Gear",
    desc: "100% genuine equipment, sourced directly from trusted brands and manufacturers.",
  },
  {
    Icon: Truck,
    title: "Fast Delivery",
    desc: "Pan-India shipping with live tracking, so your gear always arrives on time.",
  },
  {
    Icon: RotateCcw,
    title: "Easy Returns",
    desc: "7-day hassle-free returns and exchanges on everything you order.",
  },
  {
    Icon: BadgeCheck,
    title: "Trusted by 10k+ Players",
    desc: "Thousands of cricketers at every level rely on CricketWeapon to up their game.",
  },
];

const TESTIMONIALS = [
  {
    name: "Vikram Sharma",
    role: "Club Cricketer",
    quote:
      "The bat quality is unreal — perfectly balanced and ready to play in. Felt like a pro from the very first hit.",
  },
  {
    name: "Arjun Mehta",
    role: "District Player",
    quote:
      "Gloves and pads landed in two days. Superb padding, perfect fit, honest pricing. This is the only shop I need now.",
  },
  {
    name: "Rahul Desai",
    role: "Weekend Warrior",
    quote:
      "Genuine gear at honest prices. The team even helped me pick the right kit size. Couldn't recommend it more.",
  },
];

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function SectionHeading({ icon: Icon, eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
          <Icon size={14} /> {eyebrow}
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-ink-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function Section({ children, className = "" }) {
  return (
    <motion.section
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={`py-16 sm:py-20 lg:py-24 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">{children}</div>
    </motion.section>
  );
}

function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="glass-card rounded-2xl">
        <EmptyState
          title="No products yet"
          subtitle="New cricket gear is on the way. Check back soon!"
          icon={Package}
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((p) => (
        <motion.div key={p._id} variants={item} className="h-full">
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}

function CategoryCard({ name, Icon }) {
  return (
    <Link to="/products" aria-label={`Shop ${name}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="glass glass-card flex h-full flex-col items-center gap-2.5 rounded-2xl px-4 py-5 text-center"
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
          <Icon size={22} />
        </span>
        <span className="text-sm font-bold text-ink-800">{name}</span>
      </motion.div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  1 · Hero                                                           */
/* ------------------------------------------------------------------ */

function Hero() {
  const { products } = useSelector((state) => state.products);

  const main = products && products[0];
  const mainImg =
    main && main.images && main.images[0]
      ? main.images[0].url
      : require("../../Image/Cricket-wepon/img2.png");
  const mainHref = main ? `/product/${main._id}` : "/products";
  const mainName = main ? main.name : "Premium Cricket Gear";
  const mainPrice = main ? main.price : null;

  const floats = products && products.length > 1
    ? [
        {
          img:
            products[1].images && products[1].images[0]
              ? products[1].images[0].url
              : require("../../Image/Cricket-wepon/01.jpg"),
          name: products[1].name,
          price: products[1].price,
          to: `/product/${products[1]._id}`,
        },
        {
          img: require("../../Image/Cricket-wepon/04.jpg"),
          name: "Pro Batting Pads",
          price: null,
          to: "/products",
        },
      ]
    : [
        {
          img: require("../../Image/Cricket-wepon/01.jpg"),
          name: "New Season Bats",
          price: null,
          to: "/products",
        },
        {
          img: require("../../Image/Cricket-wepon/04.jpg"),
          name: "Pro Batting Pads",
          price: null,
          to: "/products",
        },
      ];

  const exploreCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden py-16 sm:pt-20 sm:pb-20 lg:min-h-[85vh] lg:pb-24 lg:pt-20">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left copy */}
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-dark"
          >
            <Sparkles size={14} /> Premium Cricket Gear
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-900 sm:text-5xl md:text-6xl"
          >
            Play like a pro.
            <br />
            <span className="text-gradient-red">Gear that wins.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-lg text-base leading-relaxed text-ink-500 md:text-lg"
          >
            Bats, balls, pads and protective gear — hand-picked for every format
            of the game. Step onto the pitch with professional-grade confidence.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link to="/products" className="btn-brand">
              Shop Now <ArrowRight size={18} />
            </Link>
            <button onClick={exploreCategories} className="btn-ghost">
              Explore Categories <ChevronRight size={16} />
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {TRUST_ITEMS.map(({ Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-xs font-semibold text-ink-500"
              >
                <Icon size={14} className="text-brand" /> {label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right collage */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto w-full max-w-md lg:max-w-lg"
        >
          <motion.span
            aria-hidden="true"
            animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -inset-8 rounded-full bg-brand/20 blur-3xl"
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Main card */}
            <Link
              to={mainHref}
              aria-label={mainName}
              className="glass glass-card relative block rotate-1 rounded-3xl p-5"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/80">
                <img
                  src={mainImg}
                  alt={mainName}
                  className="aspect-square w-full object-contain p-8"
                />
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-glow">
                  <Star size={12} className="fill-white" /> Featured
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-base font-semibold text-ink-800">
                    {mainName}
                  </h3>
                  {main && (
                    <div className="mt-1 flex items-center gap-1 text-brand">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i <= Math.round(main.ratings)
                              ? "fill-brand"
                              : "fill-ink-200 text-ink-300"
                          }
                        />
                      ))}
                      <span className="ml-1.5 text-xs text-ink-500">
                        ({main.numOfReviews})
                      </span>
                    </div>
                  )}
                </div>
                {mainPrice && (
                  <div className="text-right">
                    <del className="block text-xs text-ink-400">
                      {dispalyMoney(mainPrice)}
                    </del>
                    <span className="text-xl font-bold text-ink-900">
                      {dispalyMoney(generateDiscountedPrice(mainPrice))}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Floating card 1 */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 bottom-8 w-32 -rotate-6 sm:-left-8 sm:w-36"
            >
              <Link
                to={floats[0].to}
                aria-label={floats[0].name}
                className="glass glass-card block rounded-2xl p-3"
              >
                <img
                  src={floats[0].img}
                  alt={floats[0].name}
                  className="aspect-square w-full rounded-xl bg-white/80 object-contain p-2"
                />
                <p className="mt-2 truncate text-xs font-bold text-ink-800">
                  {floats[0].name}
                </p>
                {floats[0].price && (
                  <p className="text-sm font-bold text-brand">
                    {dispalyMoney(generateDiscountedPrice(floats[0].price))}
                  </p>
                )}
              </Link>
            </motion.div>

            {/* Floating card 2 */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="absolute -right-3 top-6 w-32 rotate-6 sm:-right-7 sm:w-36"
            >
              <Link
                to={floats[1].to}
                aria-label={floats[1].name}
                className="glass glass-card block rounded-2xl p-3"
              >
                <img
                  src={floats[1].img}
                  alt={floats[1].name}
                  className="aspect-square w-full rounded-xl bg-white/80 object-contain p-2"
                />
                <p className="mt-2 truncate text-xs font-bold text-ink-800">
                  {floats[1].name}
                </p>
                {floats[1].price && (
                  <p className="text-sm font-bold text-brand">
                    {dispalyMoney(generateDiscountedPrice(floats[1].price))}
                  </p>
                )}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2 · Category strip                                                 */
/* ------------------------------------------------------------------ */

function Categories() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <SectionHeading
            icon={Package}
            eyebrow="Shop by Need"
            title="Find your weapon"
            subtitle="From willow to wicket-keeping — every department of the game, covered."
          />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          id="categories"
          className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-8 lg:gap-4 lg:overflow-visible lg:pb-0"
        >
          {CATEGORIES.map((c) => (
            <motion.div
              key={c.name}
              variants={item}
              className="w-28 shrink-0 snap-start sm:w-32 lg:w-auto"
            >
              <CategoryCard {...c} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3 · Featured products                                              */
/* ------------------------------------------------------------------ */

function Featured({ products, total }) {
  return (
    <Section>
      <SectionHeading
        icon={Sparkles}
        eyebrow="Handpicked"
        title="Featured Gear"
        subtitle="The blades and protection our players ask for most — ready to ship."
        action={
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand transition hover:text-brand-dark"
          >
            View all <ArrowRight size={16} />
          </Link>
        }
      />

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>

      {total > 8 && (
        <div className="mt-10 flex justify-center">
          <Link to="/products" className="btn-brand">
            View all products <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  4 · Why choose us                                                  */
/* ------------------------------------------------------------------ */

function ValueProps() {
  return (
    <Section>
      <SectionHeading
        icon={Award}
        eyebrow="Why CricketWeapon"
        title="Why players choose us"
        subtitle="More than a store — a partner in your game."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {VALUE_PROPS.map((vp) => (
          <motion.div
            key={vp.title}
            variants={item}
            className="glass glass-card rounded-2xl p-6"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <vp.Icon size={26} strokeWidth={1.9} />
            </span>
            <h3 className="mt-4 text-base font-bold text-ink-900">{vp.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
              {vp.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  5 · Best sellers / trending                                        */
/* ------------------------------------------------------------------ */

function BestSellers({ products }) {
  return (
    <Section>
      <SectionHeading
        icon={TrendingUp}
        eyebrow="Trending"
        title="Best Sellers"
        subtitle="The gear flying off the shelf this season."
        action={
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand transition hover:text-brand-dark"
          >
            View all <ArrowRight size={16} />
          </Link>
        }
      />

      {products && products.length > 0 ? (
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        >
          {products.map((p) => (
            <motion.div
              key={p._id}
              variants={item}
              className="w-[68vw] max-w-[280px] shrink-0 snap-start sm:w-[260px]"
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="glass-card mt-10 rounded-2xl">
          <EmptyState
            title="No trending products yet"
            subtitle="Best sellers will appear here as orders roll in."
            icon={TrendingUp}
          />
        </div>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  6 · Promo / split banner                                           */
/* ------------------------------------------------------------------ */

function PromoBanner() {
  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-0">
        {/* Image side */}
        <div className="relative overflow-hidden rounded-3xl lg:mr-[-1.5rem] lg:z-10">
          <img
            src={require("../../Image/Cricket-wepon/01.jpg")}
            alt="Season sale cricket equipment"
            className="h-full min-h-[260px] w-full object-cover"
          />
        </div>

        {/* Panel side */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-white shadow-glow sm:p-12"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-white/5 blur-xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ring-1 ring-white/25 backdrop-blur">
              <Tag size={13} /> Season Sale · New Arrivals
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Gear up for the new season
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
              Fresh stock, pro-grade quality and an extra welcome saving on your
              first order. Don't wait — limited inventory on hero products.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-2.5 font-mono text-base font-bold tracking-[0.2em] text-white ring-1 ring-white/30 backdrop-blur">
                <Percent size={16} /> CW10
              </span>
              <span className="text-xs font-semibold text-white/70">
                Use code for 10% off at checkout
              </span>
            </div>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand shadow-soft transition hover:bg-brand-light"
            >
              Explore the sale <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  7 · Testimonials                                                   */
/* ------------------------------------------------------------------ */

function Testimonials() {
  return (
    <Section>
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
          <Quote size={14} /> Word on the Street
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Players love the kit
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          Real reviews from cricketers who've stepped onto the pitch with
          CricketWeapon gear.
        </p>
      </div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-ink-200/60 bg-white/70 px-4 py-1.5 text-xs font-bold text-ink-700 shadow-soft backdrop-blur"
      >
        <Star size={14} className="fill-brand text-brand" /> 4.8 / 5 · 2,300+
        reviews
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {TESTIMONIALS.map((t) => (
          <motion.figure
            key={t.name}
            variants={item}
            className="glass glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-0.5 text-brand">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={15} className="fill-brand" />
              ))}
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-ink-600">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-glow">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-bold text-ink-900">{t.name}</p>
                <p className="text-xs text-ink-500">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  8 · Newsletter                                                     */
/* ------------------------------------------------------------------ */

function Newsletter() {
  const alert = useAlert();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail("");
    alert.success("Welcome to the squad! Check your inbox for updates.");
  };

  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl">
        <motion.span
          aria-hidden="true"
          animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-56 w-2/3 rounded-full bg-brand/20 blur-3xl"
        />

        <div className="glass glass-card relative p-8 text-center sm:p-12 lg:p-16">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            <Mail size={14} /> Stay in the Crease
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Join the CricketWeapon squad
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-500">
            Early access to drops, batting tips and exclusive member-only
            discounts — straight to your inbox.
          </p>

          {done ? (
            <p className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">
              <ShieldCheck size={18} /> You're on the list. See you at the net!
            </p>
          ) : (
            <form
              onSubmit={submit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="field w-full flex-1"
              />
              <button type="submit" className="btn-brand w-full shrink-0 sm:w-auto">
                <Send size={16} /> Subscribe
              </button>
            </form>
          )}

          <p className="mt-4 text-xs font-medium text-ink-400">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  const featured = products ? products.slice(0, 8) : [];
  const bestSellers = (() => {
    if (!products || products.length === 0) return [];
    const rated = products.filter((p) => p.ratings >= 4);
    if (rated.length) return rated.slice(0, 6);
    return [...products.slice(8), ...products.slice(0, 8)].slice(0, 6);
  })();

  return (
    <PageShell>
      <MataData title="CricketWeapon - Premium Cricket Equipment" />
      {loading ? (
        <div className="grid min-h-[60vh] place-items-center">
          <Loader />
        </div>
      ) : (
        <>
          <Hero />
          <Categories />
          <Featured products={featured} total={products ? products.length : 0} />
          <ValueProps />
          <BestSellers products={bestSellers} />
          <PromoBanner />
          <Testimonials />
          <Newsletter />
        </>
      )}
    </PageShell>
  );
}

export default Home;