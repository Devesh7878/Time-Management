import Project from "../models/Project.js";

export const createProject = async (req, res, next) => {
  try {
    const { title, description, members = [] } = req.body;
    const memberSet = [...new Set(members.map((memberId) => memberId.toString()))];
    const updatedMembers = memberSet.includes(req.user.id.toString())
      ? memberSet
      : [...memberSet, req.user.id.toString()];

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      members: updatedMembers
    });

    return res.status(201).json(project);
  } catch (error) {
    return next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const query = req.user.role === "Admin" ? {} : { members: req.user.id };
    const projects = await Project.find(query)
      .populate("createdBy", "name email")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    return next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { title, description, members } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (members !== undefined) {
      const memberSet = [...new Set(members.map((memberId) => memberId.toString()))];
      if (!memberSet.includes(project.createdBy.toString())) {
        memberSet.push(project.createdBy.toString());
      }
      project.members = memberSet;
    }

    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
