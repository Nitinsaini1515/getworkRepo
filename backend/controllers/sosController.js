import { SOSAlert } from "../models/SOSAlert.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSOS = asyncHandler(async (req, res) => {
  if (req.user.role !== "Worker") {
    throw new ApiError(403, "SOS is only available for workers");
  }

  const { message } = req.body;
  const timestamp = req.body.timestamp ? new Date(req.body.timestamp) : new Date();

  const doc = await SOSAlert.create({
    workerId: req.userId,
    message: message?.trim() ?? "",
    timestamp,
  });

  res.status(201).json({
    success: true,
    message: "SOS recorded",
    data: {
      sos: {
        id: String(doc._id),
        workerId: String(doc.workerId),
        message: doc.message,
        timestamp: doc.timestamp,
        createdAt: doc.createdAt,
      },
    },
  });
});
