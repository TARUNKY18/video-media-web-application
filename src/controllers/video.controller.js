import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js";
// import { User } from "../models/user.model.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { limit = 10, sortType = 'desc' } = req.query
    const page = req.query.p || 0
    const videosPerPage = limit

    const videos = await Video.find()
    .sort(sortType)
    .skip(page * videosPerPage)
    .limit(videosPerPage)

    return res.status(200)
    .json(
        new ApiResponse(
            200, videos, "All videos fetched successfully"
        )
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const {title, description, isPublished} = req.body

    if(!(title && description)){
        throw new ApiError(403, "Please enter title and description")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path

    if(!videoLocalPath){
        throw new ApiError(400, "Please upload a video")
    }

    let thumbnailLocalPath;
    if(req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0){
        thumbnailLocalPath = req.files.thumbnail[0].path
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail =  await uploadOnCloudinary(thumbnailLocalPath)

    if(!(video && thumbnail)){
        throw new ApiError(400, "Video and Thumbnail not uploaded on cloudinary")
    }

    const videoObj = {
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: video.duration,
        isPublished,
        owner: req.user
    }

    return res.status(200)
    .json(
        new ApiResponse(200, videoObj, "Video uploaded successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(401, "Videos Id is required")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(400, "Video not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, video, "Requested video is fetched")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if(!videoId){
        throw new ApiError(401, "Video Id is required")
    }

    if(!(title || description)){
        throw new ApiError(400, "New title or description is required")
    }

    const thumbnailLocalPath = req.file?.path

    if(!thumbnailLocalPath){
        throw new ApiError(401, "Video is required")
    }

    const thumbnail =  await uploadOnCloudinary(videoLocalPath)

    const updadtedVideoDeatils = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url
            },
        },{
            new: true
        }
    )


    return res.status(200)
    .json(
        new ApiResponse(
            200, updadtedVideoDeatils, "Video details are updated successfully"
        )
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(401, "Video Id is required")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if(!deletedVideo){
        throw new ApiError(405, "Video not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!videoId){
        throw new ApiError(401, "Video Id is required")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(401, "Video not found")
    }

    const updatedVideoStatus = Video.findByIdAndUpdate(
        video,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
    .json(
        new ApiResponse(200, updatedVideoStatus, "Video status updated successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}