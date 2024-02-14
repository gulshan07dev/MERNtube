import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";
import { Types, isValidObjectId } from "mongoose";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

// add comment to video
const addCommentToVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found!");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    });

    res.status(201).json(new ApiResponse(
        201,
        { comment },
        "Comment added successfully"
    ));
});

// add comment to tweet
const addCommentToTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId!");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found!");
    }

    const comment = await Comment.create({
        content,
        tweet: tweetId,
        owner: userId
    });

    res.status(201).json(new ApiResponse(
        201,
        { comment },
        "Comment added successfully"
    ));
})

// update comment by commentId
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { newContent } = req.body;
    const userId = req.user._id;

    // check if invalid commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId!");
    }

    if (!newContent) {
        throw new ApiError(400, "New Content is required!");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found!");
    }

    if (comment.owner.toString() !== userId) {
        throw new ApiError(403, "You do not have permission to update this comment!");
    }

    // update comment with new content
    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
            content: newContent
        }
    }, { new: true })

    if (!updatedComment) {
        throw new ApiError(404, "Something went wrong while updating comment!");
    }

    res.status(201).json(new ApiResponse(
        201,
        { updatedComment },
        "Comment updated successfully"
    ));
})

// delete comment by commentId
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // check if invalid commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId!");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found!");
    }

    if (comment.owner.toString() !== userId) {
        throw new ApiError(403, "You do not have permission to update this comment!");
    }

    // delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
        throw new ApiError(404, "Something went wrong while deleting comment!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Comment deleted successfully"
    ))
})

// get video comment
const getVideoComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    // check if Invalid videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
    }

    const aggregate = Comment.aggregate([
        {
            $match: {
                video: new Types.ObjectId(videoId)
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
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "video",
                foreignField: "video",
                as: "commentLikes"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                commentLikesCount: {
                    $size: "$commentLikes"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$commentLikes"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                content: 1,
                video: 1,
                owner: 1,
                isLiked: 1,
                commentLikesCount: 1,
                createdAt: 1
            }
        }
    ])

    Comment.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "Video Comment fetched successfully"
            ))
        })
        .catch(function (error) {
            throw error
        })
})

// get tweet comment
const getTweetComment = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { page = 1, limit = 10 } = req.query

    // check if Invalid tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId!");
    }

    const aggregate = Comment.aggregate([
        {
            $match: {
                tweet: new Types.ObjectId(tweetId)
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
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "commentLikes"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                commentLikesCount: {
                    $size: "$commentLikes"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$commentLikes.owner"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                content: 1,
                tweet: 1,
                owner: 1,
                isLiked: 1,
                commentLikesCount: 1,
                createdAt: 1
            }
        }
    ])

    Comment.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "Tweet Comment fetched successfully"
            ))
        })
        .catch(function (error) {
            throw error
        })
})


export {
    addCommentToVideo,
    addCommentToTweet,
    updateComment,
    deleteComment,
    getVideoComment,
    getTweetComment
}
