import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./src/routes/userRoutes.js"
import jobGiverRouter from "./src/routes/jobGiverRoute.js"
import ratingRouter from "./src/routes/ratingRoute.js"
const app = express()
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  Credential:true
}))

app.use(express.json({limit:'20kb'}))
app.use(express.json({extended:true,limit:'20kb'}))

app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/jobgiver",jobGiverRouter)
app.use("/api/v1/ratingrouter",ratingRouter)
export default app;