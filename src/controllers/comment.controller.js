import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";


const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { limit = 20, sortType = 'asc' } = req.query
    const page = parseInt(req.query.p) || 0
    const sortDirection = sortType === 'asc' ? 1 : -1


    if(!videoId){
        throw new ApiError(401, "Video Id is required")
    }

    try {
        const fetchedComments = await Comment.find({ video: videoId })
            .sort({ createdAt: sortDirection }) 
            .skip(page * limit)
            .limit(parseInt(limit))

        if (fetchedComments.length === 0) {
            return res.status(404)
            .json(
                new ApiResponse(
                    200, {}, "No comments found for the video"
                )
            )
        }

        return res.status(201)
        .json(
            new ApiResponse(
                200,
                fetchedComments,
                "Comments fetched successfully",
            )
        )
    } 
    catch (error) {
        throw new ApiError(500, "Something went wrong while fetching the comments")
    }
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { comment } = req.body

    if(!(videoId && comment)){
        throw new ApiError(401, "Video Id and comment is required")
    }

    const newComment = await Comment.create({
        content: comment,
        video: videoId,
        owner: req.user._id
    })

    return res.status(201)
    .json(
        new ApiResponse(200, newComment, "New comment has been added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const { comment } = req.body
    const { commentId } = req.params

    if(!(comment && commentId)){
        throw new ApiError(401, "Comment Id and content is required")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: comment,
                update: true
            }
        }, 
        {
            new: true
        }
    )

    return res.status(201)
    .json(
        new ApiResponse(200, updatedComment, "Comment has been updated successuflly")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if(!commentId){
        throw new ApiError(401, "Comment Id is required")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if(deleteComment.deletedCount === 0){
        throw new ApiError(404, "Comment not found")
    }

    return res.status(201)
    .json(
        new ApiResponse(200, {}, "Comment has been deleted successfully")
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}