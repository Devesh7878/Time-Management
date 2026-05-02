import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import api from "../services/api";

const TaskManagementPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({ status: "", search: "", dueFrom: "", dueTo: "", page: 1 });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: ""
  });

  const fetchTasks = async (incomingFilters = filters) => {
    const query = new URLSearchParams();
    Object.entries(incomingFilters).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    query.set("limit", "8");
    try {
      const { data } = await api.get(`/tasks?${query.toString()}`);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user.role === "Admin") {
      const loadAdminData = async () => {
        try {
          const { data } = await api.get("/users/members");
          setMembers(data);
        } catch {
          toast.error("Failed to load members");
        }
      };
      loadAdminData();
    }
  }, []);

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      toast.success("Status updated");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Delete failed");
    }
  };

  const createTask = async (event) => {
    event.preventDefault();
    try {
      await api.post("/tasks", taskForm);
      toast.success("Task created");
      setTaskForm({ title: "", description: "", assignedTo: "", dueDate: "" });
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Task creation failed");
    }
  };

  const applyFilters = () => {
    const updated = { ...filters, page: 1 };
    setFilters(updated);
    fetchTasks(updated);
  };

  const goToPage = (page) => {
    const updated = { ...filters, page };
    setFilters(updated);
    fetchTasks(updated);
  };

  return (
    <div className="space-y-5 p-6">
      <h1 className="text-2xl font-bold">Task Management</h1>

      {user.role === "Admin" && (
        <form onSubmit={createTask} className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Create Task</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded border p-2" placeholder="Title" required value={taskForm.title} onChange={(event) => setTaskForm((prev) => ({ ...prev, title: event.target.value }))} />
            <input className="rounded border p-2" placeholder="Description" value={taskForm.description} onChange={(event) => setTaskForm((prev) => ({ ...prev, description: event.target.value }))} />
            <select className="rounded border p-2" required value={taskForm.assignedTo} onChange={(event) => setTaskForm((prev) => ({ ...prev, assignedTo: event.target.value }))}>
              <option value="">Assign To Member</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            <input className="rounded border p-2" type="date" required value={taskForm.dueDate} onChange={(event) => setTaskForm((prev) => ({ ...prev, dueDate: event.target.value }))} />
          </div>
          <button className="mt-3 rounded bg-indigo-600 px-4 py-2 text-white">Create Task</button>
        </form>
      )}

      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Filters</h2>
        <div className="grid gap-2 md:grid-cols-4">
          <input className="rounded border p-2" placeholder="Search title" value={filters.search} onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))} />
          <select className="rounded border p-2" value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}>
            <option value="">All status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <input className="rounded border p-2" type="date" value={filters.dueFrom} onChange={(event) => setFilters((prev) => ({ ...prev, dueFrom: event.target.value }))} />
          <input className="rounded border p-2" type="date" value={filters.dueTo} onChange={(event) => setFilters((prev) => ({ ...prev, dueTo: event.target.value }))} />
        </div>
        <button className="mt-3 rounded bg-slate-800 px-4 py-2 text-white" onClick={applyFilters}>Apply</button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            canDelete={user.role === "Admin"}
            canEditAnyStatus={user.role === "Admin"}
            onDelete={deleteTask}
            onStatusChange={updateStatus}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          disabled={pagination.page <= 1}
          className="rounded border bg-white px-3 py-1 disabled:opacity-50"
          onClick={() => goToPage(pagination.page - 1)}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {pagination.page} of {pagination.pages || 1}
        </span>
        <button
          disabled={pagination.page >= pagination.pages}
          className="rounded border bg-white px-3 py-1 disabled:opacity-50"
          onClick={() => goToPage(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskManagementPage;
