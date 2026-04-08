import { Router } from "express";
import {
  addToWishlist,
  createUser,
  getMyWishlist,
  getUsers,
  removeFromWishlist,
  updateUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/me/wishlist", protect, getMyWishlist);
router.post("/me/wishlist/:propertyId", protect, addToWishlist);
router.delete("/me/wishlist/:propertyId", protect, removeFromWishlist);

router.use(protect, authorize("admin"));
router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id", updateUser);

export default router;
