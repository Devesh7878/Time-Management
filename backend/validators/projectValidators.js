import { body, param } from "express-validator";

export const createProjectValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  body("members").optional().isArray().withMessage("Members must be an array"),
  body("members.*").optional().isMongoId().withMessage("Each member must be a valid user ID")
];

export const updateProjectValidator = [
  param("id").isMongoId().withMessage("Invalid project ID"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().isString(),
  body("members").optional().isArray().withMessage("Members must be an array"),
  body("members.*").optional().isMongoId().withMessage("Each member must be a valid user ID")
];

export const projectIdValidator = [param("id").isMongoId().withMessage("Invalid project ID")];
