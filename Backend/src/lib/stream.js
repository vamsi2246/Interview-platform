import {StreamChat} from "stream-chat";
import {ENV} from "./env.js"

const apikey=ENV.STREAM_API_KEY
const apiSecret=ENV.STREAM_API_SECRET

if(!apikey || !apiSecret){
    console.error("Stream STREAM_API_KEY OR STREAM_API_SECRET is missing")
}

export const chatClient=StreamChat.getInstance(apikey,apiSecret)

export const upsertStream=async(userData)=>{
    try{
        await chatClient.upsertUser(userData)
        return userData
    }catch(error){
        console.error("Error upserting Stream User: ",error)

    }
}

export const deleteStream=async(userId)=>{
    try{
        await chatClient.deleteUser(userId)
        console.log("Stream user successfully:", userId)
    }catch(error){
        console.error("Error deleting the Stream User: ",error)

    }
}      

