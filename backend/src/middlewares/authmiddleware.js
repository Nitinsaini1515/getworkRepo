
import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asynchHandler.js'
import apiErrors from '../utils/ApiErrors.js'
// import apiResponse from '../utils/ApiResponse'
import { User } from '../models/user.js'


export const verifyJWT = asyncHandler(async(req,res,next)=>{
  try {
    const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer","");
    if(!token){
      throw new apiErrors(403,"Unauthorized request");
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
       if(!user){
        throw new apiErrors(403,"There is an error during the access token")

       }
        req.user = user;
        next()
  } catch (error) {
    throw new apiErrors(402,error?.message,"Invalid access");
  }
})

// export default verifyJWT
