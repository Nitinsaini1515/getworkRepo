import asyncHandler from "../utils/asynchHandler.js";
import apiErrors from "../utils/ApiErrors.js";
import apiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.js";
import uploadOnCloudinary from "../utils/cloudinary.js";




const generateAccessaAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log("ACCESS TOKEN BAN GYA")
    const accessToken = user.generateAccessToken();
    // console.log("ACCESS TOKEN BAN GYA NHI")
    const refreshToken = user.generateRefreshToken();
    // console.log("ACCESS TOKEN BAN GYA NHI HAI ")
    // console.log(accesstoken)
    // console.log(refreshtoken)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiErrors(
      500,
      "Something went wrong while generating the access and refresh token"
    );
  }
};

export const register =asyncHandler(async(req,res)=>{
const {firstName,lastName,email,password,role,skills,qualification,experience,shopName,gstNumber,businessType,address} = req.body

if(!firstName||!lastName||!email||!password||!role||!address){
throw new apiErrors(403,"All field are required")
}
if(role=="worker"){
  if(!skills?.length||!qualification||experience==null){
    throw new apiErrors(401,"Enter required fied in the worker")
  }
}
if(role=="jobgiver"){
  if(!shopName||!gstNumber||!businessType){
    throw new apiErrors(401,"Enter required fied in the jobgiver")
  }
}

const alreadyExsist = await User.findOne({
  $or:[{email}]
})
if(alreadyExsist){
  throw new apiErrors(401,"Email id is already exsist")
}
if(!email.toLowerCase().endsWith("@gmail.com")){
  throw new apiErrors(401,"Email sould be ends with the @gmail.com")
}
const profilePicLocal = req.files?.avatar[0]?.path;
if(!profilePicLocal){
  throw new apiErrors(401,"Profile pic is mandatory to upload")
}
const avatar = await uploadOnCloudinary(profilePicLocal)
if(!avatar){
  throw new apiErrors(402,"Error in uploading the profile pic on the cloudinary")
}

const addharPicLocal = req.files?.addhar[0]?.path;
if(!addharPicLocal){
  throw new apiErrors (401,"Addhar card pic are required")
} 
const addhar = await uploadOnCloudinary(addharPicLocal)
if(!addhar){
  throw new apiErrors(402,"There is an error to upload adhar pic on the cloudinary")
} 

let shopImg = null;
if(role==="jobgiver"){
  const shopeImage = req.files?.shopImg[0]?.path;
if(!shopeImage){
  throw new apiErrors (401,"Shop pic are required")
} 
shopImg = await uploadOnCloudinary(shopeImage)
if(!shopImg){
  throw new apiErrors(500,"There is an error to upload shop pic on the cloudinary")
} 
}


const mainuser = await User.create({
  firstName,
  lastName,
  email,
  password,
  avatar :avatar.secure_url,
  role,
  address,
  addhar:addhar.secure_url,
  shopImg:shopImg?.secure_url??null,
  shopName,
  gstNumber,
  businessType,skills,
  qualification,
  experience,
})
const user = await User.findById(mainuser._id).select("-password")

return res.status(200).json(new apiResponse(200,user,"User registerd successfully"))


})


export const login =asyncHandler(async(req,res)=>{
  const {email,password} =req.body
    if (!email || !password) {
    throw new apiErrors(400, "Email and password are required");
  }
  const user = await User.findOne({email})
  if(!user){
    throw new apiErrors(402,"No user exsist with this user email")
  } 
  const isValidPassword = await user.isPasswordCorrect(password)
  if(!isValidPassword){
    // console.log("yaha error hai")
    throw new apiErrors(403,"The password is invalid")
  }
  console.log("pasword valid hogya")
  const {accessToken,refreshToken} = await generateAccessaAndRefreshToken(user._id)
const loginUser = await User.findById(user._id).select("-password")
const options = {
  httpOnly :true,
  secure:false
}
return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new apiResponse (200,{user:loginUser,
  accessToken,
  refreshToken
},"User logged in successfully"))
})



export const logout = asyncHandler(async(req,res)=>{
User.findByIdAndUpdate(
req.user._id,{
    $unset:{
      refreshToken:1
    }

  },
  {
    new:true,
  }
);
const options ={
httpOnly:true,
  secure:false,
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new apiResponse(200,{},"Account logout successfully"))


})

export const passwordChange = asyncHandler(async(req,res)=>{
// const {userExsist} = req.params
const user = await User.findById(req.user._id);
// console.log("me chala gya ")
const {oldPassword,newPassword,confirmPassword} =req.body
// console.log("me chala hi nahi")
// const findingUser = await User.findOne(userExsist)
if(!user){
  throw new apiErrors(403,"Login to change the password")
}
// if(!oldPassword&&!newPassword&&!confirmPassword){
//   throw new apiErrors(402,"all fielwd are required")
// }

if(!oldPassword||!newPassword||!confirmPassword)
{
throw new apiErrors(402,"All fields are required")
}



  const ispasswordcorrect = await user.isPasswordCorrect(oldPassword);
if(!ispasswordcorrect){
  throw new apiErrors(401,"old password is not correct enter correct old password")
}
if(oldPassword==newPassword){
  throw new apiErrors(401,"password should not match to old password")
}
if(newPassword!=confirmPassword){
  throw new apiErrors(401,"The new password and confirmpassword should match with each other")
}

user.password = newPassword
await user.save({validateBeforeSave:false})
return res.status(200).json(new apiResponse( 200,{},"Password changed successfully"))
})



export const updateProfile = asyncHandler(async (req,res)=>{
const user = await User.findById(req.user._id)
const{firstName,lastName,email,address} = req.body
if(!user){
  throw new apiErrors(401,"Please login before update the profile")
}
if(!firstName &&!lastName&&!email&&!address){
  throw new apiErrors(401,"All the fields are required")
}

if(firstName) user.firstName = firstName
if(lastName) user.lastName = lastName
if(email) user.email = email
if(address) user.address = address

await user.save({validateBeforeSave:false})
return res.status(200).json(new apiResponse(200,{user},"profile updated successfully"))
})


export const deleteAccount = asyncHandler(async(req,res)=>{
const user = await User.findById(req.user._id)
if(!user){
  throw new apiErrors(403,"Please login before delete account")
}
await User.findByIdAndDelete(req.user._id)
return res.status(200).json(new apiResponse(200,{},"Account deleted successfully"))

})

// change avatar pic
// uploadworker pic
// validation of adhar card
// validation using email otp 