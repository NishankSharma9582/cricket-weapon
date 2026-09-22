import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAdminProducts, deleteProduct } from "../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Pencil, Trash2, PackagePlus } from "lucide-react";
import { DELETE_PRODUCT_RESET } from "../../constants/productsConstatns";
import AdminLayout from "./shared/AdminLayout";
import AdminPageHeader from "./shared/AdminPageHeader";
import DataTable from "./shared/DataTable";
import FilterBar from "./shared/FilterBar";
import ConfirmDialog from "./shared/ConfirmDialog";
import Pagination from "react-js-pagination";

const PAGE_SIZE = 10;

function ProductList() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, products, loading } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteUpdateProduct
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemId, setItemId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Product Deleted Successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProducts());
  }, [dispatch, error, alert, deleteError, isDeleted]);

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = products;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || String(p._id).includes(q)
      );
    }
    if (filter === "in") list = list.filter((p) => p.Stock > 0);
    if (filter === "out") list = list.filter((p) => Number(p.Stock) === 0);
    return list;
  }, [products, search, filter]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (currentPage > 1 && pageCount === 0) setCurrentPage(1);
  }, [currentPage, pageCount]);

  const askDelete = (id) => {
    setItemId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemId) dispatch(deleteProduct(itemId));
    setDialogOpen(false);
  };

  const resetFilters = () => {
    setSearch("");
    setFilter("");
    setCurrentPage(1);
  };

  const rows = useMemo(
    () =>
      paged.map((item) => ({
        id: item._id,
        name: item.name,
        stock: item.Stock,
        price: item.price,
        image:
          item.images && item.images[0] ? item.images[0].url : "",
      })),
    [paged]
  );

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image && (
            <img
              src={row.image}
              alt={row.name}
              className="h-10 w-10 shrink-0 rounded-xl border border-ink-200 object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="max-w-[16rem] truncate font-semibold text-ink-900">
              {row.name}
            </p>
            <p className="text-xs text-ink-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row) => {
        const out = Number(row.stock) === 0;
        return (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
              out ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {out ? "Out of stock" : `${row.stock} in stock`}
          </span>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <span className="font-bold text-ink-900">₹{row.price.toFixed(2)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/product/${row.id}`}
            aria-label={`Edit ${row.name}`}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-700 transition hover:bg-brand/5 hover:text-brand"
          >
            <Pencil size={17} />
          </Link>
          <button
            onClick={() => askDelete(row.id)}
            aria-label={`Delete ${row.name}`}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-700 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="All Products"
        subtitle="Manage your catalogue — edit details or remove products."
        breadcrumbs={[{ label: "Admin" }, { label: "Catalogue" }, { label: "Products" }]}
        action={
          <Link to="/admin/new/product" className="btn-brand">
            <PackagePlus size={17} /> Add Product
          </Link>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
        filters={[
          {
            key: "stock",
            label: "All Stock Status",
            value: filter,
            onChange: (v) => {
              setFilter(v);
              setCurrentPage(1);
            },
            options: [
              { value: "in", label: "In Stock" },
              { value: "out", label: "Out of Stock" },
            ],
          },
        ]}
        onReset={resetFilters}
        resultCount={filtered.length}
      />

      <DataTable
        loading={loading}
        columns={columns}
        rows={rows}
        emptyTitle="No products found"
        emptySubtitle="Try a different keyword or reset your filters."
      />

      {!loading && pageCount > 1 && (
        <div className="paginationBox">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={PAGE_SIZE}
            totalItemsCount={filtered.length}
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
        title="Delete this product?"
        message="This will permanently remove the product from your store."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </AdminLayout>
  );
}

export default ProductList;