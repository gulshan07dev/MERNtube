import { WatchLater } from "../models/watchLater.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Types, isValidObjectId } from "mongoose";
import ApiError from ".././utils/ApiError.js"
import ApiResponse from ".././utils/ApiResponse.js"

// add video to watch later
const addVideoToWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    // Check if Invalid videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!")
    }

    // if the video is not already in watch later list
    const existingWatchLaterVideo = await WatchLater.findOne({
        videoId,
        owner: userId
    });
    let watchLaterVideo;
    if (!existingWatchLaterVideo) {
        watchLaterVideo = await WatchLater.create({
            videoId,
            owner: userId
        })
    } else {
        watchLaterVideo = existingWatchLaterVideo;
    }

    if (!watchLaterVideo) {
        throw new ApiError(500, "Something went wrong while adding video to watch later!");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            { watchLaterVideo },
            "Video added to watch later successfully"
        )
    )
})

// remove video from watch later
const removeVideoFromWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    // Check if Invalid videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!")
    }

    // check if not find video in user watch later
    const isVideoInWatchLater = await WatchLater.findOne({
        videoId,
        owner: userId
    })
    if (!isVideoInWatchLater) {
        throw new ApiError(404, "Video not find in watch later!")
    }

    const deletedVideoFromWatchLater = await WatchLater.deleteOne({
        videoId,
        owner: userId
    })

    if (!deletedVideoFromWatchLater) {
        throw new ApiError(500, "Something went wrong while removing video from watch later!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Video removed from watch later successfully"
    ))
})

// get user watch later
const getUserWatchLater = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const aggregate = WatchLater.aggregate([
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
                as: "watchLaterVideo",
                pipeline: [
                    {
                        $match: {
                            isPublished: true
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
                    },
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            owner: 1,
                            views: 1,
                            duration: 1,
                            createdAt: 1,
                        }
                    }
                ]
            }
        },
        {
            $match: { "watchLaterVideo._id": { "$exists": true } }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $addFields: {
                watchLaterVideo: {
                    $first: "$watchLaterVideo"
                }
            }
        },
        {
            $project: {
                watchLaterVideo: 1
            }
        }
    ])

    WatchLater.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "User watch later fetched successfully"
            ))
        })
        .catch(function (error) {
            throw error
        })
})

export {
    addVideoToWatchLater,
    removeVideoFromWatchLater,
    getUserWatchLater
};
