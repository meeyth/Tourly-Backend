/*import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


// console.log("access_token_expiry: ", process.env.access_token_expiry);

app.use(cors({
    origin: [process.env.dev_cors_origin, process.env.prod_cors_origin],
    // origin: "http://localhost:5173",
    credentials: true,

}))

// console.log("CORS Added");


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

/*
url response request-
error,req,res,next- from url 
next is a flag for middleware
 




//routes import 
import userRouter from './routes/user.routes.js';

//import userRouter from './routes/user.routes.js'
import commentRouter from './routes/comment.routes.js'

import followRouter from './routes/follow.routes.js'
//import authRouter from './routes/auth.routes.js'


// Test route
app.get("/api/v1/test", (req, res, next) => {
    return res.json({
        message: "Working..."
    })
})

//routes declaration
app.use("/api/v1/users", userRouter)
//http://localhost:8000/api/v1/users/register

//app.use("/api/v1/blog", commentRouter)

//app.use("/api/v1/blog", likeRouter)

//app.use("/api/v1/blog", blogRouter)

app.use("/api/v1/users", followRouter)



//app.use("/api/v1/auth", authRouter)

export { app };
*/
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [process.env.dev_cors_origin, process.env.prod_cors_origin],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routers
import userRouter from "./routes/user.routes.js";
import commentRouter from "./routes/comment.routes.js";
import followRouter from "./routes/follow.routes.js";
import postRouter from "./routes/post.routes.js"; 

// Test route
app.get("/api/v1/test", (req, res) => {
  res.json({ message: "API working fine!" });
});

// Mount routers with clear base paths
app.use("/api/v1/users", userRouter);          // User routes: register, login, profile, etc.
app.use("/api/v1/posts", postRouter);          // Post routes: create, get, like posts, etc.
app.use("/api/v1/comments", commentRouter);    // Comment routes: add, get, delete comments
app.use("/api/v1/follow", followRouter);       // Follow routes: follow/unfollow users, get followers/following

// Note: Protect routes inside each router with verifyJWT middleware as needed.

export { app };
