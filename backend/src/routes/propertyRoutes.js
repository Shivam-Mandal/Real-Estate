import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getAdminProperties,
  getFeaturedProperties,
  getProperties,
  getPropertyBySlug,
  getPropertyFilters,
  getPropertyStats,
  getSimilarProperties,
  updateProperty,
  updatePropertyApproval,
} from "../controllers/propertyController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getProperties);
router.get("/featured", getFeaturedProperties);
router.get("/filters", getPropertyFilters);
router.get("/stats", getPropertyStats);
router.get("/admin/all", protect, authorize("admin", "agent"), getAdminProperties);
router.patch("/:id/approval", protect, authorize("admin"), updatePropertyApproval);
router.get("/:slug", getPropertyBySlug);
router.get("/:slug/similar", getSimilarProperties);
router.post("/", protect, authorize("admin", "agent"), createProperty);
router.put("/:id", protect, authorize("admin", "agent"), updateProperty);
router.delete("/:id", protect, authorize("admin"), deleteProperty);

export default router;
