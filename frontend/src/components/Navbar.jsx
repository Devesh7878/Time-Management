import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
          Team Task Manager
        </Link>
        {user && (
          <div className="flex items-center gap-3 text-sm md:gap-5">
            <div className="hidden items-center gap-3 md:flex">
              <NavLink to="/dashboard" className="font-medium text-slate-600 hover:text-indigo-600">
                Dashboard
              </NavLink>
              <NavLink to="/tasks" className="font-medium text-slate-600 hover:text-indigo-600">
                Tasks
              </NavLink>
            </div>
            <span className="rounded bg-indigo-100 px-2 py-1 font-medium text-indigo-700">{user.role}</span>
            <span className="hidden font-medium md:inline">{user.name}</span>
            <button
              className="rounded bg-slate-800 px-3 py-1 text-white hover:bg-slate-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
