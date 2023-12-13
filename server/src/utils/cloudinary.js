import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        return await cloudinary.uploader.upload(localFilePath, {
            folder: "Merntube",
            resource_type: "auto"
        })
    } catch (error) {
        return null;
    }
}

export default uploadOnCloudinary