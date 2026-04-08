import mongoose from "mongoose";

const propertySpecificationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      default: "",
      trim: true,
    },
    inputType: {
      type: String,
      enum: ["number"],
      default: "number",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const PropertySpecification = mongoose.model("PropertySpecification", propertySpecificationSchema);
