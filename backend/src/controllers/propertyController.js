import { Property } from "../models/Property.js";
import { User } from "../models/User.js";
import { cacheService } from "../services/cacheService.js";

const PUBLIC_CACHE_TTL = 120;
const buildCacheKey = (scope, input) => `${scope}:${JSON.stringify(input)}`;
const clearPropertyCache = async () => {
  await Promise.all([
    cacheService.delByPrefix("properties:list"),
    cacheService.delByPrefix("properties:featured"),
    cacheService.delByPrefix("properties:detail"),
    cacheService.delByPrefix("properties:filters"),
    cacheService.delByPrefix("properties:similar"),
    cacheService.delByPrefix("properties:stats"),
  ]);
};

const buildFilters = (query) => {
  const filters = {
    status: "active",
    approvalStatus: "approved",
  };

  if (query.city) filters.city = new RegExp(query.city, "i");
  if (query.location) {
    filters.$or = [
      { city: new RegExp(query.location, "i") },
      { state: new RegExp(query.location, "i") },
      { country: new RegExp(query.location, "i") },
      { address: new RegExp(query.location, "i") },
      { title: new RegExp(query.location, "i") },
    ];
  }
  if (query.category) filters.category = query.category;
  if (query.listingType) filters.listingType = query.listingType;
  if (query.bedrooms) filters["specs.beds"] = { $gte: Number(query.bedrooms) };
  if (query.featured === "true") filters.featured = true;
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }

  return filters;
};

const ensurePropertyWriteAccess = (user, property) => {
  if (user.role === "admin") {
    return;
  }

  if (String(property.owner) !== String(user._id)) {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }
};

const ensureAgentPlanAccess = async (user, nextPayload, currentProperty = null) => {
  if (user.role !== "agent") {
    return;
  }

  const hasActiveSubscription =
    user.subscription?.status === "active" &&
    user.subscription?.endsAt &&
    new Date(user.subscription.endsAt) > new Date();

  if (!hasActiveSubscription) {
    const error = new Error("An active subscription plan is required for agent listings");
    error.statusCode = 403;
    throw error;
  }

  const listingLimit = Number(user.subscription?.listingLimit || 0);
  if (!currentProperty) {
    const ownedProperties = await Property.countDocuments({ owner: user._id });
    if (listingLimit > 0 && ownedProperties >= listingLimit) {
      const error = new Error("Your current plan listing limit has been reached");
      error.statusCode = 403;
      throw error;
    }
  }

  if (nextPayload.featured && !user.subscription?.featuredListingsAllowed) {
    const error = new Error("Your current plan does not include featured listings");
    error.statusCode = 403;
    throw error;
  }
};

const parsePropertyPayload = (body, currentProperty, user) => {
  const nextSpecs = {
    beds: Number(body?.specs?.beds ?? body.beds ?? currentProperty?.specs?.beds ?? 0),
    baths: Number(body?.specs?.baths ?? body.baths ?? currentProperty?.specs?.baths ?? 0),
    area: Number(body?.specs?.area ?? body.area ?? currentProperty?.specs?.area ?? 0),
    parking: Number(body?.specs?.parking ?? body.parking ?? body?.specs?.garage ?? body.garage ?? currentProperty?.specs?.parking ?? currentProperty?.specs?.garage ?? 0),
    garage: Number(body?.specs?.parking ?? body.parking ?? body?.specs?.garage ?? body.garage ?? currentProperty?.specs?.parking ?? currentProperty?.specs?.garage ?? 0),
    yearBuilt: Number(body?.specs?.yearBuilt ?? body.yearBuilt ?? currentProperty?.specs?.yearBuilt ?? 2024),
  };

  const amenities = Array.isArray(body.amenities)
    ? body.amenities.filter(Boolean)
    : typeof body.amenities === "string"
      ? body.amenities.split(",").map((item) => item.trim()).filter(Boolean)
      : currentProperty?.amenities ?? [];

  const images = Array.isArray(body.images) ? body.images.filter((item) => item?.url) : currentProperty?.images ?? [];

  const payload = {
    title: body.title ?? currentProperty?.title,
    description: body.description ?? currentProperty?.description,
    category: body.category ?? currentProperty?.category,
    listingType: body.listingType ?? currentProperty?.listingType,
    price: body.price !== undefined ? Number(body.price) : currentProperty?.price,
    address: body.address ?? currentProperty?.address,
    city: body.city ?? currentProperty?.city,
    state: body.state ?? currentProperty?.state,
    country: body.country ?? currentProperty?.country,
    zipCode: body.zipCode ?? currentProperty?.zipCode ?? "",
    featured:
      body.featured !== undefined
        ? body.featured === true || body.featured === "true"
        : currentProperty?.featured ?? false,
    status: body.status ?? currentProperty?.status ?? "active",
    images,
    amenities,
    specs: nextSpecs,
    location: {
      lat: Number(body?.location?.lat ?? body.lat ?? currentProperty?.location?.lat ?? 0),
      lng: Number(body?.location?.lng ?? body.lng ?? currentProperty?.location?.lng ?? 0),
    },
  };

  if (user.role === "admin") {
    payload.owner = body.owner || currentProperty?.owner;
    payload.approvalStatus = body.approvalStatus ?? currentProperty?.approvalStatus ?? "approved";
    payload.approvedAt = payload.approvalStatus === "approved" ? currentProperty?.approvedAt ?? new Date() : null;
    payload.approvedBy = payload.approvalStatus === "approved" ? currentProperty?.approvedBy ?? user._id : null;
    return payload;
  }

  payload.approvalStatus = currentProperty ? "pending" : "pending";
  payload.approvedAt = null;
  payload.approvedBy = null;
  return payload;
};

