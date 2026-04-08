import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    listingLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    featuredListingsAllowed: {
      type: Boolean,
      default: false,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Plan = mongoose.model("Plan", planSchema);
