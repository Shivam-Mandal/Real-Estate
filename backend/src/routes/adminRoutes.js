import { Router } from "express";
import { getDashboardOverview, getUsers } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/dashboard", getDashboardOverview);
router.get("/users", getUsers);

export default router;
