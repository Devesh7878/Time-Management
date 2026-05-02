import { Router } from "express";
import { getMembers } from "../controllers/userController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorizeRoles("Admin"));
router.get("/members", getMembers);

export default router;
