import { Router } from "express";
import {
  createPaymentLog,
  createPlan,
  getPaymentLogs,
  getPlans,
  updatePlan,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/plans", getPlans);
router.post("/plans", createPlan);
router.patch("/plans/:id", updatePlan);
router.get("/logs", getPaymentLogs);
router.post("/logs", createPaymentLog);

export default router;
