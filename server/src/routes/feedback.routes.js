import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { sendFeedback } from "../controllers/feedback.controller.js"

const router = Router()
router.use(verifyJwt)

router.route("/").post(sendFeedback)

export default router