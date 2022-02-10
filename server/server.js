import express from "express"
import cors from "cors"
import { readdirSync } from "fs"
const morgan = require("morgan")
import mongoose from "mongoose"
require("dotenv").config()

// create express app
const app = express()

//db connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(`DB connection error: ${err}`))

// app middlewares
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// autoload route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)))

// route
app.get("/")

//  port
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server running on port ${port}`))
