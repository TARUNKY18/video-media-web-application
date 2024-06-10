import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweeet } from "../controllers/tweet.controller.js";


const router = Router()

router.route(verifyJWT)

router.route("/create-tweet").post(createTweet)
router.route("/update-tweet").patch(updateTweeet)
router.route("/delete-tweet").delete(deleteTweet)
router.route("/get-user-tweets").get(getUserTweets)

export default router