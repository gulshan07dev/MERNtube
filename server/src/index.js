import { config } from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js";

config({ path: "./.env" }) 
const PORT = process.env.PORT || 800;

connectDB()
.then(() => {
    app
    .listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    })
    .on("error", (error) => {
        console.log(`Server Error: ${error}`);
    })
})
.catch((error) => {
    console.log(`MONGODB CONNECTION Failed: ${error}`);
});