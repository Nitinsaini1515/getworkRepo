import mongoose from "mongoose";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseHoursValue } from "../utils/parseHours.js";
import { POSTING_FEE } from "../config/constants.js";
import { recordWalletTx } from "../utils/walletHelpers.js";

function serializeJob(job) {
  const o = job.toObject ? job.toObject() : { ...job };
  o.id = String(o._id);
  delete o._id;
  delete o.__v;
  if (o.employer && o.employer._id) {
    o.employer = { ...o.employer, id: String(o.employer._id) };
    delete o.employer._id;
  }
  if (o.worker && o.worker._id) {
    o.worker = { ...o.worker, id: String(o.worker._id) };
    delete o.worker._id;
  }
  return o;
}

export const createJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "JobGiver") {
    throw new ApiError(403, "Only employers can create jobs");
  }

  const {
    title,
    description,
    pay,
    hours,
    location,
    scheduledAt,
    experience,
    tier,
  } = req.body;

  if (!title?.trim() || !description?.trim() || !location?.trim()) {
    throw new ApiError(400, "title, description, and location are required");
  }
  const payNum = Number(pay);
  if (Number.isNaN(payNum) || payNum < 0) {
    throw new ApiError(400, "pay must be a valid number");
  }
  if (!hours) {
    throw new ApiError(400, "hours is required");
  }

  const hoursNum = parseHoursValue(hours);
  if (hoursNum <= 0) {
    throw new ApiError(400, "hours must be a positive number");
  }

  const escrowAmount = Math.round(payNum * hoursNum * 100) / 100;
  const totalCharge = Math.round((escrowAmount + POSTING_FEE) * 100) / 100;

  const employer = await User.findById(req.userId);
  if (employer.walletBalance < totalCharge) {
    throw new ApiError(400, "Insufficient wallet balance to post this job");
  }

  employer.walletBalance = Math.round((employer.walletBalance - totalCharge) * 100) / 100;
  employer.totalSpent = Math.round((employer.totalSpent + totalCharge) * 100) / 100;
  employer.jobCredits = (employer.jobCredits || 0) + 1;
  await employer.save();

  await recordWalletTx(
    employer._id,
    "deduction",
    totalCharge,
    `Job posting & escrow lock: ${title}`,
    null,
    employer.walletBalance
  );

  const job = await Job.create({
    title: title.trim(),
    description: description.trim(),
    pay: payNum,
    hours: String(hours).trim(),
    location: location.trim(),
    employer: req.userId,
    escrowAmount,
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    experience: experience?.trim() ?? "",
    tier: tier?.trim() || "Standard",
    status: "open",
  });

  const populated = await Job.findById(job._id).populate("employer", "name businessName email profilePic rating");

  res.status(201).json({
    success: true,
    message: "Job created",
    data: { job: serializeJob(populated) },
  });
});

export const listJobs = asyncHandler(async (req, res) => {
  let query;
  if (req.user.role === "Worker") {
    query = {
      $or: [
        { status: { $in: ["open", "applied"] } },
        { worker: req.userId },
        { "applicants.user": req.userId },
      ],
    };
  } else {
    query = { employer: req.userId };
  }

  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .populate("employer", "name businessName businessDetails profilePic rating")
    .populate("worker", "name profilePic rating skills")
    .lean();

  const data = jobs.map((j) => {
    const o = { ...j, id: String(j._id) };
    delete o._id;
    delete o.__v;
    return o;
  });

  res.json({ success: true, data: { jobs: data } });
});

export const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid job id");
  }

  const job = await Job.findById(id)
    .populate("employer", "name businessName businessDetails profilePic rating email")
    .populate("worker", "name profilePic rating skills qualification primaryMobile");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (req.user.role === "JobGiver" && String(job.employer._id) !== String(req.userId)) {
    throw new ApiError(403, "Not allowed to view this job");
  }

  if (req.user.role === "Worker") {
    const allowed =
      ["open", "applied"].includes(job.status) ||
      String(job.worker) === String(req.userId) ||
      job.applicants.some((a) => String(a.user) === String(req.userId));
    if (!allowed) {
      throw new ApiError(403, "Not allowed to view this job");
    }
  }

  res.json({ success: true, data: { job: serializeJob(job) } });
});

