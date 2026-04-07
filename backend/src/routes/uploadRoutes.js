import { Router } from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/", protect, authorize("admin", "agent"), upload.array("images", 10), uploadImages);

export default router;
