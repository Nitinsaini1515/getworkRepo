import mongoose from "mongoose";


const walletSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  balance:{
type:number,
default:0,
  },
  transaction:{
amount:{
type:number,
required:true
},

jobId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Job",
required:false
},
type:{
type:String,
enum:["deposite","withdraw","payment","refund"],
},
status:{
  type:String,
  enum:["pending","completed","failed"],
  default:"completed"
}

  }

},{timestamps:true})

export const wallet = mongoose.model("Wallet",walletSchema)