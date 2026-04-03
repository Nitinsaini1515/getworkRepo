import mongoose, { Schema } from "mongoose"

const JobSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
    trim:true,
  },
  description:{
    type:String,
    required:true,
    trim:true,
  },
  workingHour:{
type:Number,
required:true
  },

  category:{
 type: String,
    enum: ["Cleaning", "Delivery", "Event", "Other"],
    default: "Other"
  },
  location:{
    type:String,
    required:true,
    trim:true,
  },
  budget:{
    type:Number,
    required:true,
    trim:true,
  },
  postedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
    
  },
  assignedTo:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
default:null,
  },
//   JobTime:{
// type:String,
// required:true,
// trim:true
//   },

  status:{
type:String,
enum:["open","in-progress","completed"]
  }

},{Timestamp:true})

export const Job = mongoose.model("Job", JobSchema);