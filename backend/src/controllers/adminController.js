import { Inquiry } from "../models/Inquiry.js";
import { PaymentLog } from "../models/PaymentLog.js";
import { Plan } from "../models/Plan.js";
import { Property } from "../models/Property.js";
import { PropertySpecification } from "../models/PropertySpecification.js";
import { User } from "../models/User.js";

const defaultPropertySpecifications = [
  { key: "beds", label: "Bedrooms", unit: "", inputType: "number", isActive: true, sortOrder: 1 },
  { key: "baths", label: "Bathrooms", unit: "", inputType: "number", isActive: true, sortOrder: 2 },
  { key: "area", label: "Area", unit: "sqft", inputType: "number", isActive: true, sortOrder: 3 },
  { key: "parking", label: "Parking", unit: "spaces", inputType: "number", isActive: true, sortOrder: 4 },
];

const buildMonthSeries = (items, valueKey) => {
  const months = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    total: 0,
  }));

  items.forEach((item) => {
    const monthIndex = Number(item._id) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      months[monthIndex].total = Math.round(item[valueKey] || item.total || 0);
    }
  });

  return months;
};

const applyUserSubscription = (user, plan) => {
  const startsAt = new Date();
  const endsAt = new Date(startsAt);
  endsAt.setMonth(endsAt.getMonth() + 1);

  user.subscription = {
    plan: plan._id,
    planName: plan.name,
    listingLimit: plan.listingLimit,
    featuredListingsAllowed: plan.featuredListingsAllowed,
    status: "active",
    startsAt,
    endsAt,
  };
};

const ensurePropertySpecifications = async () => {
  const count = await PropertySpecification.countDocuments();
  if (count > 0) {
    return;
  }

  await PropertySpecification.insertMany(defaultPropertySpecifications);
};

