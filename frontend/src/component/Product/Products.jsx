import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useRouteMatch } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import Loader from "../layouts/loader/Loader";
import MetaData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import { PageShell, stagger, item, EmptyState } from "../../ui/kit";

const categories = [
  "Cricket Kits",
  "Batting Gloves",
  "Batting Pads",
  "Bats",
  "Bags",
  "Helmets",
  "Balls",
  "Stumps",
  "Shoes",
  "Clothing",
  "Accessories",
];

function Products() {
  const match = useRouteMatch();
  const keyword = match.params.keyword;
  const dispatch = useDispatch();
  const {
    products,
    loading,
    productsCount,
    error,
    resultPerPage,
    filteredProductCount,
  } = useSelector((state) => state.products);
  const alert = useAlert();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [price, setPrice] = React.useState([0, 100000]);
  const [category, setCategory] = React.useState("");
  const [ratings, setRatings] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, keyword, currentPage, price, category, ratings]);

  const priceHandler = (event) => {
    const v = +event.target.value;
    if (event.target.name === "min")
      setPrice([Math.min(v, price[1]), price[1]]);
    else setPrice([price[0], Math.max(v, price[0])]);
  };

  const handleCategoryChange = (value) => {
    const next = value === selectedCategory ? "" : value;
    setCategory(next);
    setSelectedCategory(next);
  };

  const handleRatingChange = (value) => {
    setRatings(+value);
  };

  const clearFilters = () => {
    setPrice([0, 100000]);
    setCategory("");
    setSelectedCategory("");
    setRatings(0);
  };

  const hasActiveFilters =
    keyword !== "" ||
    category !== "" ||
    ratings > 0 ||
    price[0] > 0 ||
    price[1] < 100000;

  const shownCount =
    hasActiveFilters && typeof filteredProductCount === "number"
      ? filteredProductCount
      : productsCount;

  const totalPages = Math.ceil(shownCount / resultPerPage);

  return (
    <PageShell>
      <MetaData title="Products -- CricketWeapon" />
      {loading ? (
        <Loader />
      ) : (
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                <SlidersHorizontal size={14} /> Catalogue
              </span>
              <h1 className="mt-2 text-3xl font-bold text-ink-900">
                {keyword ? `Results for “${keyword}”` : "All Products"}
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                {shownCount} product{shownCount !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass glass-card"
            >
              <EmptyState
                title="No products found"
                subtitle="Try adjusting your search or clearing filters."
              />
              <div className="pb-8 text-center">
                <button onClick={clearFilters} className="btn-ghost">
                  <RotateCcw size={16} /> Clear Filters
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              {/* Filters */}
              <aside className="lg:self-start">
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="glass glass-card space-y-7 p-6 lg:sticky lg:top-24"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-base font-bold text-ink-800">
                      <SlidersHorizontal size={17} /> Filters
                    </h3>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-brand"
                    >
                      <RotateCcw size={13} /> Reset
                    </button>
                  </div>

                  {/* Price */}
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-ink-700">
                      Price
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs text-ink-500">
                          Min (₹)
                        </label>
                        <input
                          type="number"
                          name="min"
                          value={price[0]}
                          onChange={priceHandler}
                          className="field !py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-ink-500">
                          Max (₹)
                        </label>
                        <input
                          type="number"
                          name="max"
                          value={price[1]}
                          onChange={priceHandler}
                          className="field !py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-ink-200/70" />

                  {/* Category */}
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-ink-700">
                      Categories
                    </h4>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="field"
                      aria-label="Category"
                    >
                      <option value="">All Categories</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="h-px bg-ink-200/70" />

                  {/* Ratings */}
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-ink-700">
                      Ratings Above
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { v: 0, label: "Any" },
                        { v: 3, label: "3★" },
                        { v: 4, label: "4★" },
                      ].map((r) => (
                        <button
                          key={r.v}
                          onClick={() => handleRatingChange(r.v)}
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            ratings === r.v
                              ? "border-brand bg-gradient-brand text-white shadow-glow"
                              : "border-ink-200 bg-white/70 text-ink-600 hover:border-brand/40 hover:text-brand-dark"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </aside>

              {/* Grid */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
              >
                {products.map((product) => (
                  <motion.div key={product._id} variants={item}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={shownCount}
                onChange={setCurrentPage}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="First"
                lastPageText="Last"
                itemClass="pagination-item"
                linkClass="pagination-link"
                activeClass="pagination-active"
                activeLinkClass="pagination-active-link"
              />
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default Products;
