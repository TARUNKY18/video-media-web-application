import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";



const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const { userId } = req.user._id

    if (!channelId) {
        throw new ApiError(400, "Channel ID is missing")
    }

    const checkUser = await Subscription.find({
        $and: [{ channel: channelId }, { subscriber: userId }]
    })

    if (checkUser[0]) {
        await Subscription.findByIdAndDelete(checkUser[0]._id)
        return res.status(200)
            .json(
                new ApiResponse(200, {}, "Unsubscribed")
            )
    }

    else {
        const subscribed = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
        if (!subscribed) {
            throw new ApiError(500, "subscription failed")
        }
        
        return res.status(200)
            .json(
                new ApiResponse(200, subscribed, "Subscribed")
            )
    }
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId){
        throw new ApiError(401, "Subscriber Id is required")
    }

    const subscribers = await Subscription.find({ channel: subscriberId })
    .select("-subscriber -channel")

    return res.status(201)
    .json(
        new ApiResponse(
            200, subscribers.length, "Subscribers fetched Successfully"
        )
    )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if(!channelId){
        throw new ApiError(401, "Channel Id is required")
    }

    const channels = await Subscription.find({ subscriber: channelId })
    
    const channelObj = {
        numOfChannels : channels.length,
        channels
    }

    return res.status(201)
    .json(
        new ApiResponse(
            200, channelObj, "Number of Subscribed Channels are fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}