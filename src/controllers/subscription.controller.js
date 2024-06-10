import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";



const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if(!channelId){
        throw new ApiError(401, "Channel Id is required")
    }

    Subscription.findByIdAndUpdate(
        channelId,
        {
            $set: {
                
            }
        }
    )
})



export {
    toggleSubscription
}