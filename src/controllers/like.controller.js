import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Like } from "../models/like.model.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(401, "Video Id is required")
    }

    const checkLikedVideo = await Like.find({
        video: videoId,
        likedBy: req.user._id
    })

    if (checkLikedVideo[0]) {
        await Like.findByIdAndDelete(checkLikedVideo[0]._id)
        return res.status(200)
            .json(
                new ApiResponse(200, {}, "Like removed")
            )
    } else {
        const likedVideo = await Like.create({
            likedBy: req.user._id,
            video: videoId
        })
        if (!likedVideo) {
            throw new ApiError(500, "Unable to Like")
        }

        return res.status(200)
            .json(
                new ApiResponse(200, likedVideo, "Liked the video")
            )
    }    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if(!commentId){
        throw new ApiError(401, "Comment Id is required")
    }

    const checkLikedComment = await Like.find({
        comment: commentId,
        likedBy: req.user._id
    })

    if (checkLikedComment[0]) {
        await Like.findByIdAndDelete(checkLikedComment[0]._id)
        return res.status(200)
            .json(
                new ApiResponse(200, {}, "Like to the comment has been removed")
            )
    }
    else {
        const likedComment = await Like.create({
            likedBy: req.user._id,
            comment: commentId
        })
        if (!likedComment) {
            throw new ApiError(500, "Unable to Like the comment")
        }

        return res.status(200)
            .json(
                new ApiResponse(200, likedComment, "Liked the comment")
            )
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id is required");
    }

    const checkLikedTweet = await Like.find({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if (checkLikedTweet[0]) {
        await Like.findByIdAndDelete(checkLikedTweet[0]._id)
        return res.status(200)
            .json(
                new ApiResponse(200, {}, "Like removed from the tweet")
            )
    } 
    else {
        const likedTweet = await Like.create({
            likedBy: req.user._id,
            tweet: tweetId
        })
        if (!likedTweet) {
            throw new ApiError(500, "Unable to Like the tweet")
        }

        return res.status(200)
            .json(
                new ApiResponse(200, likedTweet, "Liked the tweet")
            )
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    
   const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true }
    }).populate("video")

    return res.status(200)
    .json(
        new ApiResponse(
            200, likedVideos, "Liked Videos fetched successfully"
        )
    )
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}