import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  IndianRupee,
  Package,
  Info,
  ImagePlus,
  Upload,
  Tag,
  FileText,
  Check,
  X,
} from "lucide-react";

import MetaData from "../layouts/MataData/MataData";
import { createProduct, clearErrors } from "../../actions/productAction";
import { NEW_PRODUCT_RESET } from "../../constants/productsConstatns";
import AdminLayout from "./shared/AdminLayout";
import AdminPageHeader from "./shared/AdminPageHeader";
import Loader from "../layouts/loader/Loader";

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

const DESCRIPTION_MAX = 1500;

function NewProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();

  const { loading, error, success } = useSelector(
    (state) => state.addNewProduct,
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const fileInputRef = useRef();

  const handleImageUpload = () => fileInputRef.current?.click();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Product Created Successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
      history.push("/admin/dashboard");
    }
  }, [dispatch, alert, error, history, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", stock);
    myForm.set("info", info);
    images.forEach((img) => myForm.append("images", img));
    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImages((old) => old.filter((_, i) => i !== idx));
    setImagesPreview((old) => old.filter((_, i) => i !== idx));
  };

  return (
    <AdminLayout>
      <MetaData title="New Product — Admin" />

      <AdminPageHeader
        title="Create Product"
        subtitle="Add a new item to your cricket catalogue."
        breadcrumbs={[
          { label: "Admin" },
          { label: "Catalogue", to: "/admin/products" },
          { label: "New Product" },
        ]}
      />

      {loading ? (
        <div className="grid min-h-[50vh] place-items-center">
          <Loader />
        </div>
      ) : (
        <form
          onSubmit={createProductSubmitHandler}
          encType="multipart/form-data"
          className="w-full pb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full space-y-6"
          >
            {/* ============ Section 1 — Basic info ============ */}
            <Section
              title="Basic Information"
              subtitle="How the product appears in your catalogue."
            >
              <Field
                label="Product Name"
                icon={<ShoppingCart size={17} />}
                required
              >
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. English Willow Cricket Bat"
                  className="field !pl-11"
                />
              </Field>

              <Field label="Category" icon={<Tag size={17} />} required>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="field !pl-11 appearance-none cursor-pointer pr-10"
                >
                  <option value="">Choose a category…</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </Field>

              <Field
                label="Short Info"
                icon={<Info size={17} />}
                required
                hint="One line shown next to the price on cards."
              >
                <input
                  type="text"
                  required
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  placeholder="e.g. Grade 1 English Willow, 1.2kg"
                  className="field !pl-11"
                />
              </Field>
            </Section>

            {/* ============ Section 2 — Pricing & stock ============ */}
            <Section
              title="Pricing & Inventory"
              subtitle="Set the selling price and available units."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Price (₹)"
                  icon={<IndianRupee size={17} />}
                  required
                >
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="field !pl-11"
                  />
                </Field>

                <Field label="Stock" icon={<Package size={17} />} required>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className="field !pl-11"
                  />
                </Field>
              </div>
            </Section>

            {/* ============ Section 3 — Description ============ */}
            <Section
              title="Description"
              subtitle="Detailed product information shown on the product page."
            >
              <Field
                label="Full Description"
                icon={<FileText size={17} />}
                required
                alignIconTop
              >
                <textarea
                  required
                  rows={6}
                  maxLength={DESCRIPTION_MAX}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product, materials, dimensions, warranty…"
                  className="field !pl-11 resize-y"
                />
              </Field>
              <div className="flex justify-end text-xs text-ink-500">
                {description.length} / {DESCRIPTION_MAX} characters
              </div>
            </Section>

            {/* ============ Section 4 — Images ============ */}
            <Section
              title="Product Images"
              subtitle="Upload multiple angles. First image is used as the cover."
            >
              <button
                type="button"
                onClick={handleImageUpload}
                className="group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink-200 bg-white/40 px-6 py-10 transition hover:border-brand/50 hover:bg-brand/5"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow transition group-hover:scale-105">
                  <Upload size={22} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-ink-800">
                    Click to upload images
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    PNG, JPG, or WEBP · multiple allowed
                  </p>
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={createProductImagesChange}
                className="hidden"
              />

              {imagesPreview.length > 0 ? (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                  {imagesPreview.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-ink-200/60"
                    >
                      <img
                        src={img}
                        alt={`Preview ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label="Remove image"
                        className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink-900/70 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-brand"
                      >
                        <X size={14} />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-brand px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-white">
                          Cover
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                  <ImagePlus size={14} /> No images selected yet
                </p>
              )}
            </Section>
          </motion.div>

          {/* ============ Sticky action bar ============ */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200/60 bg-white/80 backdrop-blur-lg">
            <div className="mx-auto flex w-full max-w-7xl flex-col-reverse gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => history.push("/admin/dashboard")}
                className="btn-ghost w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Check size={17} /> Create Product
              </button>
            </div>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}

/* ---------- Reusable section card ---------- */
function Section({ title, subtitle, children }) {
  return (
    <div className="glass glass-card w-full p-6 sm:p-8">
      <div className="mb-6 border-b border-ink-200/60 pb-4">
        <h2 className="text-base font-extrabold uppercase tracking-wide text-ink-800">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

/* ---------- Reusable labeled field with leading icon ---------- */
function Field({ label, icon, required, hint, alignIconTop, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label className="block text-xs font-bold uppercase tracking-wide text-ink-600">
          {label} {required && <span className="text-brand">*</span>}
        </label>
        {hint && <span className="text-[0.7rem] text-ink-400">{hint}</span>}
      </div>
      <div className="relative">
        <span
          className={`pointer-events-none absolute left-3.5 z-10 text-ink-400 ${
            alignIconTop ? "top-3.5" : "top-1/2 -translate-y-1/2"
          }`}
        >
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

export default NewProduct;
