import { Inquiry } from "../models/Inquiry.js";
import { Property } from "../models/Property.js";

export const createInquiry = async (req, res) => {
  const property = await Property.findById(req.body.property);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const inquiry = await Inquiry.create({
    ...req.body,
    user: req.user?._id || null,
  });

  res.status(201).json({
    success: true,
    inquiry,
    message: "Inquiry submitted successfully",
  });
};

export const getAdminInquiries = async (_req, res) => {
  const items = await Inquiry.find({})
    .populate("property", "title city listingType price")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, items });
};

export const updateInquiryStatus = async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }

  inquiry.status = req.body.status || inquiry.status;
  await inquiry.save();

  res.status(200).json({ success: true, inquiry });
};
