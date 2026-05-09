import "dotenv/config";
import mongoose from "mongoose";

const connOpts = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4, // Force IPv4
  tls: true,
};

export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  const primaryUri = process.env.MONGODB_URI || "";
  const fallbackUri = process.env.MONGODB_URI_FALLBACK || "";

  // 1) Try the primary URI (SRV)
  if (primaryUri) {
    try {
      await mongoose.connect(primaryUri, connOpts);
      console.log("MongoDB connected (primary)");
      return;
    } catch (err) {
      console.warn("Primary MongoDB connection failed:", err.message);
    }
  }

  // 2) Fall back to direct connection string
  if (fallbackUri) {
    try {
      await mongoose.connect(fallbackUri, connOpts);
      console.log("MongoDB connected (fallback)");
      return;
    } catch (err) {
      console.error("Fallback MongoDB connection also failed:", err.message);
      throw err;
    }
  }

  // 3) Last resort — local MongoDB
  await mongoose.connect("mongodb://127.0.0.1:27017/real-estate");
  console.log("MongoDB connected (local)");
};

