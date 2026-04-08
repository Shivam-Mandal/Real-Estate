import { Inquiry } from "../models/Inquiry.js";
import { Property } from "../models/Property.js";

const ensureInquiryAccess = async (user, inquiryId) => {
  const inquiry = await Inquiry.findById(inquiryId).populate("property");
  if (!inquiry) {
    const error = new Error("Inquiry not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "admin") {
    return inquiry;
  }

  if (user.role === "agent" && String(inquiry.property?.owner) === String(user._id)) {
    return inquiry;
  }

  const error = new Error("Forbidden");
  error.statusCode = 403;
  throw error;
};

export const createInquiry = async (req, res) => {
  const { property: propertyId, name, email, phone, message } = req.body;
  const property = await Property.findById(propertyId);
  if (!property || property.approvalStatus !== "approved") {
    res.status(404);
    throw new Error("Property not found");
  }

  const prospectName = name || req.user?.name;
  const prospectEmail = email || req.user?.email;
  const prospectPhone = phone || req.user?.phone || "";

  if (!prospectName || !prospectEmail || !message) {
    res.status(400);
    throw new Error("Name, email, and message are required");
  }

  const inquiry = await Inquiry.create({
    property: propertyId,
    name: prospectName,
    email: prospectEmail,
    phone: prospectPhone,
    message,
    user: req.user?._id || null,
  });

  res.status(201).json({
    success: true,
    inquiry,
    message: "Inquiry submitted successfully",
  });
};

export const getAdminInquiries = async (req, res) => {
  const filters = {};

  if (req.user.role === "agent") {
    const ownedProperties = await Property.find({ owner: req.user._id }).select("_id");
    filters.property = { $in: ownedProperties.map((item) => item._id) };
  }

  const items = await Inquiry.find(filters)
    .populate({
      path: "property",
      select: "title city listingType price owner",
      populate: {
        path: "owner",
        select: "name email",
      },
    })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, items });
};

export const updateInquiryStatus = async (req, res) => {
  const inquiry = await ensureInquiryAccess(req.user, req.params.id);

  inquiry.status = req.body.status || inquiry.status;
  await inquiry.save();

  res.status(200).json({ success: true, inquiry });
};
