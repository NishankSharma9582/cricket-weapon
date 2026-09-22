import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { getAllreviews, clearErrors, deleteProductReview } from "../../actions/productAction";
import { Star, Trash2, Search } from "lucide-react";
import { DELETE_REVIEW_RESET } from "../../constants/productsConstatns";
import AdminLayout from "./shared/AdminLayout";
import AdminPageHeader from "./shared/AdminPageHeader";
import DataTable from "./shared/DataTable";
import ConfirmDialog from "./shared/ConfirmDialog";
import Pagination from "react-js-pagination";

const PAGE_SIZE = 10;

function ProductReviews() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, reviews, loading } = useSelector((state) => state.getAllReview);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteReview
  );

  const [productId, setProductId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemId, setItemId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllreviews(productId));
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, alert, deleteError, isDeleted, productId]);

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    setSearched(true);
    setCurrentPage(1);
    dispatch(getAllreviews(productId));
  };

  const askDelete = (id) => {
    setItemId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemId) dispatch(deleteProductReview(itemId, productId));
    setDialogOpen(false);
  };

  const pageCount = reviews ? Math.ceil(reviews.length / PAGE_SIZE) : 0;
  const paged = reviews
    ? reviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : [];

  const columns = [
    {
      key: "id",
      label: "Review ID",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-ink-500">
          {row.id.slice(-10)}
        </span>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand/20 bg-ink-100 text-xs font-bold text-brand">
            {row.user.charAt(0).toUpperCase()}
          </span>
          <span className="font-semibold text-ink-800">{row.user}</span>
        </div>
      ),
    },
    {
      key: "comment",
      label: "Comment",
      render: (row) => (
        <p className="max-w-[22rem] truncate text-ink-600">{row.comment}</p>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
            row.rating >= 3
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          <Star size={13} className="fill-current" /> {row.rating}/5
        </span>
      ),
    },
    {
      key: "recommend",
      label: "Recommend",
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
            row.recommend === "Yes"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-ink-100 text-ink-500"
          }`}
        >
          {row.recommend}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end">
          <button
            onClick={() => askDelete(row.id)}
            aria-label="Delete review"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-700 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];

  const rows = paged.map((item) => ({
    id: item._id,
    user: item.name,
    comment: item.comment,
    rating: item.ratings,
    recommend: item.recommend ? "Yes" : "No",
  }));

  return (
    <AdminLayout>
      <AdminPageHeader
        variant="plain"
        title="Product Reviews"
        subtitle="Look up reviews for a product by its ID and moderate community feedback."
        breadcrumbs={[
          { label: "Admin" },
          { label: "Catalogue", to: "/admin/products" },
          { label: "Reviews" },
        ]}
      />

      {/* Search by product id */}
      <form
        onSubmit={productReviewsSubmitHandler}
        className="glass-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
            <Star size={18} />
          </span>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID (24 characters)…"
            aria-label="Product ID"
            className="field w-full"
          />
        </div>
        <button
          type="submit"
          disabled={productId.length !== 24}
          className="btn-brand shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search size={16} /> Load Reviews
        </button>
      </form>

      {searched && (
        <DataTable
          loading={loading}
          columns={columns}
          rows={rows}
          emptyTitle="No reviews found"
          emptySubtitle="This product has no reviews yet, or the ID is invalid."
        />
      )}

      {searched && !loading && pageCount > 1 && (
        <div className="paginationBox">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={PAGE_SIZE}
            totalItemsCount={reviews.length}
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

      <ConfirmDialog
        open={dialogOpen}
        title="Delete this review?"
        message="This will permanently remove the review."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </AdminLayout>
  );
}

export default ProductReviews;