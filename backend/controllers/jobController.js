import mongoose from "mongoose";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { Feedback } from "../models/Feedback.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseHoursValue } from "../utils/parseHours.js";
import { POSTING_FEE } from "../config/constants.js";
import { recordWalletTx } from "../utils/walletHelpers.js";

function serializeUserRef(u) {
  if (!u) return null;
  const o = u.toObject ? u.toObject() : { ...u };
  o.id = String(o._id);
  delete o._id;
  delete o.__v;
  return o;
}

function serializeJob(job) {
  const o = job.toObject ? job.toObject() : { ...job };
  o.id = String(o._id);
  delete o._id;
  delete o.__v;
  if (o.employer && o.employer._id) {
    o.employer = serializeUserRef(o.employer);
  }
  if (o.worker && o.worker._id) {
    o.worker = serializeUserRef(o.worker);
  }
  if (Array.isArray(o.applicants)) {
    o.applicants = o.applicants.map((a) => {
      const row = { ...a };
      if (row.user && row.user._id) {
        row.user = serializeUserRef(row.user);
      }
      return row;
    });
  }
  return o;
}

async function releaseEscrowPayout(job) {
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

  return payout;
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

export const listAppliedJobs = asyncHandler(async (req, res) => {
  if (req.user.role !== "Worker") {
    throw new ApiError(403, "Only workers can list applied jobs");
  }

  const jobs = await Job.find({ "applicants.user": req.userId })
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
    .populate("worker", "name profilePic rating skills qualification primaryMobile")
    .populate("applicants.user", "name profilePic rating skills");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (req.user.role === "JobGiver" && String(job.employer._id) !== String(req.userId)) {
    throw new ApiError(403, "Not allowed to view this job");
  }

  if (req.user.role === "Worker") {
    const allowed =
      ["open", "applied"].includes(job.status) ||
      job.status === "in-progress" ||
      job.status === "completed" ||
      String(job.worker) === String(req.userId) ||
      job.applicants.some((a) => String(a.user?._id || a.user) === String(req.userId));
    if (!allowed) {
      throw new ApiError(403, "Not allowed to view this job");
    }
  }

  const feedbackRows = await Feedback.find({ jobId: id })
    .populate("fromUser", "name profilePic role")
    .populate("toUser", "name profilePic role")
    .sort({ createdAt: -1 })
    .lean();

  const ratings = feedbackRows.map((f) => ({
    id: String(f._id),
    jobId: String(f.jobId),
    fromUser: f.fromUser
      ? { id: String(f.fromUser._id), name: f.fromUser.name, profilePic: f.fromUser.profilePic, role: f.fromUser.role }
      : String(f.fromUser),
    toUser: f.toUser
      ? { id: String(f.toUser._id), name: f.toUser.name, profilePic: f.toUser.profilePic, role: f.toUser.role }
      : String(f.toUser),
    rating: f.rating,
    comment: f.comment,
    createdAt: f.createdAt,
  }));

  const jobObj = serializeJob(job);
  jobObj.ratings = ratings;
  const proofs = [...(jobObj.completionPhotos || [])];
  if (jobObj.proofImageUrl) proofs.unshift(jobObj.proofImageUrl);
  jobObj.proofImages = [...new Set(proofs.filter(Boolean))];

  res.json({ success: true, data: { job: jobObj } });
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
  if (job.status === "open") {
    job.status = "applied";
  }
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

/** QR scan / start on-site — no payment calculation */
export const startJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "Worker") {
    throw new ApiError(403, "Only workers can start a job");
  }

  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  if (String(job.worker) !== String(req.userId)) {
    throw new ApiError(403, "You are not the assigned worker for this job");
  }
  if (job.status !== "applied") {
    throw new ApiError(400, "Job must be in applied status to start (scan QR on site)");
  }

  job.status = "in-progress";
  job.startTime = new Date();
  await job.save();

  const populated = await Job.findById(job._id)
    .populate("employer", "name businessName")
    .populate("worker", "name profilePic rating");

  res.json({
    success: true,
    message: "Job started",
    data: { job: serializeJob(populated) },
  });
});

/** Worker completes job with photos; escrow released; employer notified */
export const completeJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "Worker") {
    throw new ApiError(403, "Only workers can complete a job");
  }

  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const files = req.files;
  if (!files?.length) {
    throw new ApiError(400, "At least one completion photo is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  if (String(job.worker) !== String(req.userId)) {
    throw new ApiError(403, "You are not the assigned worker for this job");
  }
  if (job.status !== "in-progress") {
    throw new ApiError(400, "Job must be in progress to complete");
  }

  const base = `${req.protocol}://${req.get("host")}`;
  const urls = files.map((f) => `${base}/uploads/proofs/${f.filename}`);
  job.completionPhotos = [...(job.completionPhotos || []), ...urls];
  job.proofImageUrl = job.proofImageUrl || urls[0];
  job.status = "completed";
  job.employerNotifiedAt = new Date();
  job.paymentReleasedAt = new Date();

  await job.save();

  const payout = await releaseEscrowPayout(job);

  const populated = await Job.findById(job._id)
    .populate("employer", "name businessName email")
    .populate("worker", "name profilePic rating");

  res.json({
    success: true,
    message: "Job completed; employer notified; payment released to worker",
    data: { job: serializeJob(populated), workerPaid: payout },
  });
});
