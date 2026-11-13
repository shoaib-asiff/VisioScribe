import { client } from "./redis.js";

export const setOTP = async (email, OTP) => {
  try {
    const otp = await client.set(email, OTP, { EX: 300 });
    return otp;
  } catch (error) {
    console.log("Error in Setting OTP");
    return null;
  }
};

export const verifyOTP = async (email, inputOTP) => {
  const storedOTP = await client.get(email);
  if (!storedOTP) return false;
  if (storedOTP === inputOTP) {
    await client.del(email);
    return true;
  }
  return false;
};
