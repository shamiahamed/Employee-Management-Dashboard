import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <h1 className="font-semibold text-slate-800">Employee Management Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{user?.name || user?.email}</span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
