import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Types, isValidObjectId } from "mongoose"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

// toggle video like
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    // Check if Invalid videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found!");
    }

    // Toggle like
    const videoLike = await Like.findOne({ video: videoId, owner: userId });

    let unlike;
    let like;

    if (videoLike) {
        unlike = await Like.deleteOne({ video: videoId, owner: userId });
    } else {
        like = await Like.create({
            video: videoId,
            owner: userId
        });
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        `Video ${unlike ? "unlike" : "like"} successfully`
    ));
});

// toggle comment like
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user._id

    // Check if Invalid commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId!");
    }

    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found!");
    }

    // Toggle like
    const commentLike = await Like.findOne({ comment: commentId, owner: userId });

    let unlike;
    let like;

    if (commentLike) {
        unlike = await Like.deleteOne({ comment: commentId, owner: userId });
    } else {
        like = await Like.create({
            comment: commentId,
            owner: userId
        });
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        `Comment ${unlike ? "unlike" : "like"} successfully`
    ));
})

// toggle tweet like
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    // Check if Invalid tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId!");
    }

    // Check if the tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found!");
    }

    // Toggle like
    const tweetLike = await Like.findOne({ tweet: tweetId, owner: userId });

    let unlike;
    let like;

    if (tweetLike) {
        unlike = await Like.deleteOne({ tweet: tweetId, owner: userId });
    } else {
        like = await Like.create({ tweet: tweetId, owner: userId });
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        `Tweet ${unlike ? "unlike" : "like"} successfully`
    ));
})

// get user liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const aggregate = Like.aggregate([
        {
            $match: {
                $and: [
                    { owner: new Types.ObjectId(userId) },
                    { "video": { "$exists": true } }
                ]
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos",
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
                likedVideos: {
                    $first: "$likedVideos"
                }
            }
        },
        {
            $project: {
                likedVideos: 1
            }
        }
    ])

    Like.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "Liked Videos fetched successfully"
            ))
        })
        .catch(function (error) {
            throw error
        })
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}