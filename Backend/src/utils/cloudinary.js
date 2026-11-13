import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(filePath) {
  try {
    filePath = filePath?.trim();
    if (!filePath) return null;
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(filePath);
    console.log("File Uploaded To Cloudinary");
    return response;
  } catch (error) {
    fs.unlinkSync(filePath);
    throw "Error in Uploading to CLoudinary";
  }
}

export const deleteFromCloudinary = async (localURL) => {
  try {
    if (!localURL) return false;

    const splitedArray = localURL.split("/");
    const startIndex = splitedArray.indexOf("upload");

    if (startIndex === -1) return false;

    let public_key_img = splitedArray.slice(startIndex + 2);

    public_key_img = public_key_img.join("/");
    public_key_img = public_key_img.replace(/\.[a-zA-Z0-9]+$/i, "");

    const result = await cloudinary.uploader.destroy(public_key_img);

    if (result.result !== "ok") return false;

    return true;
  } catch (error) {
    console.log(`Cloudinary Deletion Error ${error}`);
    return false;
  }
};
