import { config } from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js";

config({ path: "./.env" }) 
const PORT = process.env.PORT || 800;

connectDB(); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});