import { Router } from "express";
import {
  createInquiry,
  getAdminInquiries,
  updateInquiryStatus,
} from "../controllers/inquiryController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", createInquiry);
router.get("/admin/all", protect, authorize("admin", "agent"), getAdminInquiries);
router.patch("/:id/status", protect, authorize("admin", "agent"), updateInquiryStatus);

export default router;
