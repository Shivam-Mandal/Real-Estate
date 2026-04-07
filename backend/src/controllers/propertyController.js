import mongoose from "mongoose";
import { Property } from "../models/Property.js";

const buildFilters = (query) => {
  const filters = { status: "active" };

  if (query.city) filters.city = new RegExp(query.city, "i");
  if (query.category) filters.category = query.category;
  if (query.listingType) filters.listingType = query.listingType;
  if (query.featured === "true") filters.featured = true;
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }

  return filters;
};

export const getProperties = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 9);
  const skip = (page - 1) * limit;
  const filters = buildFilters(req.query);

  const [items, total] = await Promise.all([
    Property.find(filters)
      .populate("owner", "name email phone avatar")
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Property.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    items,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};

export const getFeaturedProperties = async (_req, res) => {
  const items = await Property.find({ featured: true, status: "active" })
    .populate("owner", "name email phone avatar")
    .limit(6)
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, items });
};

export const getPropertyBySlug = async (req, res) => {
  const item = await Property.findOne({ slug: req.params.slug }).populate(
    "owner",
    "name email phone avatar",
  );

  if (!item) {
    res.status(404);
    throw new Error("Property not found");
  }

  res.status(200).json({ success: true, item });
};

export const createProperty = async (req, res) => {
  const payload = {
    ...req.body,
    owner: req.user._id,
    price: Number(req.body.price),
    featured: req.body.featured === true || req.body.featured === "true",
    specs: {
      beds: Number(req.body?.specs?.beds || req.body.beds || 0),
      baths: Number(req.body?.specs?.baths || req.body.baths || 0),
      area: Number(req.body?.specs?.area || req.body.area || 0),
      garage: Number(req.body?.specs?.garage || req.body.garage || 0),
      yearBuilt: Number(req.body?.specs?.yearBuilt || req.body.yearBuilt || 2024),
    },
  };

  const item = await Property.create(payload);
  res.status(201).json({ success: true, item });
};

export const updateProperty = async (req, res) => {
  const item = await Property.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Property not found");
  }

  Object.assign(item, {
    ...req.body,
    price: req.body.price ? Number(req.body.price) : item.price,
  });

  if (req.body.beds || req.body.baths || req.body.area || req.body.garage || req.body.yearBuilt) {
    item.specs = {
      beds: Number(req.body.beds || item.specs.beds),
      baths: Number(req.body.baths || item.specs.baths),
      area: Number(req.body.area || item.specs.area),
      garage: Number(req.body.garage || item.specs.garage),
      yearBuilt: Number(req.body.yearBuilt || item.specs.yearBuilt),
    };
  }

  const saved = await item.save();
  res.status(200).json({ success: true, item: saved });
};

export const deleteProperty = async (req, res) => {
  const item = await Property.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Property not found");
  }

  await item.deleteOne();
  res.status(200).json({ success: true, message: "Property deleted" });
};

export const getPropertyFilters = async (_req, res) => {
  const [cities, categories, types] = await Promise.all([
    Property.distinct("city"),
    Property.distinct("category"),
    Property.distinct("listingType"),
  ]);

  res.status(200).json({
    success: true,
    cities,
    categories,
    types,
  });
};

export const getSimilarProperties = async (req, res) => {
  const property = await Property.findOne({ slug: req.params.slug });
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const items = await Property.find({
    _id: { $ne: property._id },
    city: property.city,
    listingType: property.listingType,
    status: "active",
  }).limit(3);

  res.status(200).json({ success: true, items });
};

export const getAdminProperties = async (_req, res) => {
  const items = await Property.find({})
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, items });
};

export const getPropertyStats = async (_req, res) => {
  const stats = await Property.aggregate([
    {
      $group: {
        _id: "$listingType",
        total: { $sum: 1 },
        averagePrice: { $avg: "$price" },
      },
    },
  ]);

  const cities = await Property.aggregate([
    {
      $group: {
        _id: "$city",
        total: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({
    success: true,
    stats,
    topCities: cities,
  });
};
