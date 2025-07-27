import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "https://example.com/default-profile.jpg" },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;
