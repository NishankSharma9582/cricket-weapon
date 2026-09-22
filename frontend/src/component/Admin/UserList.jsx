import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Pencil, Trash2 } from "lucide-react";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstanat";
import AdminLayout from "./shared/AdminLayout";
import AdminPageHeader from "./shared/AdminPageHeader";
import DataTable from "./shared/DataTable";
import FilterBar from "./shared/FilterBar";
import ConfirmDialog from "./shared/ConfirmDialog";
import Pagination from "react-js-pagination";

const PAGE_SIZE = 10;

function UserList() {
  const dispatch = useDispatch();
  const { error, users, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message } = useSelector(
    (state) => state.profileData
  );
  const alert = useAlert();

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
      alert.success(message || "User Deleted Successfully");
      dispatch({ type: DELETE_USER_RESET });
    }
    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, isDeleted, message]);

  const filtered = useMemo(() => {
    if (!users) return [];
    let list = users;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          String(u._id).includes(q)
      );
    }
    if (filter) list = list.filter((u) => u.role === filter);
    return list;
  }, [users, search, filter]);

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
    if (itemId) dispatch(deleteUser(itemId));
    setDialogOpen(false);
  };

  const resetFilters = () => {
    setSearch("");
    setFilter("");
    setCurrentPage(1);
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brand/20 bg-ink-100 text-sm font-bold text-brand">
            {row.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="max-w-[14rem] truncate font-semibold text-ink-900">
              {row.name}
            </p>
            <p className="truncate text-xs text-ink-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row) => (
        <span className="max-w-[16rem] truncate text-ink-600">{row.email}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
            row.role === "admin"
              ? "bg-brand/10 text-brand-dark"
              : "bg-ink-100 text-ink-600"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/user/${row.id}`}
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

  const rows = paged.map((item) => ({
    id: item._id,
    role: item.role,
    email: item.email,
    name: item.name,
  }));

  return (
    <AdminLayout>
      <AdminPageHeader
        title="All Users"
        subtitle="Manage registered customers and their roles."
        breadcrumbs={[{ label: "Admin" }, { label: "Users" }, { label: "All Users" }]}
      />

      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
        filters={[
          {
            key: "role",
            label: "All Roles",
            value: filter,
            onChange: (v) => {
              setFilter(v);
              setCurrentPage(1);
            },
            options: [
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
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
        emptyTitle="No users found"
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
        title="Delete this user?"
        message="This will permanently remove the user account."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </AdminLayout>
  );
}

export default UserList;