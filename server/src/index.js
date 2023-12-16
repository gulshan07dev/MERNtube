import { config } from "dotenv"
config({ path: "./.env" }) 
import connectDB from "./db/index.js"

import app from "./app.js";
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