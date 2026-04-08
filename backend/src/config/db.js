import "dotenv/config";
import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/real-estate";
  const mongoUriFallback = process.env.MONGODB_URI_FALLBACK || "";

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    const canRetryWithFallback =
      mongoUri.startsWith("mongodb+srv://") &&
      mongoUriFallback &&
      ["querySrv ECONNREFUSED", "ENOTFOUND", "ETIMEOUT"].some((message) =>
        String(error.message || "").includes(message)
      );

    if (!canRetryWithFallback) {
      throw error;
    }

    console.warn(
      "MongoDB SRV lookup failed. Retrying with MONGODB_URI_FALLBACK."
    );

    await mongoose.connect(mongoUriFallback);
    console.log("MongoDB connected");
  }
};
