import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs/promises";

console.log("Cloudinary credentials:", {
  cloudName: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
  apiKey: Boolean(process.env.CLOUDINARY_API_KEY),
  apiSecret: Boolean(process.env.CLOUDINARY_API_SECRET),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });

//     console.log("Cloudinary upload successful:", response.secure_url);

//     await unlink(localFilePath);

//     return response;
//   } catch (error) {
//     // console.error("Cloudinary upload failed:", error.message);
//     console.error("========== CLOUDINARY ERROR ==========");
//     console.error("Message:", error.message);
//     console.error("HTTP Code:", error.http_code);
//     console.error("Name:", error.name);
//     console.error("Full Error:", error);
//     console.error("======================================");

//     return null;
//   }
// };

const uploadOnCloudinary = async (localFilePath) => {
  console.log("1. Cloudinary function called");
  console.log("2. Local file path:", localFilePath);

  try {
    if (!localFilePath) {
      console.log("ERROR: Local file path is missing");
      return null;
    }

    console.log("3. Starting Cloudinary upload...");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("4. Cloudinary upload successful!");
    console.log("Image URL:", response.secure_url);

    await unlink(localFilePath);

    return response;
  } catch (error) {
    console.error("5. CLOUDINARY UPLOAD ERROR!");
    console.error(error.message);
    console.error(error);

    return null;
  }
};

export { uploadOnCloudinary };
