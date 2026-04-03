import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME
  ,// console.log("error in name")
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;

    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localfilepath);
    console.log("Local file deleted after upload");

    return response;
  } catch (error) {
    if (localfilepath && fs.existsSync(localfilepath)) {
      fs.unlinkSync(localfilepath);
    }
    console.error("Cloudinary upload failed:", error.message);
    return null;
  }
};

export default uploadOnCloudinary;