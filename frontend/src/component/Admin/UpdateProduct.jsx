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
import { updateProduct, clearErrors, getProductDetails } from "../../actions/productAction";
import { UPDATE_PRODUCT_RESET } from "../../constants/productsConstatns";
import { useRouteMatch } from "react-router-dom";
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

function UpdateProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();

  const productId = useRouteMatch().params.id;
  const { error, product } = useSelector((state) => state.productDetails);
  const { loading, error: updateError, isUpdated } = useSelector(
    (state) => state.deleteUpdateProduct
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else if (product && product._id === productId) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory("");
      setInfo(product.info);
      setStock(product.Stock);
      setOldImages(product.images);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Product Updated Successfully");
      history.push("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, history, isUpdated, productId, product, updateError]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", Stock);
    myForm.set("info", info);
    images.forEach((currImg) => myForm.append("images", currImg));
    dispatch(updateProduct(productId, myForm));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    setOldImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prev) => [...prev, reader.result]);
          setImages((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <AdminLayout>
      <MetaData title="Update Product — Admin" />
      {loading ? (
        <div className="grid place-items-center py-24">
          <Loader />
        </div>
      ) : (
        <>
          <AdminPageHeader
            variant="plain"
            title="Update Product"
            subtitle="Edit the details of this item in your catalogue."
            back="/admin/products"
            breadcrumbs={[
              { label: "Admin" },
              { label: "Catalogue", to: "/admin/products" },
              { label: "Update Product" },
            ]}
          />

          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="glass glass-card overflow-hidden"
            >
              <form
                onSubmit={createProductSubmitHandler}
                encType="multipart/form-data"
                className="space-y-6 p-6 sm:p-8"
              >
                {/* Product Name */}
                <Field label="Product Name" icon={<ShoppingCart size={17} />} required>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field !pl-11"
                  />
                </Field>

                {/* Price + Stock */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Price" icon={<IndianRupee size={17} />} required>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="field !pl-11"
                    />
                  </Field>
                  <Field label="Stock" icon={<Package size={17} />} required>
                    <input
                      type="number"
                      required
                      min="0"
                      value={Stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="field !pl-11"
                    />
                  </Field>
                </div>

                {/* Category */}
                <Field label="Category" icon={<Tag size={17} />} required>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="field cursor-pointer appearance-none !pl-11"
                  >
                    <option value="">Choose a category…</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Short Info */}
                <Field label="Short Info" icon={<Info size={17} />} required>
                  <input
                    type="text"
                    required
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    className="field !pl-11"
                  />
                </Field>

                {/* Description */}
                <Field label="Description" icon={<FileText size={17} />} required>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="field resize-none !pl-11"
                  />
                </Field>

                {/* Images */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-600">
                    Product Images
                  </label>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink-200 bg-white/40 px-6 py-10 transition hover:border-brand/50 hover:bg-brand/5"
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow transition group-hover:scale-105">
                      <Upload size={22} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-ink-800">
                        Click to replace images
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
                    onChange={updateProductImagesChange}
                    className="hidden"
                  />

                  {imagesPreview.length > 0 ? (
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
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
                            onClick={() => {
                              setImages((old) => old.filter((_, j) => j !== i));
                              setImagesPreview((old) => old.filter((_, j) => j !== i));
                            }}
                            aria-label="Remove image"
                            className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink-900/70 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-brand"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : oldImages && oldImages.length > 0 ? (
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {oldImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-square overflow-hidden rounded-xl border border-ink-200/60"
                        >
                          <img
                            src={img.url}
                            alt={`Current ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-ink-900/60 px-2 py-0.5 text-[0.6rem] font-bold text-white backdrop-blur">
                            Current
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                      <ImagePlus size={14} /> No new images selected
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-ink-200/60 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => history.push("/admin/products")}
                    className="btn-ghost w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <Check size={17} /> Update Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

/* Small helper for consistent labeled fields with a leading icon */
function Field({ label, icon, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-ink-400">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

export default UpdateProduct;