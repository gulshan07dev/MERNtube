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

// routes declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);

// error middlewares
import errorMiddleware from "./middlewares/error.middleware.js";
app.use(errorMiddleware);

export default app;