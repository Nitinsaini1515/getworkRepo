import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";


export const connection = async()=>{
try {
  const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI }/${DB_NAME}`)
  console.log(`connection is successed and the host is ${connectionInstance.connection.host}`)
} catch (error) {
  console.log("Error in connection mongodb after try block in  catch block",error);
}
}