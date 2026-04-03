import "dotenv/config"
import app from "./app.js"
import {connection} from "./src/db/server.js"

connection()
.then(()=>{
  app.listen(process.env.PORT,()=>{
    console.log(`This server is run on the port of ${process.env.PORT}`)
  })
})
.catch((error)=>{
  console.log("Error during the connection of mongodb",error)
})
