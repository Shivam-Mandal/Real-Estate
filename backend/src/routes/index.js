import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import agentRoutes from "./agentRoutes.js";
import authRoutes from "./authRoutes.js";
import messageRoutes from "./messageRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import propertyRoutes from "./propertyRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/agents", agentRoutes);
router.use("/payments", paymentRoutes);
router.use("/messages", messageRoutes);

// Keep dashboard-focused admin routes during the architecture transition.
router.use("/admin", adminRoutes);
router.use("/uploads", uploadRoutes);

export default router;
