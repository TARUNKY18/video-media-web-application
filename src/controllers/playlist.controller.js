import { PLaylist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!(name || description)){
        throw new ApiError(401, "Name and description required")
    }

    const newPLaylist = PLaylist.create({
        name,
        description,
        owner: req.user._id
    })

    return res.status(201)
    .json(
        new ApiResponse(
            200, newPLaylist, "Playlist has been created"
        )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if(!userId){
        throw new ApiError(401, "User Id is required")
    }

    const fetchedPlaylist = await PLaylist.find({owner: userId})
    .populate("owner", "name email")

    if(fetchedPlaylist.length === 0){
        throw new ApiError(404, "No playlists found")
    }

    return res.status(201)
    .json(
        new ApiResponse(
            200, fetchedPlaylist, "Playlists have been fetched successfully"
        )
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if(!playlistId){
        throw new ApiError(401, "Playlist Id is required") 
    }

    const playlist =  await PLaylist.findById(playlistId)

    if(playlist.length === 0){
        throw new ApiError(404, "No playlists found")
    }

    return res.status(201)
    .json(
        new ApiResponse(200, playlist, "Playlist has been fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if(!(playlistId && videoId)){
        throw new ApiError(401, "Both Playlist Id and Video Id are required")
    }

    try {
        
        const playlist = await PLaylist.findById(playlistId)

        if(!playlist){
            throw new ApiError(404, "Playlist not found")
        }

        if(playlist.videos?.includes(videoId)){
            return res.status(407)
            .json(
                new ApiResponse(
                    407,
                    playlist,
                    "Video already exists in the playlist"
                )
            )
        }

        playlist.videos.push(videoId)
        await playlist.save()

        return res.status(201)
        .json(
            new ApiResponse(200, playlist, "Video has been added to the playlist")
        )

    } catch (error) {
        throw new ApiError(500, "Something went wrong while adding the video into the playlist")
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if(!(playlistId && videoId)){
        throw new ApiError(401, "Playlist Id and Video Id are required")
    }

    try {
        const playlist = await PLaylist.findById(playlistId);

        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }

        const videoIndex = playlist.videos.indexOf(videoId)
        if (videoIndex === -1) {
            return res.status(404)
            .json(
                new ApiResponse(
                    404, null, "Video not found in playlist"
                )
            )
        }

        playlist.video.splice(videoIndex, 1);
        await playlist.save();

        return res.status(201)
        .json(
            new ApiResponse(
                200, playlist, "Video removed from playlist"
            )
        )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting a video from the playlist")
    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if(!playlistId){
        throw new ApiError(401, "Playlist Id is required")
    }

    const deletedPlaylist =  await PLaylist.findByIdAndDelete(playlistId)

    if(deletedPlaylist.length === 0){
        throw new ApiError(404, "No playlists found")
    }

    return res.status(201)
    .json(
        new ApiResponse(
            200, {}, "PLaylist deleted successfully"
        )
    )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const {name, description} = req.body

    if(!playlistId){
        throw new ApiError(401, "Playlist Id is required")
    }

    if(!(name || description)){
        throw new ApiError(401, "Updated name or description is required")
    }

    const updatedPlaylist =  await PLaylist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    )

    return res.status(201)
    .json(
        new ApiResponse(
            200, updatedPlaylist, "PLaylist deleted successfully"
        )
    )

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}