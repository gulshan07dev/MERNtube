import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        return await cloudinary.uploader.upload(localFilePath, {
            folder: "Merntube",
            resource_type: "auto"
        })
    } catch (error) {
        return null
    } finally {
        fs.unlinkSync(localFilePath);
    }
}

export const deleteOnCloudinary = async (url, resource_type = "image") => {
    try {
        if (!url) return null;
        const public_id = url.split("/").slice(7, 9).join("/").split(".")[0];
        return await cloudinary.uploader.destroy(public_id, {
            resource_type
        });
    } catch (error) {
        throw error
    }
}