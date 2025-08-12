// require('dotenv').config({ path: './env' })

/*import "dotenv/config";
import express from "express";


const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});*/


import "dotenv/config";
console.log("Mongo URI:", process.env.MONGO_URI);

import { app } from "./app.js"; // ✅ correct relative path

import connectDB from "./db/index.js"; // ✅ import DB connection

const PORT = process.env.PORT || 8000;

// Connect to MongoDB, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });



