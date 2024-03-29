import { Tweet } from "../models/tweet.model.js"
import { Like } from "../models/like.model.js"
import { User } from "../models/user.model.js"
import { Types, isValidObjectId } from "mongoose"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Comment } from "../models/comment.model.js"

// create tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user._id;

    // check if content is empty
    if (!content) {
        throw new ApiError(400, "Tweet Content is required!")
    }

    const tweet = await Tweet.create({
        content,
        owner: userId
    })

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while creating tweet!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Tweet created successfully"
    ))
})

// update tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { tweetId } = req.params;
    const userId = req.user._id;

    // Check if Invalid tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId!");
    }

    // Check if newContent is provided
    if (!content) {
        throw new ApiError(400, "content is required!");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found!");
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to update this tweet!");
    }

    // Update tweet with new content
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,
        { $set: { content } },
        { new: true }
    );

    if (!updatedTweet) {
        throw new ApiError(500, "Something went wrong while updating the tweet, try again");
    }

    return res.status(200).json(new ApiResponse(
        200,
        { tweet: updatedTweet },
        "Tweet updated successfully"
    ));
});

// delete tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    // check if Invalid tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId")
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found!");
    }

    if (tweet?.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to delete this tweet!");
    }

    // Delete the likes associated with this tweet
    await Like.deleteMany({ tweet: tweetId });

    // Find all comments associated with the tweet
    const comments = await Comment.find({ tweet: tweetId }).select('_id');

    // Extract comment IDs
    const commentIds = comments.map(comment => comment._id);

    // Delete likes associated with comments
    await Like.deleteMany({ comment: { $in: commentIds } });

    // Delete comments
    await Comment.deleteMany({ tweet: tweetId });

    // delete the tweet
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
        throw new ApiError(500, "Something went wrong while deleting tweet!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Tweet deleted successfully"
    ));
});

// get tweet by tweetId
const getTweetById = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    // check if invalid tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId!");
    }

    // check if tweet not find
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "tweet not found!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        { tweet },
        "Tweet fetched successfully"))
})

// get user tweets
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // check if Invalid userId
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId!");
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new ApiError(404, "User not find!");
    }

    const aggregate = Tweet.aggregate([
        {
            $match: {
                owner: new Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "tweetLikes"
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                tweetLikesCount: { $size: "$tweetLikes" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$tweetLikes.owner"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                owner: 1,
                tweetLikesCount: 1,
                isLiked: 1,
                createdAt: 1
            }
        }
    ])

    Tweet.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "Tweets fetched successfully"
            ));
        })
        .catch(function (error) {
            throw error;
        });
})


export {
    createTweet,
    getUserTweets,
    updateTweet,
    getTweetById,
    deleteTweet
}