import { Video, View } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { Types } from "mongoose";
import { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from ".././utils/ApiError.js"
import ApiResponse from ".././utils/ApiResponse.js"
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

// publish video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished = true } = req.body;
    let videoFile;
    let thumbnail;
    try {
        // Check if any field is empty
        if (!title) {
            throw new ApiError(400, "title is required!");
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

        videoFile = await uploadOnCloudinary(videoFileLocalPath);
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!videoFile) {
            throw new ApiError(500, "Failed to upload video!, try again")
        }

        if (!thumbnail) {
            throw new ApiError(500, "Failed to upload thumbnail!, try again")
        }

        // save video details in db
        const video = await Video.create({
            videoFile: videoFile?.url,
            thumbnail: thumbnail?.url,
            title,
            description,
            duration: videoFile?.duration,
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
    } catch (error) {
        if (videoFile?.url) {
            await deleteOnCloudinary(videoFile?.url)
        }
        if (thumbnail?.url) {
            await deleteOnCloudinary(thumbnail?.url)
        }
        throw error;
    }
})

// update video
const updateVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { videoId } = req.params;
    let thumbnail;
    try {
        // Check if any field is empty
        if (!title) {
            throw new ApiError(400, "All fields are required");
        }

        // check if Invalid videoId
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid videoId!");
        }

        // delete previous thumbnail from cloudinary, if it exists
        const thumbnailLocalPath = req.file?.path;

        const oldVideoDetails = await Video.findOne({ _id: videoId });

        if (!oldVideoDetails) {
            throw new ApiError(404, "Video not find!");
        }

        if (thumbnailLocalPath) {
            await deleteOnCloudinary(oldVideoDetails.thumbnail);
        }

        // upload new thumbnail, if it exists
        if (thumbnailLocalPath) {
            thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        }

        if (!thumbnail && thumbnailLocalPath) {
            throw new ApiError(500, "Failed to upload thumbnail!, please try again");
        }

        // update video with new details
        const updateFields = {
            $set: {
                title,
                description,
            },
        };

        if (thumbnail) {
            updateFields.$set.thumbnail = thumbnail.url;
        }

        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            updateFields,
            { new: true });

        if (!updatedVideo) {
            throw new ApiError(500, "Something went wrong while updating video details, try again");
        }

        return res.status(200).json(new ApiResponse(
            200,
            { updatedVideo },
            "Video updated successfully!"
        ));
    } catch (error) {
        if (thumbnail?.url) {
            await deleteOnCloudinary(thumbnail?.url)
        }
        throw error;
    }
});

// get video by videoId
const getVideoById = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { videoId } = req.params;

    // check if Invalid videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "videoLikes"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                videoLikesCount: {
                    $size: "$videoLikes"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [userId, "$videoLikes.owner"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                videoFile: 1,
                views: 1,
                owner: 1,
                videoLikesCount: 1,
                isLiked: 1,
                isPublished: 1,
                createdAt: 1
            }
        }
    ])

    if (!video?.length) {
        throw new ApiError(404, "Video not found!")
    }

    if (!video[0]?.isPublished) {
        throw new ApiError(400, "This video is private!")
    }

    // increase the view count, If the user hasn't viewed the video
    const existingView = await View.findOne({ user: userId, video: videoId });

    if (!existingView) {
        await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
        await View.create({ user: userId, video: videoId });
    }

    return res.status(200).json(new ApiResponse(
        200,
        { video: video[0] },
        "Video fetched successfully"
    ))
})

// get all videos
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId, includePrivateVideo } = req.query;

    const pipeline = [];

    // Match stage for filtering by userId

    if (userId && !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId!");
    }

    const user = await User.findById(userId);

    if (userId && !user) {
        throw new ApiError(404, "User Not available witht this userId!");
    }

    if (includePrivateVideo && userId === req.user?._id?.toString()) {
        pipeline.push({
            $match: {
                owner: new Types.ObjectId(userId)
            }
        })
    }
    if (!includePrivateVideo && userId) {
        pipeline.push({
            $match: {
                $and: [
                    { owner: new Types.ObjectId(userId) },
                    { isPublished: true },
                ]
            }
        })
    }
    if (!includePrivateVideo && !userId) {
        pipeline.push({
            $match: {
                isPublished: true
            }
        })
    }


    // Match stage for based on text query
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            }
        });
    }

    // Sort stage
    if (sortBy && sortType) {
        const sortTypeValue = sortType === 'desc' ? -1 : 1;
        pipeline.push({
            $sort: { [sortBy]: sortTypeValue }
        });
    }

    // populate the owner
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                {
                    $project: {
                        username: 1,
                        fullName: 1,
                        avatar: 1
                    }
                }
            ]
        }
    })

    // add the calculated owner field
    pipeline.push({
        $addFields: {
            owner: {
                $first: "$owner"
            }
        }
    })

    // project required field
    pipeline.push({
        $project: {
            title: 1,
            thumbnail: 1,
            owner: 1,
            views: 1,
            duration: 1,
            createdAt: 1,
        }
    })

    const aggregate = Video.aggregate(pipeline)

    Video.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "Fetched videos successfully"
            ))
        })
        .catch(function (error) {
            throw error
        })
})

// delete video by videoId
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // check if Invalid videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found!");
    }

    // Delete video & thumbnail from cloudinary
    if (video.videoFile) {
        const deletedVideoFile = await deleteOnCloudinary(video.videoFile, "video");
        if (!deletedVideoFile) {
            throw new ApiError(500, "Failed to delete video!")
        }
    }

    if (video.thumbnail) {
        const deletedThumbnail = await deleteOnCloudinary(video.thumbnail);
        if (!deletedThumbnail) {
            throw new ApiError(500, "Failed to delete video!")
        }
    }

    // Delete record from the database
    await Video.findByIdAndDelete(videoId);

    // Delete views
    await View.deleteMany({ video: videoId })

    // Delete all the likes and comments associated to this video
    await Like.deleteMany({ video: videoId });
    await Comment.deleteMany({ video: videoId })

    // Delete likes associated with comments
    const comments = await Comment.find({ video: videoId }).select('_id');
    const commentIds = comments.map(comment => comment._id);
    await Like.deleteMany({ comment: { $in: commentIds } });

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Video deleted successfully"
    ));
});

// toggle public status by videoId
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // check if Invalid videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found!");
    }

    video.isPublished = !video.isPublished;

    await video.save();

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Toggle public status successfully"
    ))
})

export {
    publishAVideo,
    updateVideo,
    getVideoById,
    getAllVideos,
    deleteVideo,
    togglePublishStatus
}