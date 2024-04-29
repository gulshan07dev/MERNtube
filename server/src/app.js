import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(cookieParser());
app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended: true, limit: "20kb"}));
app.use(express.static("public"))

// import routes
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import WatchHistoryRouter from "./routes/watchHistory.routes.js";
import WatchLaterRouter from "./routes/watchLater.routes.js";
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import feedbackRouter from "./routes/feedback.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"

// routes declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/watch_history", WatchHistoryRouter);
app.use("/api/v1/watch_later", WatchLaterRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboards", dashboardRouter);
app.use("/api/v1/feedbacks", feedbackRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);

// error middlewares
import errorMiddleware from "./middlewares/error.middleware.js";
app.use(errorMiddleware);

export default app;