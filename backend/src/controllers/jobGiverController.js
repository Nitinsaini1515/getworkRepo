import asyncHandler from "../utils/asynchHandler.js";
import apiErrors from "../utils/ApiErrors.js";
import apiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.js";
import { Job } from "../models/job.js";

export const postJob = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if(user.role!="jobgiver"){
    throw new apiErrors(200,"Only job provider can post job")
  }
  if (!user) {
    throw new apiErrors(402, "Please login before posting any job");
  }
  const { title, description,workingHour, category, location, budget, status } = req.body;
  if (!title||! location||!description||!workingHour||! budget ||!status||!category)
  {
    throw new apiErrors(402, "All field are required");
  }
  const postedJob = await Job.create({
    title,
    location,
    description,
    workingHour,
    budget,
    status:"open",
    category,
    postedBy:user._id,
    
  });

  return res
    .status(200)
    .json(new apiResponse(200, postedJob, "user created successfully"));
});

export const deleteJob = asyncHandler(async (req, res) => {
const {jobId}  = req.params
if(!jobId){
  throw new apiErrors (401,"you have tp enter the job id")
}

const user = await User.findById(req.user._id);

if(!user){
    throw new apiErrors (402,"There is no such user exsist")
}
const job = await Job.findById(jobId)
if(!job){
  throw new apiErrors(403,"There is no such job exisit")
}
  if(job.postedBy.toString() !== req.user._id.toString() ){
    throw new apiErrors(403,"Sorry you cannot  delete the job")
  }
await Job.findByIdAndDelete(req.job_id);
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Job i sdelted successfullly"));
});

export const editJob = asyncHandler(async (req, res) => {
  const user =req.user
  const {jobId} = req.params;

  const { title, description,workingHour, category, location, budget, status } = req.body;
  if (!jobId) {
    throw new apiErrors(402, "job id is required");
  }
  if (!user) {
    throw new apiErrors(402, "There is an error to findng the user in editjob");
  }

  const job = await Job.findById(jobId)

  if(!job){
    throw new apiErrors(401,"job not found")
  }
  
if(!job.postedBy.equals(user._id)){
  throw new apiErrors(402,"You are not allowed to edit the job")
}
  if (!title&&!description &&!category&&!workingHour&&!location&&!budget &&!status
  ) {
    throw new apiErrors(401, "please write everything to updatejob");
  }
  
  if(title) job.title = title
  if(description) job.description = description
if(workingHour) job.workingHour = workingHour
if(category)job.category = category
if(location) job.location = location
if(budget) job.budget =budget
if(status) job.status = status


  await job.save({ validateBeforeSave: false });
  return res.status(200).json(new apiResponse(200, job,"job update successfully"));
});