export const getDashboardOverview = async (_req, res) => {
  const [
    totalUsers,
    totalVendors,
    activeSubscribers,
    totalProperties,
    featuredProperties,
    latestUsers,
    latestProperties,
    latestInquiries,
    latestPayments,
    registeredUsersByMonth,
    packagePurchasesByMonth,
    paymentLogsCount,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "vendor" }),
    User.countDocuments({ "subscription.status": "active" }),
    Property.countDocuments(),
    Property.countDocuments({ featured: true }),
    User.find({}).select("-password").sort({ createdAt: -1 }).limit(5),
    Property.find({}).populate("owner", "name").sort({ createdAt: -1 }).limit(5),
    Inquiry.find({}).populate("property", "title").sort({ createdAt: -1 }).limit(5),
    PaymentLog.find({}).populate("user", "name email").populate("plan", "name").sort({ createdAt: -1 }).limit(5),
    User.aggregate([
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    PaymentLog.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: { $month: "$purchasedAt" }, total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    PaymentLog.countDocuments(),
  ]);

  const recentActivities = [
    ...latestUsers.map((user) => ({
      id: `user-${user._id}`,
      type: "user",
      title: `${user.name} registered`,
      subtitle: user.email,
      createdAt: user.createdAt,
    })),
    ...latestProperties.map((property) => ({
      id: `property-${property._id}`,
      type: "property",
      title: `${property.title} listing updated`,
      subtitle: property.owner?.name || property.city,
      createdAt: property.updatedAt || property.createdAt,
    })),
    ...latestInquiries.map((inquiry) => ({
      id: `inquiry-${inquiry._id}`,
      type: "message",
      title: `New property message from ${inquiry.name}`,
      subtitle: inquiry.property?.title || inquiry.email,
      createdAt: inquiry.createdAt,
    })),
    ...latestPayments.map((payment) => ({
      id: `payment-${payment._id}`,
      type: "payment",
      title: `${payment.user?.name || "User"} purchased ${payment.plan?.name || "a plan"}`,
      subtitle: `${payment.currency} ${payment.amount}`,
      createdAt: payment.purchasedAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  res.status(200).json({
    success: true,
    metrics: {
      paymentLogsCount,
      propertiesCount: totalProperties,
      featuredPropertiesCount: featuredProperties,
      vendorsCount: totalVendors,
      usersCount: totalUsers,
      subscribersCount: activeSubscribers,
    },
    monthlyPackagePurchase: buildMonthSeries(packagePurchasesByMonth, "total"),
    registeredUsersByMonth: buildMonthSeries(registeredUsersByMonth, "total"),
    recentActivities,
  });
};

export const getUsers = async (_req, res) => {
  const items = await User.find({})
    .select("-password")
    .populate("subscription.plan", "name")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, items });
};

export const getAgents = async (_req, res) => {
  const items = await User.aggregate([
    { $match: { role: "agent" } },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "owner",
        as: "properties",
      },
    },
    {
      $addFields: {
        propertyCount: { $size: "$properties" },
        featuredCount: {
          $size: {
            $filter: { input: "$properties", as: "property", cond: { $eq: ["$$property.featured", true] } },
          },
        },
        pendingApprovalCount: {
          $size: {
            $filter: { input: "$properties", as: "property", cond: { $eq: ["$$property.approvalStatus", "pending"] } },
          },
        },
      },
    },
    {
      $project: {
        password: 0,
        passwordResetToken: 0,
        passwordResetExpiresAt: 0,
        properties: 0,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const availableAgents = await User.find({ role: "agent", isActive: true }).select("name email").sort({ name: 1 });

  res.status(200).json({
    success: true,
    items,
    availableAgents,
  });
};

export const createUser = async (req, res) => {
  const { name, email, password, phone, role, isActive } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!["admin", "agent", "user", "vendor"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    phone: phone || "",
    role,
    isActive: isActive !== false,
  });

  res.status(201).json({
    success: true,
    item: await User.findById(user._id).select("-password").populate("subscription.plan", "name"),
  });
};

export const updateUser = async (req, res) => {
  const { name, phone, role, isActive } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (role && !["admin", "agent", "user", "vendor"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }

  if (req.user._id.equals(user._id) && isActive === false) {
    res.status(400);
    throw new Error("You cannot deactivate your own admin account");
  }

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.role = role ?? user.role;
  if (typeof isActive === "boolean") {
    user.isActive = isActive;
  }

  await user.save();

  res.status(200).json({
    success: true,
    item: await User.findById(user._id).select("-password").populate("subscription.plan", "name"),
  });
};

export const getPlans = async (_req, res) => {
  const items = await Plan.find({}).sort({ createdAt: -1 });
  res.status(200).json({ success: true, items });
};

export const getPropertySpecifications = async (_req, res) => {
  await ensurePropertySpecifications();
  const items = await PropertySpecification.find({}).sort({ sortOrder: 1, createdAt: 1 });
  res.status(200).json({ success: true, items });
};

export const updatePropertySpecification = async (req, res) => {
  await ensurePropertySpecifications();
  const item = await PropertySpecification.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Property specification not found");
  }

  item.label = req.body.label ?? item.label;
  item.unit = req.body.unit ?? item.unit;
  if (req.body.isActive !== undefined) {
    item.isActive = req.body.isActive === true || req.body.isActive === "true";
  }
  if (req.body.sortOrder !== undefined) {
    item.sortOrder = Number(req.body.sortOrder);
  }

  await item.save();
  res.status(200).json({ success: true, item });
};

export const createPlan = async (req, res) => {
  const { name, slug, description, price, currency, listingLimit, featuredListingsAllowed, isCustom, isActive } = req.body;
  if (!name || !slug) {
    res.status(400);
    throw new Error("Name and slug are required");
  }

  const item = await Plan.create({
    name,
    slug,
    description: description || "",
    price: Number(price || 0),
    currency: currency || "INR",
    listingLimit: Number(listingLimit || 0),
    featuredListingsAllowed: featuredListingsAllowed === true || featuredListingsAllowed === "true",
    isCustom: isCustom === true || isCustom === "true",
    isActive: isActive !== false,
  });

  res.status(201).json({ success: true, item });
};

export const updatePlan = async (req, res) => {
  const item = await Plan.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Plan not found");
  }

  item.name = req.body.name ?? item.name;
  item.slug = req.body.slug ?? item.slug;
  item.description = req.body.description ?? item.description;
  item.price = req.body.price !== undefined ? Number(req.body.price) : item.price;
  item.currency = req.body.currency ?? item.currency;
  item.listingLimit = req.body.listingLimit !== undefined ? Number(req.body.listingLimit) : item.listingLimit;
  if (req.body.featuredListingsAllowed !== undefined) {
    item.featuredListingsAllowed = req.body.featuredListingsAllowed === true || req.body.featuredListingsAllowed === "true";
  }
  if (req.body.isCustom !== undefined) {
    item.isCustom = req.body.isCustom === true || req.body.isCustom === "true";
  }
  if (req.body.isActive !== undefined) {
    item.isActive = req.body.isActive === true || req.body.isActive === "true";
  }

  await item.save();
  res.status(200).json({ success: true, item });
};

export const getPaymentLogs = async (_req, res) => {
  const items = await PaymentLog.find({})
    .populate("user", "name email role")
    .populate("plan", "name slug price listingLimit featuredListingsAllowed")
    .sort({ purchasedAt: -1 });

  res.status(200).json({ success: true, items });
};

export const createPaymentLog = async (req, res) => {
  const { userId, planId, amount, currency, status, paymentMethod, transactionId, notes } = req.body;

  const [user, plan] = await Promise.all([
    User.findById(userId),
    Plan.findById(planId),
  ]);

  if (!user || !plan) {
    res.status(404);
    throw new Error("User or plan not found");
  }

  const item = await PaymentLog.create({
    user: user._id,
    plan: plan._id,
    amount: Number(amount ?? plan.price),
    currency: currency || plan.currency || "INR",
    status: status || "paid",
    paymentMethod: paymentMethod || "manual",
    transactionId: transactionId || "",
    notes: notes || "",
  });

  if (item.status === "paid") {
    applyUserSubscription(user, plan);
    await user.save();
  }

  res.status(201).json({
    success: true,
    item: await PaymentLog.findById(item._id).populate("user", "name email role").populate("plan", "name slug price"),
  });
};
