import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";


const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if(!content){
        throw new ApiError(401, "Content is required")
    }

    const tweet = await Tweet.create(
        {
            content,
            owner: req.user._id
        }
    )

    return res.status(200)
    .json(
        new ApiResponse(
            200, tweet, "Tweet has been added successfully"
        )
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        return res.status(404)
        .json(
            new ApiResponse(
                404, {}, 'Invalid tweet ID'
            )
        )
    }

    const fetchedTweet = await Tweet.find({ owner: userId }) 
    
    if(fetchedTweet.length === 0){
        return res.status(404)
        .json(
            new ApiResponse(
                404, {}, "User has zero tweets"
            )
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200, fetchedTweet, "Tweet(s) fetched successfully"
        )
    )


})

const updateTweeet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { tweet } = req.body

    if(!tweetId){
        throw new ApiError(401, "Tweet Id is required")
    }

    if(!tweet){
        throw new ApiError(401, "Updated Tweet is required")
    }

    const fetchedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: tweet,
                update: true
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
    .json(
        new ApiResponse(
            200, fetchedTweet, "Tweet has been updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if(!tweetId){
        throw new ApiError(401, "Tweet Id is required")
    }

    const deletedTweet =  await Tweet.findByIdAndDelete(tweetId)

    if(deletedTweet.deletedCount === 0){
        throw new ApiError(404, "Tweet not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200, deletedTweet, "Tweet has been deleted successfully"
        )
    )
})


export {
    createTweet,
    getUserTweets,
    updateTweeet,
    deleteTweet
}