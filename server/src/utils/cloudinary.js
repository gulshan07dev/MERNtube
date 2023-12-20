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
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "Merntube",
            resource_type: "auto"
        })
        return { key: response?.public_id, url: response?.url }
    } catch (error) {
        return null
    } finally {
        fs.unlinkSync(localFilePath);
    }
}

export const deleteOnCloudinary = async (public_id) => {
    try {
        if (!public_id) return null;
        return await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        return null
    }
}