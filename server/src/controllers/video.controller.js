import { Video } from "../models/video.model.js"
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from ".././utils/ApiError.js"
import ApiResponse from ".././utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body;

    // Check if any field is empty
    if (![title, description].every(Boolean)) {
        throw new ApiError(400, "All fields are required!");
    } 

    // upload video & thumbnail on cloudinary
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video is missing!");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail is missing!");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
        throw new ApiError(500, "Failed to upload video!, try again")
    }

    if (!videoFile) {
        throw new ApiError(500, "Failed to upload thumbnail!, try again")
    }

    // save video details in db
    const video = await Video.create({
        videoFile: { key: videoFile?.public_id, url: videoFile?.url },
        thumbnail: { key: thumbnail?.public_id, url: thumbnail?.url },
        title,
        description,
        duration: videoFile?.width,
        owner: req.user._id,
        isPublished
    })

    if (!video) {
        throw new ApiError(500, "Something went wrong while uploading video, try again")
    }

    return res.status(200).json(new ApiResponse(
        200,
        { video },
        "Video uploaded successfully!"
    ))
})

export {
    uploadVideo
}