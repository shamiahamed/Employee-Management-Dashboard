import { useEffect, useState } from "react";
import { DEPARTMENTS, STATUSES } from "../constants/employee";

const emptyForm = {
  name: "",
  email: "",
  department: DEPARTMENTS[0],
  designation: "",
  status: STATUSES[0],
  joiningDate: "",
};

export default function EmployeeForm({ open, initialData, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...initialData } : emptyForm);
      setErrors({});
    }
  }, [open, initialData]);

  if (!open) return null;

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.designation.trim()) errs.designation = "Designation is required.";
    if (!form.joiningDate) errs.joiningDate = "Joining date is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {initialData ? "Edit Employee" : "Add Employee"}
        </h3>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field label="Name" error={errors.name}>
            <input
              className={inputClass(errors.name)}
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <input
              className={inputClass(errors.email)}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Department">
              <select
                className={inputClass()}
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <select
                className={inputClass()}
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Designation" error={errors.designation}>
            <input
              className={inputClass(errors.designation)}
              value={form.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
            />
          </Field>

          <Field label="Joining Date" error={errors.joiningDate}>
            <input
              type="date"
              className={inputClass(errors.joiningDate)}
              value={form.joiningDate}
              onChange={(e) => handleChange("joiningDate", e.target.value)}
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : initialData ? "Save Changes" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 ${
    error ? "border-red-400" : "border-slate-300"
  }`;
}
