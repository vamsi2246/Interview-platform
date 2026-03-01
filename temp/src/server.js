import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { connect } from "mongoose";
import path from 'path'
import cors from 'cors'
import { serve } from "inngest/express"
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from '@clerk/express'
import { protectRoute } from "./middlewares/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"

const app = express()

app.use(express.json())
const allowedOrigins = [ENV.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"]
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))
app.use(clerkMiddleware())
app.use("/api/inngest", serve({ client: inngest, functions }))
app.use("/api/chat", chatRoutes)
app.use("/api/session", sessionRoutes)
const __dirname = path.resolve()


app.get("/", (req, res) => {
    res.status(200).json({ msg: "success from api" })
})

app.get("/video", protectRoute, (req, res) => {
    res.status(200).json({ msg: "Video call is On" })
})

// if(ENV.NODE_ENV==="production"){
//     app.use(express.static(Path.join(__dirname,"../frontend/dist")))

//     app.get("/{*any",(req,res)=>{
//         res.sendFile(Path.join(__dirname,"../frontend","dist","indexedDB.html"))
//     })
// }



const startServer = async () => {
    try {
        await connectDB()
        app.listen(ENV.PORT, () => {
            console.log("server running on port:", ENV.PORT)
        })
    } catch (error) {
        console.error("Error in starting the server")
    }

}
startServer()