import { WatchHistory } from "../models/WatchHistory.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { Types, isValidObjectId } from "mongoose";

// add video to watch history
const addVideoToWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const {user} = req;

    // Check if Invalid videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
    }

    // Check if the option to add video to watch history is not allowed
    if (user.isWatchHistoryPaused) {
        throw new ApiError(400, "Please enable the watch history option.");
    }

    // Set today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the video is already in the watched history for today, remove it and create another
    await WatchHistory.deleteOne({
        videoId,
        owner: user._id,
        createdAt: { $gte: today }
    });

    // Create a new VideoHistory document
    const videoHistory = await WatchHistory.create({
        videoId,
        owner: user._id
    });

    if (!videoHistory) {
        throw new ApiError(500, "Something went wrong while adding video to watch history");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { videoHistory },
            "Video added to watch history successfully"
        )
    )
})

// remove video from watch history
const removeVideoFromWatchHistory = asyncHandler(async (req, res) => {
    const { historyId } = req.params;

    // Check if Invalid historyId
    if (!isValidObjectId(historyId)) {
        throw new ApiError(400, "Invalid historyId!");
    }

    const deletedVideoHistory = await WatchHistory.findByIdAndDelete(historyId);

    // Check if document with historyId exists
    if (!deletedVideoHistory) {
        throw new ApiError(404, "Video not found in history");
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Video removed from watch history successfully"
    ));
});

// clear watch history
const clearWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id

    await WatchHistory.deleteMany({ owner: userId })

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Watch history cleared successfully for the current user."
    ))
})

// toggle watch history pause status
const toggleWatchHistoryPauseStatus = asyncHandler(async (req, res) => {
    const { user } = req;

    // Toggle the watch history pause status
    user.isWatchHistoryPaused = !user.isWatchHistoryPaused;
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(
        200,
        { watchHistoryPaused: user.watchHistoryPaused },
        `Watch history pause status toggled successfully: ${user.watchHistoryPaused ? 'Paused' : 'Resumed'}`
    ));
});

// get watch history videos
const getWatchHistoryVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const userId = req.user._id;

    const aggregate = WatchHistory.aggregate([
        {
            $match: {
                owner: new Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videoId",
                foreignField: "_id",
                as: "watchHistoryVideo",
                pipeline: [
                    {
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
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $addFields: {
                watchHistoryVideo: {
                    $first: "$watchHistoryVideo"
                }
            }
        },
        {
            $project: {
                videoId: 1,
                owner: 1,
                watchHistoryVideo: 1,
                createdAt: 1
            }
        }
    ])

    WatchHistory.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "Watch History fetched successfully"
            ))
        })
        .catch(function (error) {
            throw error
        })
})

export {
    addVideoToWatchHistory,
    removeVideoFromWatchHistory,
    clearWatchHistory,
    toggleWatchHistoryPauseStatus,
    getWatchHistoryVideos
};