import { ApiResponse } from "../utils/ApiRespnse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler(async (_, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Server is Healthy", { status: "OK" }));
});
