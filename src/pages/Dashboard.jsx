import { useEffect, useMemo, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Analytics from "../components/Analytics";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../services/api";

import { useDebounce } from "../hooks/useDebounce";
import { PAGE_SIZE, STATUS_FILTER_OPTIONS } from "../constants/employee";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 300);
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployees();
      // Reverse array so newly created items (appended to db.json) display first on Page 1 after refresh
      setEmployees([...res.data].reverse());
    } catch {
      setError("Could not load employees. Is the API server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(employees.map((e) => e.department)))],
    [employees]
  );
  const statuses = STATUS_FILTER_OPTIONS;

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === "All" || e.department === deptFilter;
      const matchesStatus = statusFilter === "All" || e.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedEmployees = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, deptFilter, statusFilter]);

  function openCreateForm() {
    setEditingEmployee(null);
    setFormOpen(true);
  }

  function openEditForm(emp) {
    setEditingEmployee(emp);
    setFormOpen(true);
  }

  async function handleFormSubmit(data) {
    setSubmitting(true);
    setActionError(null);
    try {
      if (editingEmployee) {
        const res = await updateEmployee(editingEmployee.id, data);
        setEmployees((prev) => prev.map((e) => (e.id === editingEmployee.id ? res.data : e)));
      } else {
        const res = await createEmployee(data);
        setEmployees((prev) => [res.data, ...prev]);
      }
      setFormOpen(false);
    } catch {
      setActionError("Failed to save employee. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setActionError(null);
    try {
      await deleteEmployee(deleteTarget.id);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    } catch {
      setActionError("Failed to delete employee. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {error ? (
          <ErrorState message={error} onRetry={fetchEmployees} />
        ) : (
          <>
            <Analytics employees={employees} />

            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="font-semibold text-slate-800">Employees</h2>
                <button
                  onClick={openCreateForm}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                  + Add Employee
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name or email..."
                  className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
                  ))}
                </select>
              </div>

              {actionError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                  {actionError}
                </div>
              )}

              {loading ? (
                <LoadingState />
              ) : (
                <>
                  <EmployeeTable employees={pagedEmployees} onEdit={openEditForm} onDelete={setDeleteTarget} />
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
              )}
            </div>
          </>
        )}
      </main>

      <EmployeeForm
        open={formOpen}
        initialData={editingEmployee}
        onSubmit={handleFormSubmit}
        onCancel={() => setFormOpen(false)}
        submitting={submitting}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Employee"
        message={deleteTarget ? `Are you sure you want to delete ${deleteTarget.name}? This cannot be undone.` : ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-slate-400">
      <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin mb-3" />
      <p className="text-sm">Loading employees...</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <p className="text-slate-700 font-medium mb-1">Something went wrong</p>
      <p className="text-sm text-slate-500 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
      >
        Retry
      </button>
    </div>
  );
}
