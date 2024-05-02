import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Types, isValidObjectId } from "mongoose"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

// toggle subscription by channel id
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user?._id;

    // check if Invalid channelId
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    // check if channel not available
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not find!");
    }

    // prevent subscribe to own channel
    if (channelId.toString() === userId) {
        throw new ApiError(400, "You cannot subscribe your own channel!");
    }

    // toggle the subscription
    const subscription = await Subscription.findOne({ channel: channelId, subscriber: userId });

    let unSubscribe;
    let subscribe;

    if (subscription) {
        // un-subscribe
        unSubscribe = await Subscription.findByIdAndDelete(subscription?._id);
    } else {
        // subscribe
        subscribe = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        `${unSubscribe ? "unSubscribe" : "Subscribe"} successfully`
    ))
})

// get subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // check if Invalid channelId
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    // check if channel not available
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not find!");
    }

    const aggregate = Subscription.aggregate([
        {
            $match: {
                channel: new Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberList",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            isSubscribed: {
                                $cond: {
                                    if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            isSubscribed: 1,
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
                subscriberList: {
                    $first: "$subscriberList"
                }
            }
        },
        {
            $project: {
                subscriberList: 1
            }
        }
    ])

    Subscription.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {

            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "Subscriber lists fetched successfully"
            ))
        })
        .catch(function (error) {
            throw error
        })
})

// get channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // check if Invalid subscriberId
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriberId");
    }

    // check if subscriber not available
    const subscriber = await User.findById(subscriberId);
    if (!subscriber) {
        throw new ApiError(404, "Subscriber not find!");
    }

    const aggregate = Subscription.aggregate([
        {
            $match: {
                subscriber: new Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannelList",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscribedChannelList: {
                    $first: "$subscribedChannelList"
                }
            }
        },
        {
            $project: {
                subscribedChannelList: 1
            }
        }
    ])

    Subscription.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result }
            ))
        })
        .catch(function (error) {
            throw error
        })
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}