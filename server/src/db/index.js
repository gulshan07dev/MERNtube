import mongoose from "mongoose"

const connectDB = async function () {
    try {
        console.log(process.env.MONGO_URI)
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGODB CONNECTED: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`MONGODB CONNECTION Failed: ${error}`);
        process.exit(1);
    }
}

export default connectDB;