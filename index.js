require('dotenv').config()
require("./db/conn")
const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const bodyParser=require("body-parser")
const cookieParser = require('cookie-parser')
const cors=require("cors")

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: "*",
    credentials: true,
}))

app.use('/api', require("./routes/userRoute"))
app.use('/api', require("./routes/postRoute"))
app.use('/api', require("./routes/problemRoute"))

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})