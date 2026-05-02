import Task from "../models/Task.js";

const buildTaskQuery = (user, filters) => {
  const query = user.role === "Admin" ? {} : { assignedTo: user.id };

  if (filters.status) query.status = filters.status;
  if (filters.search) query.title = { $regex: filters.search, $options: "i" };
  if (filters.projectId) query.projectId = filters.projectId;
  if (filters.dueFrom || filters.dueTo) {
    query.dueDate = {};
    if (filters.dueFrom) query.dueDate.$gte = new Date(filters.dueFrom);
    if (filters.dueTo) query.dueDate.$lte = new Date(filters.dueTo);
  }

  return query;
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, status, dueDate, memberNote } = req.body;

    const taskPayload = {
      title,
      description,
      assignedTo,
      status: status || "Pending",
      dueDate,
      memberNote: memberNote || ""
    };
    if (projectId) taskPayload.projectId = projectId;

    const task = await Task.create(taskPayload);
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { status, search, dueFrom, dueTo, projectId, page = 1, limit = 10 } = req.query;
    const query = buildTaskQuery(req.user, { status, search, dueFrom, dueTo, projectId });
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate("projectId", "title")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      Task.countDocuments(query)
    ]);

    return res.status(200).json({
      tasks,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = req.user.role === "Admin";
    const isAssignee = task.assignedTo.toString() === req.user.id.toString();
    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ message: "Forbidden: not allowed to update this task" });
    }

    if (!isAdmin) {
      const { status, memberNote } = req.body;
      const allowedMemberFields = ["status", "memberNote"];
      if (Object.keys(req.body).some((key) => !allowedMemberFields.includes(key))) {
        return res.status(403).json({ message: "Members can update status and completion note only" });
      }

      if (status && status !== task.status) {
        const transitions = {
          Pending: ["In Progress"],
          "In Progress": ["Completed"],
          Completed: []
        };
        const allowDirectCompleteWithNote =
          status === "Completed" && typeof memberNote === "string" && memberNote.trim().length > 0;
        if (!allowDirectCompleteWithNote && !transitions[task.status]?.includes(status)) {
          return res.status(400).json({
            message: `Invalid status transition from ${task.status} to ${status}`
          });
        }
        task.status = status;
      }

      if (memberNote !== undefined) task.memberNote = memberNote;
      await task.save();
      return res.status(200).json(task);
    }

    const allowedUpdates = ["title", "description", "projectId", "assignedTo", "status", "dueDate", "memberNote"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