export const applyJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "Worker") {
    throw new ApiError(403, "Only workers can apply");
  }

  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  if (!["open", "applied"].includes(job.status)) {
    throw new ApiError(400, "This job is not accepting applications");
  }

  const already = job.applicants.some((a) => String(a.user) === String(req.userId));
  if (already) {
    throw new ApiError(400, "You have already applied to this job");
  }

  job.applicants.push({ user: req.userId, appliedAt: new Date() });
  if (job.status === "open") {
    job.status = "applied";
  }
  await job.save();

  const populated = await Job.findById(job._id).populate("employer", "name businessName");

  res.json({
    success: true,
    message: "Application submitted",
    data: { job: serializeJob(populated) },
  });
});

export const acceptJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "JobGiver") {
    throw new ApiError(403, "Only employers can accept applicants");
  }

  const { jobId } = req.params;
  const { workerId } = req.body;

  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }
  if (!workerId || !mongoose.isValidObjectId(workerId)) {
    throw new ApiError(400, "workerId is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  if (String(job.employer) !== String(req.userId)) {
    throw new ApiError(403, "Not your job");
  }
  if (!["open", "applied"].includes(job.status)) {
    throw new ApiError(400, "Cannot accept workers for this job in current status");
  }

  const isApplicant = job.applicants.some((a) => String(a.user) === String(workerId));
  if (!isApplicant) {
    throw new ApiError(400, "That user has not applied to this job");
  }

  const worker = await User.findById(workerId);
  if (!worker || worker.role !== "Worker") {
    throw new ApiError(400, "Invalid worker");
  }

  job.worker = worker._id;
  job.status = "accepted";
  await job.save();

  worker.activeJobs = (worker.activeJobs || 0) + 1;
  await worker.save();

  const populated = await Job.findById(job._id)
    .populate("employer", "name businessName")
    .populate("worker", "name profilePic rating");

  res.json({
    success: true,
    message: "Worker accepted for this job",
    data: { job: serializeJob(populated) },
  });
});

export const uploadProof = asyncHandler(async (req, res) => {
  if (req.user.role !== "Worker") {
    throw new ApiError(403, "Only workers can upload proof");
  }

  const jobId = req.body.jobId;
  if (!jobId || !mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "jobId is required");
  }
  if (!req.file) {
    throw new ApiError(400, "Proof image file is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  if (String(job.worker) !== String(req.userId)) {
    throw new ApiError(403, "You are not the assigned worker for this job");
  }
  if (job.status !== "accepted") {
    throw new ApiError(400, "Proof can only be uploaded after the job is accepted");
  }

  const base = `${req.protocol}://${req.get("host")}`;
  const proofImageUrl = `${base}/uploads/proofs/${req.file.filename}`;

  job.proofImageUrl = proofImageUrl;
  job.status = "pending";
  await job.save();

  res.json({
    success: true,
    message: "Proof uploaded; pending employer approval",
    data: { job: serializeJob(job) },
  });
});

export const approveJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "JobGiver") {
    throw new ApiError(403, "Only employers can approve completion");
  }

  const { jobId } = req.body;
  if (!jobId || !mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "jobId is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  if (String(job.employer) !== String(req.userId)) {
    throw new ApiError(403, "Not your job");
  }
  if (job.status !== "pending") {
    throw new ApiError(400, "Job is not pending approval");
  }

  const worker = await User.findById(job.worker);
  if (!worker) {
    throw new ApiError(400, "Worker not found");
  }

  const hoursNum = parseHoursValue(job.hours);
  const payout = job.escrowAmount > 0 ? job.escrowAmount : job.pay * hoursNum;

  worker.walletBalance = Math.round((worker.walletBalance + payout) * 100) / 100;
  worker.totalEarned = Math.round((worker.totalEarned + payout) * 100) / 100;
  worker.hoursWorked = Math.round((worker.hoursWorked + hoursNum) * 100) / 100;
  worker.completedJobs = (worker.completedJobs || 0) + 1;
  worker.activeJobs = Math.max(0, (worker.activeJobs || 1) - 1);
  await worker.save();

  await recordWalletTx(
    worker._id,
    "credit",
    payout,
    `Payment released for job: ${job.title}`,
    job._id,
    worker.walletBalance
  );

  const employer = await User.findById(job.employer);
  if (employer) {
    employer.hoursBooked = Math.round((employer.hoursBooked + hoursNum) * 100) / 100;
    await employer.save();
  }

  job.status = "completed";
  await job.save();

  res.json({
    success: true,
    message: "Job approved; payment transferred to worker wallet",
    data: { job: serializeJob(job), workerPaid: payout },
  });
});
