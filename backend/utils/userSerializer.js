import { Job } from "../models/Job.js";

/**
 * Public user shape for API responses — matches frontend expectations (`id`, not `_id`).
 */
export function serializeUser(userDoc) {
  if (!userDoc) return null;
  const o = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  o.id = String(o._id);
  delete o._id;
  delete o.__v;
  delete o.password;
  return o;
}

/**
 * ChatBox: activeJobs > 0 || jobApplied || jobAccepted — plus live `activeJobs` count for UI.
 */
export async function getUserJobContext(userId, role) {
  const uid = userId;
  const jobApplied = await Job.exists({ "applicants.user": uid });
  const jobAccepted = await Job.exists({
    worker: uid,
    status: { $in: ["accepted", "pending", "completed"] },
  });
  const activeJobsAsWorker = await Job.countDocuments({
    worker: uid,
    status: { $in: ["accepted", "pending"] },
  });
  const activeJobsAsEmployer = await Job.countDocuments({
    employer: uid,
    status: { $in: ["open", "applied", "accepted", "pending"] },
  });

  const activeJobs = role === "Worker" ? activeJobsAsWorker : activeJobsAsEmployer;

  return {
    activeJobs,
    jobApplied: !!jobApplied,
    jobAccepted: !!jobAccepted,
  };
}
