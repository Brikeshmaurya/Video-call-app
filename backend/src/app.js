import express from 'express';
import mongoose from 'mongoose';
import { createServer} from "node:http"
import  {connectToServer}  from './controller/socketManager.js';
import cors from 'cors'
import userRoutes from './routes/users.routes.js';
import dotenv from 'dotenv';
dotenv.config();



const app = express();
const server = createServer(app);
const io = connectToServer(server);

app.set("port",(process.env.PORT || 8000));
app.use(cors({
 origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));


app.use(express.json({limit:"1mb"}));
app.use(express.urlencoded({ limit : "1mb" , extended : true }));
app.use("/api/v1/users" , userRoutes);


const start = async () =>{
    try{
    const connectionDB = await mongoose.connect(process.env.MONGO_URl);
    console.log(`✅ Mongo Connected to DB Host: ${connectionDB.connection.host}`);
    }
    catch(error){
        console.log("error = ",error.message);
    }
    server.listen(app.get("port"),() => {
        console.log("🚀LISTENING ON PORT 8000...")
    })
}
    
start();

