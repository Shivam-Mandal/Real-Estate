import { Inquiry } from "../models/Inquiry.js";
import { Property } from "../models/Property.js";
import { User } from "../models/User.js";

export const getDashboardOverview = async (_req, res) => {
  const [totalUsers, totalProperties, totalInquiries, featuredProperties] = await Promise.all([
    User.countDocuments(),
    Property.countDocuments(),
    Inquiry.countDocuments(),
    Property.countDocuments({ featured: true }),
  ]);

  const monthlyRevenue = await Property.aggregate([
    {
      $match: {
        status: { $in: ["active", "sold", "rented"] },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$price" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const pipeline = await Inquiry.aggregate([
    {
      $group: {
        _id: "$status",
        total: { $sum: 1 },
      },
    },
  ]);

  const latestUsers = await User.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    metrics: {
      totalUsers,
      totalProperties,
      totalInquiries,
      featuredProperties,
    },
    monthlyRevenue,
    pipeline,
    latestUsers,
  });
};

export const getUsers = async (_req, res) => {
  const items = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, items });
};
