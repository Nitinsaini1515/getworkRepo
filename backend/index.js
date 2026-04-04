import "dotenv/config";
import app from "./app.js";
import { connection } from "./src/db/server.js";

connection()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });