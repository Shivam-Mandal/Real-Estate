import { Router } from "express";
import {
  createInquiry,
  getMessages,
  updateMessageStatus,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/", createInquiry);
router.get("/", protect, authorize("admin", "agent"), getMessages);
router.patch("/:id/status", protect, authorize("admin", "agent"), updateMessageStatus);

export default router;
