import mongoose from "mongoose";
import { generateSlug } from "../utils/generateSlug.js";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["apartment", "villa", "commercial", "penthouse", "land"],
      required: true,
    },
    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "sold", "rented"],
      default: "active",
    },
    price: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      default: "",
    },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    specs: {
      beds: { type: Number, default: 0 },
      baths: { type: Number, default: 0 },
      area: { type: Number, default: 0 },
      garage: { type: Number, default: 0 },
      yearBuilt: { type: Number, default: 2024 },
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

propertySchema.pre("validate", function createSlug(next) {
  if (!this.slug && this.title) {
    this.slug = `${generateSlug(this.title)}-${Math.random().toString(36).slice(2, 7)}`;
  }
  next();
});

export const Property = mongoose.model("Property", propertySchema);
