import mongoose from "mongoose";
import { Property } from "../models/Property.js";
import { User } from "../models/User.js";
import { createUser, getUsers, updateUser } from "./adminController.js";

const wishlistPopulate = {
  path: "wishlist",
  match: { approvalStatus: "approved" },
  populate: {
    path: "owner",
    select: "name email phone avatar",
  },
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export { createUser, getUsers, updateUser };

export const getMyWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate(wishlistPopulate).lean();

  res.status(200).json({
    success: true,
    items: user?.wishlist?.filter(Boolean) || [],
  });
};

export const addToWishlist = async (req, res) => {
  const { propertyId } = req.params;

  if (!isValidObjectId(propertyId)) {
    res.status(400);
    throw new Error("Invalid property id");
  }

  const property = await Property.findOne({
    _id: propertyId,
    approvalStatus: "approved",
    status: "active",
  });

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: property._id } },
    { new: true },
  ).populate(wishlistPopulate);

  res.status(200).json({
    success: true,
    items: user?.wishlist?.filter(Boolean) || [],
  });
};

export const removeFromWishlist = async (req, res) => {
  const { propertyId } = req.params;

  if (!isValidObjectId(propertyId)) {
    res.status(400);
    throw new Error("Invalid property id");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: propertyId } },
    { new: true },
  ).populate(wishlistPopulate);

  res.status(200).json({
    success: true,
    items: user?.wishlist?.filter(Boolean) || [],
  });
};
