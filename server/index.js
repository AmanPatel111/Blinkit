import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { connectDB } from "./Config/dbconfig.js"
dotenv.config()


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy :false
}))
app.use(cors({credentials : true,
    origin : process.env.FRONTEND_URL
    
}))


const PORT  = 8080 || process.env.PORT

app.get("/",(req,res)=>{
 res.json({
        messege:"Server is Running" + PORT
    });
    
})
connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server is Running ", PORT);
        
    })
})

