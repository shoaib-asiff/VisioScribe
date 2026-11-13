import { ApiResponse } from "../utils/ApiRespnse.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { setOTP, verifyOTP } from "../utils/otpServices.js";

const generateAccessAndRefreshToken = async (user) => {
  try {
    if (!user) throw new ApiError(404, "User not Found");

    const accessToken = await user.generateAccessToken();
    if (!accessToken) throw new ApiError(500, "Access Token not Generated");

    const refreshToken = await user.generateRefreshToken();
    if (!refreshToken) throw new ApiError(500, "Refresh Token not Generated");

    await User.findByIdAndUpdate(user?._id, {
      $set: {
        refreshToken,
      },
    });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Error in Generating Refresh and Access Token");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req?.body;

  if (
    [userName, fullName, email, password].some(
      (field) => !field || field?.trim() === ""
    )
  )
    throw new ApiError(400, "All Fields are Required");

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existingUser) throw new ApiError(409, "User Already Exists");

  const newUser = await User.create({
    userName,
    fullName,
    email,
    password,
  });
  if (!newUser) throw new ApiError(500, "Cannot Create User");

  const user = await User.findById(newUser?._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(500, "User is not Created");
  return res
    .status(200)
    .json(new ApiResponse(200, "User Successfully Created", user));
});

export const login = asyncHandler(async (req, res) => {
  let { email, password } = req?.body;
  email = email?.trim();
  if (!(email && password))
    throw new ApiError(400, "Both Email and Password Required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not Found");

  if (!(await user.isPasswordValid(password)))
    throw new ApiError(400, "Incorrect Password");

  const { refreshToken, accessToken } =
    await generateAccessAndRefreshToken(user);

  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) throw new ApiError(500, "Unable to get User Detail");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "Logged In Successfully", {
        user: loggedInUser,
        refreshToken,
        accessToken,
      })
    );
});

export const getCurrentUser = (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Current User Successfully Fetched", req?.user));
};

export const refreshTokens = asyncHandler(async (req, res) => {
  const token = req?.cookies?.refreshToken || req?.body?.refreshToken;
  if (!token) throw new ApiError(404, "Token Not Found");

  const decodeToken = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  if (!decodeToken) throw new ApiError(500, "Invalid Token");

  const user = await User.findById(decodeToken?._id);
  if (!user) throw new ApiError(404, "User not Found");

  if (user?.refreshToken !== token)
    throw new ApiError(401, "Unauthorized Access");

  const { refreshToken, accessToken } = generateAccessAndRefreshToken(user);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "New Tokens Recieved", {
        refreshToken,
        accessToken,
      })
    );
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req?.user?._id, {
    $unset: { refreshToken: 1 },
  });

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "Successfully Logged-Out"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req?.body;
  if (!newPassword) throw new ApiError(400, "All Fields Are Required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(500, "Error in Fetching User Details");

  if (await user.isPasswordValid(newPassword))
    throw new ApiError(400, "Same as Old Password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, "Password Successfully Changed"));
});

export const otpGetter = asyncHandler(async (req, res) => {
  let { email } = req?.body;
  email = email?.trim();
  if (!email) throw new ApiError(400, "Email Must be Required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not Found");

  const otp = Math.floor(1000 + Math.random() * 9999);

  const otpSet = await setOTP(email, otp);
  if (!otpSet) throw new ApiError(500, "Unable to Set OTP");

  const emailSent = await sendEmail("Forgot Password", otp, email);
  if (!emailSent) throw new ApiError(500, "Unable to Send Email");

  res.status(200).json(new ApiResponse(200, "Email Successfully Sent"));
});

export const otpVerify = asyncHandler(async (req, res) => {
  let { email, otp } = req?.body;
  email = email?.trim();
  otp = String(otp);
  otp = otp?.trim();
  if (!(otp && email)) throw ApiError(400, "All Fields are Reuired");

  const otpVerify = await verifyOTP(email, otp);
  if (!otpVerify) throw new ApiError(404, "OTP is not Matched");

  res.status(200).json(new ApiResponse(200, "OTP Successully Verified"));
});

export const getUserHistory = asyncHandler(async (req, res) => {
  let { page = 1, userName } = req?.query;
  page = parseInt(page);
  userName = userName?.trim();
  if (page <= 0) page = 1;
  if (!userName) throw new ApiError(400, "User Name is Required");

  const history = User.aggregate([
    {
      $match: {
        userName,
      },
    },
    {
      $lookup: {
        from: "chats",
        localField: "history",
        foreignField: "_id",
        as: "history",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              image: 1,
              caption: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        history: 1,
      },
    },
  ]);
  if (!history) throw new ApiError(500, "Unable to Aggregate History");

  const options = {
    page,
    limit: 10,
  };

  const painatedHistory = await User.aggregatePaginate(history, options);
  if (!painatedHistory) throw new ApiError(500, "Unable to Paginate History");

  res
    .status(200)
    .json(
      new ApiResponse(200, "History Fetched Successfully", painatedHistory)
    );
});
