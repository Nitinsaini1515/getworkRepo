import mongoose from "mongoose";
import { Job } from "../models/Job.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function peerUserIds(job) {
  const ids = new Set([String(job.employer)]);
  if (job.worker) {
    ids.add(String(job.worker));
  }
  job.applicants.forEach((a) => ids.add(String(a.user)));
  return ids;
}

function canUseChat(job) {
  return ["applied", "accepted", "pending", "completed"].includes(job.status);
}

export const sendMessage = asyncHandler(async (req, res) => {
  const { jobId, message, receiverId } = req.body;

  if (!jobId || !mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "jobId is required");
  }
  if (!message?.trim()) {
    throw new ApiError(400, "message is required");
  }
  if (!receiverId || !mongoose.isValidObjectId(receiverId)) {
    throw new ApiError(400, "receiverId is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  if (!canUseChat(job)) {
    throw new ApiError(403, "Chat is only available after a job has applications or has been accepted");
  }

  const peers = peerUserIds(job);
  const sender = String(req.userId);
  const recv = String(receiverId);

  if (!peers.has(sender) || !peers.has(recv) || sender === recv) {
    throw new ApiError(403, "Invalid sender or receiver for this job");
  }

  const doc = await ChatMessage.create({
    jobId,
    senderId: req.userId,
    receiverId,
    message: message.trim(),
  });

  res.status(201).json({
    success: true,
    data: {
      message: {
        id: String(doc._id),
        jobId: String(doc.jobId),
        senderId: String(doc.senderId),
        receiverId: String(doc.receiverId),
        message: doc.message,
        createdAt: doc.createdAt,
      },
    },
  });
});

export const getMessagesForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  if (!canUseChat(job)) {
    throw new ApiError(403, "Chat is not available for this job yet");
  }

  const peers = peerUserIds(job);
  if (!peers.has(String(req.userId))) {
    throw new ApiError(403, "You are not a participant in this job");
  }

  const rows = await ChatMessage.find({ jobId })
    .sort({ createdAt: 1 })
    .lean();

  const messages = rows.map((m) => ({
    id: String(m._id),
    jobId: String(m.jobId),
    senderId: String(m.senderId),
    receiverId: String(m.receiverId),
    message: m.message,
    createdAt: m.createdAt,
  }));

  res.json({ success: true, data: { messages } });
});
