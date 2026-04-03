import dns from "node:dns";
import mongoose from "mongoose";

/**
 * Connect to MongoDB. Call once at startup.
 *
 * If you see `querySrv ECONNREFUSED`, DNS SRV lookups for `mongodb+srv://` are failing.
 * Set DNS_SERVERS=8.8.8.8,1.1.1.1 in .env, or use Atlas "Standard connection string" (mongodb://...).
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  const dnsList = process.env.DNS_SERVERS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (dnsList.length > 0) {
    dns.setServers(dnsList);
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20_000,
    });
  } catch (err) {
    if (err?.syscall === "querySrv" || String(err?.message || "").includes("querySrv")) {
      throw new Error(
        "MongoDB Atlas DNS (SRV) lookup failed. Fixes: (1) Add DNS_SERVERS=8.8.8.8,1.1.1.1 to backend .env and restart. " +
          "(2) Disable VPN / check firewall. " +
          "(3) In MongoDB Atlas → Connect → Drivers → copy the Standard connection string (mongodb://... with ssl=true), not mongodb+srv://."
      );
    }
    throw err;
  }

  console.log("MongoDB connected");
}
