import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
