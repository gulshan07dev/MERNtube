import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";
import { Types, isValidObjectId } from "mongoose";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const fetchComments = async (req, res, idType, id, page, limit, sortBy, sortType) => {
    // Define aggregation pipeline stages
    const pipeline = [];

    // Match comments with the specified ID
    pipeline.push({
        $match: {
            [idType]: new Types.ObjectId(id)
        }
    });

    // Populate owner field with user information
    pipeline.push({
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
    });

    // Populate commentLikes field with likes associated with each comment
    pipeline.push({
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "comment",
            as: "commentLikes"
        }
    });

    // Sort comments if sortBy and sortType are provided
    if (sortBy && sortType) {
        const sortDirection = sortType === "acc" ? 1 : -1;
        pipeline.push({
            $sort: {
                [sortBy]: sortDirection
            }
        });
    }

    // Add additional fields to each comment document
    pipeline.push({
        $addFields: {
            owner: { $first: "$owner" },
            commentLikesCount: { $size: "$commentLikes" },
            isLiked: {
                $in: [req.user?._id, "$commentLikes.owner"]
            }
        }
    });

    // Project only required fields
    pipeline.push({
        $project: {
            content: 1,
            [idType]: 1,
            owner: 1,
            isLiked: 1,
            commentLikesCount: 1,
            createdAt: 1
        }
    });

    // Perform aggregation
    const aggregate = Comment.aggregate(pipeline);

    // Paginate aggregated results
    return Comment.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                `${idType.charAt(0).toUpperCase() + idType.slice(1)} comments fetched successfully`
            ));
        })
        .catch(function (error) {
            throw error;
        });
};

const addComment = async (req, res, id, idType) => {
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    if (!isValidObjectId(id)) {
        throw new ApiError(400, `Invalid ${idType}Id!`);
    }

    const Model = idType === 'video' ? Video : Tweet;
    const document = await Model.findById(id);
    if (!document) {
        throw new ApiError(404, `${idType.charAt(0).toUpperCase() + idType.slice(1)} not found!`);
    }

    const comment = await Comment.create({
        content,
        [idType]: id,
        owner: userId
    });

    if (!comment) {
        throw new ApiError(500, "Something went wrong while adding comment!")
    }

    const commentType = idType.charAt(0).toUpperCase() + idType.slice(1);

    const commentData = await Comment.aggregate([
        {
            $match: {
                _id: comment?._id
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
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                commentLikesCount: 0,
                isLiked: false
            }
        },
        {
            $project: {
                content: 1,
                [idType]: 1,
                owner: 1,
                isLiked: 1,
                commentLikesCount: 1,
                createdAt: 1
            }
        }
    ]);

    res.status(201).json(new ApiResponse(
        201,
        { comment: commentData[0] },
        `Comment added to ${commentType} successfully`
    ));
};

// add comment to video
const addCommentToVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    await addComment(req, res, videoId, 'video');
});

// add comment to tweet
const addCommentToTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    await addComment(req, res, tweetId, "tweet");
});


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
    const { videoId } = req.params;
    const { page = 1, limit = 10, sortBy, sortType } = req.query;

    // check if Invalid videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
    }

    // Check if video with given videoId exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found!");
    }

    await fetchComments(req, res, "video", videoId, page, limit, sortBy, sortType);
});

// get tweet comment
const getTweetComment = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { page = 1, limit = 10, sortBy, sortType } = req.query;

    // check if Invalid tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId!");
    }

    // Check if tweet with given tweetId exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found!");
    }

    await fetchComments(req, res, "tweet", tweetId, page, limit, sortBy, sortType);
});



export {
    addCommentToVideo,
    addCommentToTweet,
    updateComment,
    deleteComment,
    getVideoComment,
    getTweetComment
}
