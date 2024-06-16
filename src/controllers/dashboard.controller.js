import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js"
 
const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id

    if(!channelId){
        throw new ApiError(401, "Channel Id is required")
    }

    try {
        const videos = await Video.find({ owner: channelId })

        const totalViews = videos.reduce((sum, video) => sum + video.views, 0)
        const videoViews = videos.map(video => ({ videoId: video._id, title: video.title, views: video.views }))

        const totalVideos = videos.length

        const totalSubscribers = await Subscription.countDocuments({ channel: channelId })

        const videoIds = videos.map(video => video._id)
        const totalLikes = await Like.countDocuments({ video: { $in: videoIds } })

        const stats = {
            totalViews,
            totalSubscribers,
            totalVideos,
            totalLikes,
            videoViews
        };

        return res.status(201)
        .json(new ApiResponse(200, stats, "Channel stats fetched successfully"))
    }
     catch (error) {
       throw new ApiError(500, "Something went wrong while fetching the video stats")
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {

    const videos = await Video.find({ owner: req.user._id })

    if(videos.length === 0){
        throw new ApiError(404, "No videos found")
    }

    return res.status(201)
    .json(
        new ApiResponse(200, videos, "All the videos in the channel are fetched successfully")
    )
}) 

export {
    getChannelStats,
    getChannelVideos
}