// import { v2 as cloudianry } from "cloudinary";
// import fs from 'fs'

// cloudianry.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secrect: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null
//     const response = await cloudinary.uploader.upload.(localFilePath, {
//         resource_type : "auto"
//     })
//     console.log("File is uploaded!", response.url);
//     return response
//   } catch (error) {
//     fs.unlink(localFilePath)
//   }
// };

// export cloudinaryUpload

import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded:", response.secure_url);

    // Delete temporary local file after successful upload
    await unlink(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    // Attempt to clean up temporary file
    if (localFilePath) {
      try {
        await unlink(localFilePath);
      } catch (cleanupError) {
        console.error("Local file cleanup failed:", cleanupError);
      }
    }

    return null;
  }
};

export { uploadOnCloudinary };
