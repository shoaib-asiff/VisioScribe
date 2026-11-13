import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyTokens = asyncHandler(async (req, _, next) => {
  const token =
    req?.cookies?.accessToken ||
    req?.header("Authorizarion")?.replace("Bearer ", "");

  if (!token) throw new ApiError(404, "Token not Found");

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedToken) throw new ApiError(500, "Unable to Decode Token");

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(404, "User not Found - Unauthorized");

  req.user = user;
  next();
});
