import { body, param } from "express-validator";

export const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  body("projectId").optional().isMongoId().withMessage("Invalid project ID"),
  body("assignedTo").isMongoId().withMessage("Invalid assignee ID"),
  body("dueDate").isISO8601().withMessage("dueDate must be a valid date"),
  body("memberNote").optional().isString().isLength({ max: 500 }),
  body("status").optional().isIn(["Pending", "In Progress", "Completed"])
];

export const updateTaskValidator = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().isString(),
  body("projectId").optional().isMongoId().withMessage("Invalid project ID"),
  body("assignedTo").optional().isMongoId().withMessage("Invalid assignee ID"),
  body("dueDate").optional().isISO8601().withMessage("dueDate must be a valid date"),
  body("memberNote").optional().isString().isLength({ max: 500 }),
  body("status").optional().isIn(["Pending", "In Progress", "Completed"])
];

export const taskIdValidator = [param("id").isMongoId().withMessage("Invalid task ID")];
