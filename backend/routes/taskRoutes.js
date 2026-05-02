import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { createTaskValidator, taskIdValidator, updateTaskValidator } from "../validators/taskValidators.js";

const router = Router();

router.use(protect);
router.get("/", getTasks);
router.post("/", authorizeRoles("Admin"), createTaskValidator, validateRequest, createTask);
router.put("/:id", updateTaskValidator, validateRequest, updateTask);
router.delete("/:id", authorizeRoles("Admin"), taskIdValidator, validateRequest, deleteTask);

export default router;
