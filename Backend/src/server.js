import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { connect } from "mongoose";
import cors from 'cors'
const app=express()

app.use(express.json())
app.use(cors({origin:ENV.ClIENT_URL,Credentials:true}))

app.get("/",(req,res)=>{
    res.status(200).json({msg:"success from api"})
})

const startServer= async ()=>{
    try{
        await connectDB()
        app.listen(ENV.PORT,()=>{
        console.log("server running on port:",ENV.PORT)
})
    }catch(error){
        console.error("Error in starting the server")
    }
    
}
startServer()