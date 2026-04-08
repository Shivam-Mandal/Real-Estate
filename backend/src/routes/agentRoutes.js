import { Router } from "express";
import { getAgents } from "../controllers/agentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/", getAgents);

export default router;
