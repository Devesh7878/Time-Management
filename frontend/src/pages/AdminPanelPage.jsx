import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AdminPanelPage = () => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [projectData, setProjectData] = useState({ title: "", description: "", members: "" });

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
    const loadMembers = async () => {
      try {
        const { data } = await api.get("/users/members");
        setMembers(data);
      } catch {
        toast.error("Failed to load members");
      }
    };
    loadMembers();
  }, []);

  const createProject = async (event) => {
    event.preventDefault();
    try {
      const members = projectData.members
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean);
      await api.post("/projects", { ...projectData, members });
      toast.success("Project created");
      setProjectData({ title: "", description: "", members: "" });
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Project creation failed");
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      loadProjects();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <form onSubmit={createProject} className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Create Project</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded border p-2"
            placeholder="Title"
            value={projectData.title}
            onChange={(event) => setProjectData((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
          <input
            className="rounded border p-2"
            placeholder="Description"
            value={projectData.description}
            onChange={(event) => setProjectData((prev) => ({ ...prev, description: event.target.value }))}
          />
          <input
            className="rounded border p-2"
            placeholder="Members IDs comma-separated"
            value={projectData.members}
            onChange={(event) => setProjectData((prev) => ({ ...prev, members: event.target.value }))}
          />
        </div>
        <button className="mt-3 rounded bg-indigo-600 px-4 py-2 text-white">Create</button>
      </form>
      <div className="space-y-3">
        <div className="rounded-lg bg-white p-4 text-sm text-slate-700 shadow">
          <p className="font-semibold">Available Members</p>
          <div className="mt-2 space-y-1">
            {members.map((member) => (
              <p key={member._id}>
                {member.name} - <span className="font-mono text-xs">{member._id}</span>
              </p>
            ))}
          </div>
        </div>
        {projects.map((project) => (
          <div key={project._id} className="rounded-lg bg-white p-4 shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-slate-600">{project.description}</p>
              </div>
              <button className="text-red-600" onClick={() => deleteProject(project._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanelPage;
