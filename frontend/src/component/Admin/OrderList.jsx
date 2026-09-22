import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrders, clearErrors, deleteOrder } from "../../actions/orderAction";
import { useAlert } from "react-alert";
import { Eye, Trash2 } from "lucide-react";
import { DELETE_ORDER_RESET } from "../../constants/orderConstant";
import AdminLayout from "./shared/AdminLayout";
import AdminPageHeader from "./shared/AdminPageHeader";
import DataTable from "./shared/DataTable";
import FilterBar from "./shared/FilterBar";
import StatusPill from "./shared/StatusPill";
import ConfirmDialog from "./shared/ConfirmDialog";
import Pagination from "react-js-pagination";

const PAGE_SIZE = 10;

function OrderList() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, loading, orders } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteUpdateOrder
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
      alert.success("Order Deleted Successfully");
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getAllOrders());
  }, [dispatch, error, alert, deleteError, isDeleted]);

  const filtered = useMemo(() => {
    if (!orders) return [];
    let list = orders;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) => o._id.toLowerCase().includes(q) || (o.user && o.user.name && o.user.name.toLowerCase().includes(q))
      );
    }
    if (filter) list = list.filter((o) => o.orderStatus === filter);
    return list;
  }, [orders, search, filter]);

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
    if (itemId) dispatch(deleteOrder(itemId));
    setDialogOpen(false);
  };

  const resetFilters = () => {
    setSearch("");
    setFilter("");
    setCurrentPage(1);
  };

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-ink-500">
          #{row.id.slice(-10)}
        </span>
      ),
    },
    {
      key: "itemsQty",
      label: "Items",
      render: (row) => (
        <span className="font-semibold text-ink-700">{row.itemsQty}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => (
        <span className="font-bold text-ink-900">₹{row.amount.toFixed(2)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/order/${row.id}`}
            aria-label="View order"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-700 transition hover:bg-brand/5 hover:text-brand"
          >
            <Eye size={17} />
          </Link>
          <button
            onClick={() => askDelete(row.id)}
            aria-label="Delete order"
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
    itemsQty: item.orderItems.length,
    amount: item.totalPrice,
    status: item.orderStatus,
  }));

  return (
    <AdminLayout>
      <AdminPageHeader
        title="All Orders"
        subtitle="Track and manage every order placed in your store."
        breadcrumbs={[{ label: "Admin" }, { label: "Orders" }, { label: "All Orders" }]}
      />

      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
        filters={[
          {
            key: "status",
            label: "All Status",
            value: filter,
            onChange: (v) => {
              setFilter(v);
              setCurrentPage(1);
            },
            options: [
              { value: "Processing", label: "Processing" },
              { value: "Shipped", label: "Shipped" },
              { value: "Delivered", label: "Delivered" },
              { value: "Cancelled", label: "Cancelled" },
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
        emptyTitle="No orders found"
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
        title="Delete this order?"
        message="This will permanently remove the order from your records."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </AdminLayout>
  );
}

export default OrderList;