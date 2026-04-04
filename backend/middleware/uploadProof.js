import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const proofsDir = path.join(__dirname, "..", "uploads", "proofs");

fs.mkdirSync(proofsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, proofsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "") || "proof";
    cb(null, `${Date.now()}-${safe}`);
  },
});

const multerOpts = {
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
};

export const uploadProofMiddleware = multer(multerOpts);

/** Multiple completion photos (field name: photos) */
export const uploadCompletionMiddleware = multer(multerOpts);
