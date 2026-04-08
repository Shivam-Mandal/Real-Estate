import mongoose from "mongoose";

const paymentLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },
    paymentMethod: {
      type: String,
      enum: ["manual", "stripe"],
      default: "manual",
    },
    transactionId: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const PaymentLog = mongoose.model("PaymentLog", paymentLogSchema);
