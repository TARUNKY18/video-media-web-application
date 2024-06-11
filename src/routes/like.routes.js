import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller";

const router = Router()

router.use(verifyJWT)

router.route("/toggle-video-like/:videoId").post(toggleVideoLike)
router.route("/toggle-comment-like/:commentId").post(toggleCommentLike)
router.route("/toggle-tweet-like/:tweetId").post(toggleTweetLike)
router.route("/all-liked-videos").get(getLikedVideos)

export default router