import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use process.env.MONGO_URI 
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB connected at host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
