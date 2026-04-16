import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const url = process.env.MONGODB_URL;
        if (!url) {
            console.error("❌ MONGODB_URL is not defined in .env file");
            return;
        }
        
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log("✅ DB Connected Successfully");
    } catch (error) {
        console.error("❌ DB Connection Error Details:");
        console.error("   Message:", error.message);
        console.error("   Code:", error.code);
        if (error.message.includes("querySrv ECONNREFUSED")) {
            console.error("   💡 Tip: This is a DNS issue. Try using Google DNS (8.8.8.8) or check your internet connection.");
        }
    }
}
export default connectDb