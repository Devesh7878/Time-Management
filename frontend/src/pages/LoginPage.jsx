import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim()
    };
    try {
      await login(payload);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-lg">
        <h1 className="mb-1 text-2xl font-bold text-slate-800">Welcome Back</h1>
        <p className="mb-5 text-sm text-slate-500">Login to manage team tasks and progress.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full rounded-lg border p-2.5"
            placeholder="Email"
            name="email"
            type="email"
            onChange={onChange}
            required
          />
          <input
            className="w-full rounded-lg border p-2.5"
            placeholder="Password"
            name="password"
            type="password"
            onChange={onChange}
            required
          />
          <button className="w-full rounded-lg bg-indigo-600 p-2.5 font-medium text-white hover:bg-indigo-500">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          New user?{" "}
          <Link className="font-medium text-indigo-600 hover:text-indigo-500" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
