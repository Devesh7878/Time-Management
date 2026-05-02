import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Member" });
  const [loading, setLoading] = useState(false);

  const onChange = (event) => setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim()
    };
    try {
      await signup(payload);
      toast.success("Account created. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-violet-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-lg">
        <h1 className="mb-1 text-2xl font-bold text-slate-800">Create Account</h1>
        <p className="mb-5 text-sm text-slate-500">Sign up as Admin or Member to start collaborating.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded-lg border p-2.5" name="name" placeholder="Name" onChange={onChange} required />
          <input
            className="w-full rounded-lg border p-2.5"
            name="email"
            type="email"
            placeholder="Email"
            onChange={onChange}
            required
          />
          <input
            className="w-full rounded-lg border p-2.5"
            name="password"
            type="password"
            minLength={6}
            placeholder="Password"
            onChange={onChange}
            required
          />
          <select className="w-full rounded-lg border p-2.5" name="role" value={formData.role} onChange={onChange}>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>
          <button className="w-full rounded-lg bg-indigo-600 p-2.5 font-medium text-white hover:bg-indigo-500">
            {loading ? "Loading..." : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-indigo-600 hover:text-indigo-500" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
