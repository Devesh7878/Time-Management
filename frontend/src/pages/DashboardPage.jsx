import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState("");
  const [noteDrafts, setNoteDrafts] = useState({});

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([api.get("/tasks?limit=200"), api.get("/projects")]);
      const fetchedTasks = tasksRes.data.tasks || [];
      setTasks(fetchedTasks);
      setProjects(projectsRes.data || []);
      setNoteDrafts((prev) =>
        fetchedTasks.reduce((acc, task) => {
          acc[task._id] = prev[task._id] !== undefined ? prev[task._id] : task.memberNote || "";
          return acc;
        }, {})
      );
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "Completed").length;
    const pending = tasks.filter((task) => task.status === "Pending").length;
    const overdue = tasks.filter(
      (task) => task.status !== "Completed" && dayjs(task.dueDate).isBefore(dayjs(), "day")
    ).length;
    const inProgress = tasks.filter((task) => task.status === "In Progress").length;
    return { total, completed, pending, inProgress, overdue };
  }, [tasks]);

  const recentTasks = tasks.slice(0, 5);
  const memberVisibleTasks = tasks.slice(0, 8);

  const getMemberStatusOptions = (currentStatus) => {
    const transitions = {
      Pending: ["Pending", "In Progress"],
      "In Progress": ["In Progress", "Completed"],
      Completed: ["Completed"]
    };
    return transitions[currentStatus] || ["Pending"];
  };

  const updateTaskStatus = async (taskId, status, memberNote) => {
    try {
      setUpdatingTaskId(taskId);
      await api.put(`/tasks/${taskId}`, { status, memberNote: memberNote || "" });
      toast.success("Task updated");
      if (status === "Completed") {
        setNoteDrafts((prev) => ({ ...prev, [taskId]: "" }));
      }
      await fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingTaskId("");
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow">
        <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
        <p className="mt-1 text-sm text-indigo-100">
          {user.role === "Admin"
            ? "Track team delivery, assign work, and keep projects on schedule."
            : "Focus on your assigned tasks and update progress daily."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm uppercase text-slate-500">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {user.role === "Admin" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="text-lg font-semibold">Admin Overview</h2>
            <p className="mt-1 text-sm text-slate-600">Total active projects: {projects.length}</p>
            <p className="mt-1 text-sm text-slate-600">Completed rate: {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
            <div className="mt-4 flex gap-2">
              <Link to="/tasks" className="rounded border border-slate-300 px-3 py-2 text-sm font-medium">
                Manage Tasks
              </Link>
            </div>
          </div>
          <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="text-lg font-semibold">Recent Team Tasks</h2>
            <div className="mt-3 space-y-2 text-sm">
              {recentTasks.length ? (
                recentTasks.map((task) => (
                  <div key={task._id} className="rounded border p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{task.title}</span>
                      <span className="text-slate-500">{task.status}</span>
                    </div>
                    {task.memberNote ? (
                      <p className="mt-1 text-xs text-emerald-700">Member note: {task.memberNote}</p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-400">No member note yet</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No tasks found.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white p-5 shadow">
              <h2 className="text-lg font-semibold">My Progress</h2>
              <p className="mt-2 text-sm text-slate-600">
                You have {stats.pending} pending and {stats.inProgress} in-progress tasks.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Keep overdue tasks at zero by completing due items today.
              </p>
              <Link to="/tasks" className="mt-4 inline-block rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white">
                View My Tasks
              </Link>
            </div>
            <div className="rounded-lg bg-white p-5 shadow">
              <h2 className="text-lg font-semibold">Upcoming Due Dates</h2>
              <div className="mt-3 space-y-2 text-sm">
                {recentTasks.length ? (
                  recentTasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between rounded border p-2">
                      <span className="font-medium">{task.title}</span>
                      <span className="text-slate-500">{dayjs(task.dueDate).format("DD MMM")}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No assigned tasks found.</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="text-lg font-semibold">Assigned By Admin - Action Required</h2>
            <p className="mt-1 text-sm text-slate-600">Update your status here so your manager can track progress.</p>
            <div className="mt-4 space-y-3">
              {memberVisibleTasks.length ? (
                memberVisibleTasks.map((task) => {
                  const isOverdue = task.status !== "Completed" && dayjs(task.dueDate).isBefore(dayjs(), "day");
                  return (
                    <div key={task._id} className="rounded border p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-xs text-slate-500">Project: {task.projectId?.title || "-"}</p>
                        </div>
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            isOverdue ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isOverdue ? `Overdue (${dayjs(task.dueDate).format("DD MMM")})` : `Due ${dayjs(task.dueDate).format("DD MMM")}`}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <select
                          value={task.status}
                          className="rounded border px-2 py-1 text-sm"
                          onChange={(event) =>
                            updateTaskStatus(task._id, event.target.value, noteDrafts[task._id] || "")
                          }
                          disabled={updatingTaskId === task._id}
                        >
                          {getMemberStatusOptions(task.status).map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                        <span className="text-xs text-slate-500">
                          {updatingTaskId === task._id ? "Saving..." : `Current: ${task.status}`}
                        </span>
                      </div>
                      <textarea
                        className="mt-2 w-full rounded border p-2 text-sm"
                        rows={2}
                        placeholder="Write completion note for admin (what was done, blockers, update)..."
                        value={noteDrafts[task._id] || ""}
                        onChange={(event) =>
                          setNoteDrafts((prev) => ({ ...prev, [task._id]: event.target.value }))
                        }
                      />
                      <button
                        className="mt-2 rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white"
                        onClick={() => updateTaskStatus(task._id, "Completed", noteDrafts[task._id] || "")}
                        disabled={updatingTaskId === task._id}
                      >
                        {updatingTaskId === task._id ? "Saving..." : "Save Note"}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500">No assigned tasks available yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
