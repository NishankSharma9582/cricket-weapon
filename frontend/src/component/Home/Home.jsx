import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  Headphones,
  ArrowRight,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { clearErrors, getProduct } from "../../actions/productAction";
import { dispalyMoney, generateDiscountedPrice } from "../DisplayMoney/DisplayMoney";
import MataData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import ProductCard from "./ProductCard";
import { PageShell, SectionHeading, stagger, item, fadeUp } from "../../ui/kit";

const PERKS = [
  { icon: Truck, title: "Free Shipping", sub: "On orders above ₹999" },
  { icon: ShieldCheck, title: "Genuine Gear", sub: "100% authentic equipment" },
  { icon: Headphones, title: "24/7 Support", sub: "We're here to help" },
];

function Hero() {
  const { products } = useSelector((state) => state.products);
  const hero = products && products[0];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-ink-900/5 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-dark"
          >
            <Sparkles size={14} />
            Premium Cricket Equipment
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 md:text-6xl"
          >
            Play What The
            <br />
            <span className="text-gradient-red">Pros Play.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-lg text-base leading-relaxed text-ink-500 md:text-lg"
          >
            Bats, balls, pads and protective gear — hand-picked for every format
            of the game. Step onto the pitch with confidence.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/products" className="btn-brand">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/about_us" className="btn-ghost">
              Our Story
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { v: "10k+", l: "Happy players" },
              { v: "300+", l: "Products" },
              { v: "4.9★", l: "Avg. rating" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-bold text-ink-900">{s.v}</p>
                <p className="mt-0.5 text-xs text-ink-500">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <div className="glass glass-card relative mx-auto max-w-md p-6">
            {hero && (
              <Link to={`/product/${hero._id}`} aria-label={hero.name}>
                <div className="relative overflow-hidden rounded-2xl bg-white/80">
                  <img
                    src={hero.images[0].url}
                    alt={hero.name}
                    className="aspect-square w-full object-contain p-8"
                  />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-bold text-white shadow-glow">
                    FEATURED
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="line-clamp-1 text-base font-semibold text-ink-800">
                      {hero.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-brand">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={14} className={i <= Math.round(hero.ratings) ? "fill-brand" : "fill-ink-200 text-ink-300"} />
                      ))}
                      <span className="ml-1.5 text-xs text-ink-500">({hero.numOfReviews})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <del className="block text-xs text-ink-400">{dispalyMoney(hero.price)}</del>
                    <span className="text-xl font-bold text-ink-900">
                      {dispalyMoney(generateDiscountedPrice(hero.price))}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  React.useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <PageShell>
      <MataData title="CricketWeapon - Premium Cricket Equipment" />
      {loading ? (
        <Loader />
      ) : (
        <div className="mx-auto max-w-7xl">
          <Hero />

          {/* Perks */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-4 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8"
          >
            {PERKS.map((p) => (
              <motion.div
                key={p.title}
                variants={item}
                className="glass glass-card flex items-center gap-4 p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                  <p.icon size={20} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink-800">{p.title}</h3>
                  <p className="text-xs text-ink-500">{p.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured */}
          <section className="px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                title="Featured Products"
                icon={Sparkles}
              />
            </div>
            {products && (
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {products.slice(0, 4).map((p) => (
                    <motion.div key={p._id} variants={item}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </section>

          {/* Trending */}
          <section className="px-5 pb-20 sm:px-6 lg:px-8">
            <div className="mb-8">
              <SectionHeading
                title="Trending Products"
                icon={TrendingUp}
              />
            </div>
            {products && (
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {products.slice(0, 8).map((p) => (
                    <motion.div key={p._id} variants={item}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </section>
        </div>
      )}
    </PageShell>
  );
}

export default Home;