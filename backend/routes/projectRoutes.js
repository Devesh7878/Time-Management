import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject
} from "../controllers/projectController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createProjectValidator,
  projectIdValidator,
  updateProjectValidator
} from "../validators/projectValidators.js";

const router = Router();

router.use(protect);
router.get("/", getProjects);
router.post("/", authorizeRoles("Admin"), createProjectValidator, validateRequest, createProject);
router.put("/:id", authorizeRoles("Admin"), updateProjectValidator, validateRequest, updateProject);
router.delete("/:id", authorizeRoles("Admin"), projectIdValidator, validateRequest, deleteProject);

export default router;
