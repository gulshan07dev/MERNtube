import { config } from "dotenv"
import connectDB from "./db/index.js"
config({ path: "./.env" })


connectDB();