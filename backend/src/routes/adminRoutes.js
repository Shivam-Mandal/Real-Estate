import { Router } from "express";
import {
  createPaymentLog,
  createPlan,
  createUser,
  getAgents,
  getDashboardOverview,
  getPaymentLogs,
  getPlans,
  getPropertySpecifications,
  getUsers,
  updatePlan,
  updatePropertySpecification,
  updateUser,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/dashboard", getDashboardOverview);
router.get("/users", getUsers);
router.get("/agents", getAgents);
router.get("/plans", getPlans);
router.get("/payment-logs", getPaymentLogs);
router.get("/property-specifications", getPropertySpecifications);
router.post("/users", createUser);
router.post("/plans", createPlan);
router.post("/payment-logs", createPaymentLog);
router.patch("/plans/:id", updatePlan);
router.patch("/property-specifications/:id", updatePropertySpecification);
router.patch("/users/:id", updateUser);

export default router;
