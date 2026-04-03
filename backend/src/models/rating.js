import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  givenBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true,
  },
  givenTo:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true,
  },
 job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: false,
  },
  rating:{
type:Number,
required:true,
min:1,
max:5
  },
  review:{
type:String,
trim:true
  }
},{timestamps:true})
export const Rating = mongoose.model("Rating",ratingSchema)