// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { User } from "../models/user.model.js";
// import { apiResponce } from "../utils/apiResponse.js";

// const registerUser = asyncHandler(async (req, res) => {
//   console.log("🔥 REGISTER CONTROLLER IS RUNNING");
//   console.log("BODY:", req.body);
//   console.log("FILES:", req.files);
//   console.log("AVATAR:", req.files?.avatar);

//   const { fullName, email, username, password } = req.body;
//   console.log("email : ", email);

//   if (
//     [fullName, email, username, password].some((field) => field?.trim() === "")
//   ) {
//     throw new ApiError(400, "All fields are required");
//   }

//   const existedUser = await User.findOne({
//     $or: [{ email }, { username }],
//   });

//   if (existedUser) {
//     throw new ApiError("409", "User with same name and email already exist");
//   }

//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "avatar is required");
//   }

//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   console.log("AVATAR UPLOAD RESULT:", avatar);
//   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

//   if (!avatar) {
//     throw new ApiError(500, "Avatar upload to Cloudinary failed");
//   }

//   const user = await User.create({
//     fullName,
//     email,
//     avatar: avatar.url,
//     coverImage: coverImage?.url,
//     password,
//     username: username.toLowerCase(),
//   });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );
//   if (!createdUser) {
//     throw new ApiError(500, "something went wrong while registering the user");
//   }

//   return res
//     .status(201)
//     .json(new apiResponce(200, createdUser, "user successfully created!"));
// });

// export { registerUser };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { apiResponce } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1. Get user details from request body
  const { fullName, email, username, password } = req.body;

  // 2. Validate required fields
  if (
    [fullName, email, username, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 3. Check whether user already exists
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // 4. Get local image paths from Multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // 5. Validate avatar
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  // 6. Upload avatar to Cloudinary
  console.log("Uploading avatar...");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  console.log("Avatar upload result:", avatar);

  if (!avatar || !avatar.secure_url) {
    throw new ApiError(500, "Avatar upload to Cloudinary failed");
  }

  // 7. Upload cover image if provided
  let coverImage = null;

  if (coverImageLocalPath) {
    console.log("Uploading cover image...");

    coverImage = await uploadOnCloudinary(coverImageLocalPath);

    console.log("Cover image upload result:", coverImage);
  }

  // 8. Create user in MongoDB
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || "",
  });

  // 9. Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // 10. Send successful response
  return res
    .status(201)
    .json(new apiResponce(201, createdUser, "User successfully registered!"));
});

export { registerUser };
