import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    
    location: {
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    
    images: [{ type: String }], // Array of image URLs

    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
     likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);
export default Post;
