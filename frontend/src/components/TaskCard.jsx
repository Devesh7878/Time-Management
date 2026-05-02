import dayjs from "dayjs";

const TaskCard = ({ task, canDelete, canEditAnyStatus, onDelete, onStatusChange }) => {
  const isOverdue = dayjs(task.dueDate).isBefore(dayjs(), "day") && task.status !== "Completed";
  const transitions = {
    Pending: ["Pending", "In Progress"],
    "In Progress": ["In Progress", "Completed"],
    Completed: ["Completed"]
  };
  const statusOptions = canEditAnyStatus ? ["Pending", "In Progress", "Completed"] : transitions[task.status] || [];
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-slate-600">{task.description || "No description"}</p>
        </div>
        {canDelete && (
          <button className="text-sm text-red-600" onClick={() => onDelete(task._id)}>
            Delete
          </button>
        )}
      </div>
      <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
        <p>Project: {task.projectId?.title || "-"}</p>
        <p>Assignee: {task.assignedTo?.name || "-"}</p>
        <p className={isOverdue ? "font-semibold text-red-600" : ""}>
          Due: {dayjs(task.dueDate).format("DD MMM YYYY")}
        </p>
      </div>
      {task.memberNote && (
        <div className="mt-3 rounded-md bg-emerald-50 p-3 text-sm">
          <p className="font-medium text-emerald-700">Member Note</p>
          <p className="mt-1 text-emerald-900">{task.memberNote}</p>
        </div>
      )}
      <div className="mt-3">
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task._id, event.target.value)}
          className="rounded border px-2 py-1 text-sm"
        >
          {statusOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
