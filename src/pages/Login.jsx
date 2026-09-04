import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    const ok = await login({ email, password, remember });
    if (ok) navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Employee Management</h1>
        <p className="text-slate-500 mb-6">Sign in to access the dashboard</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 ${
                fieldErrors.email ? "border-red-400" : "border-slate-300"
              }`}
              placeholder="admin@company.com"
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 ${
                fieldErrors.password ? "border-red-400" : "border-slate-300"
              }`}
              placeholder="••••••••"
            />
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-lg py-2.5 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-6 text-center">
          Demo credentials: admin@company.com / admin123
        </p>
      </div>
    </div>
  );
}