export const getProperties = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 9);
  const skip = (page - 1) * limit;
  const filters = buildFilters(req.query);
  const cacheKey = buildCacheKey("properties:list", { ...req.query, page, limit });

  const { items, total } = await cacheService.remember(cacheKey, PUBLIC_CACHE_TTL, async () => {
    const [nextItems, nextTotal] = await Promise.all([
      Property.find(filters)
        .populate("owner", "name email phone avatar")
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(filters),
    ]);

    return {
      items: nextItems,
      total: nextTotal,
    };
  });

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
  const items = await cacheService.remember("properties:featured", PUBLIC_CACHE_TTL, async () => {
    return Property.find({
      featured: true,
      status: "active",
      approvalStatus: "approved",
    })
      .populate("owner", "name email phone avatar")
      .limit(6)
      .sort({ createdAt: -1 })
      .lean();
  });

  res.status(200).json({ success: true, items });
};

export const getPropertyBySlug = async (req, res) => {
  const item = await cacheService.remember(
    buildCacheKey("properties:detail", { slug: req.params.slug }),
    PUBLIC_CACHE_TTL,
    async () => {
      return Property.findOne({
        slug: req.params.slug,
        approvalStatus: "approved",
      })
        .populate("owner", "name email phone avatar")
        .lean();
    },
  );

  if (!item) {
    res.status(404);
    throw new Error("Property not found");
  }

  res.status(200).json({ success: true, item });
};

export const createProperty = async (req, res) => {
  const payload = parsePropertyPayload(req.body, null, req.user);
  await ensureAgentPlanAccess(req.user, payload);
  let ownerId = req.user._id;

  if (req.user.role === "admin" && payload.owner) {
    const owner = await User.findOne({ _id: payload.owner, role: "agent", isActive: true });
    if (!owner) {
      res.status(400);
      throw new Error("Assigned agent not found or inactive");
    }
    ownerId = owner._id;
  }

  const item = await Property.create({
    ...payload,
    owner: ownerId,
  });
  await clearPropertyCache();

  res.status(201).json({ success: true, item });
};

export const updateProperty = async (req, res) => {
  const item = await Property.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Property not found");
  }

  ensurePropertyWriteAccess(req.user, item);
  const payload = parsePropertyPayload(req.body, item, req.user);
  await ensureAgentPlanAccess(req.user, payload, item);

  if (req.user.role === "admin" && payload.owner) {
    const owner = await User.findOne({ _id: payload.owner, role: "agent", isActive: true });
    if (!owner) {
      res.status(400);
      throw new Error("Assigned agent not found or inactive");
    }
  }

  Object.assign(item, payload);

  const saved = await item.save();
  await clearPropertyCache();
  res.status(200).json({ success: true, item: saved });
};

export const deleteProperty = async (req, res) => {
  const item = await Property.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Property not found");
  }

  ensurePropertyWriteAccess(req.user, item);
  await item.deleteOne();
  await clearPropertyCache();
  res.status(200).json({ success: true, message: "Property deleted" });
};

export const updatePropertyApproval = async (req, res) => {
  const { approvalStatus } = req.body;
  if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
    res.status(400);
    throw new Error("Invalid approval status");
  }

  const item = await Property.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Property not found");
  }

  item.approvalStatus = approvalStatus;
  item.approvedAt = approvalStatus === "approved" ? new Date() : null;
  item.approvedBy = approvalStatus === "approved" ? req.user._id : null;
  await item.save();
  await clearPropertyCache();

  res.status(200).json({ success: true, item });
};

export const getPropertyFilters = async (_req, res) => {
  const { cities, categories, types } = await cacheService.remember("properties:filters", PUBLIC_CACHE_TTL, async () => {
    const [nextCities, nextCategories, nextTypes] = await Promise.all([
      Property.distinct("city", { approvalStatus: "approved", status: "active" }),
      Property.distinct("category", { approvalStatus: "approved", status: "active" }),
      Property.distinct("listingType", { approvalStatus: "approved", status: "active" }),
    ]);

    return {
      cities: nextCities,
      categories: nextCategories,
      types: nextTypes,
    };
  });

  res.status(200).json({
    success: true,
    cities,
    categories,
    types,
  });
};

export const getSimilarProperties = async (req, res) => {
  const property = await Property.findOne({ slug: req.params.slug, approvalStatus: "approved" });
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const items = await cacheService.remember(
    buildCacheKey("properties:similar", {
      slug: req.params.slug,
      city: property.city,
      listingType: property.listingType,
    }),
    PUBLIC_CACHE_TTL,
    async () => {
      return Property.find({
        _id: { $ne: property._id },
        city: property.city,
        listingType: property.listingType,
        status: "active",
        approvalStatus: "approved",
      })
        .limit(3)
        .lean();
    },
  );

  res.status(200).json({ success: true, items });
};

export const getAdminProperties = async (req, res) => {
  const filters = req.user.role === "admin" ? {} : { owner: req.user._id };
  const items = await Property.find(filters)
    .populate("owner", "name email")
    .populate("approvedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, items });
};

export const getPropertyStats = async (_req, res) => {
  const { stats, topCities } = await cacheService.remember("properties:stats", PUBLIC_CACHE_TTL, async () => {
    const nextStats = await Property.aggregate([
      {
        $match: {
          approvalStatus: "approved",
        },
      },
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
        $match: {
          approvalStatus: "approved",
        },
      },
      {
        $group: {
          _id: "$city",
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    return {
      stats: nextStats,
      topCities: cities,
    };
  });

  res.status(200).json({
    success: true,
    stats,
    topCities,
  });
};
