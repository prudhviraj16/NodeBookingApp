import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoute from './routes/auth.js'
import hotelsRoute from './routes/hotels.js'
import roomsRoute from './routes/rooms.js'
import usersRoute from './routes/users.js'
import cookieParser from 'cookie-parser';


const app = express()

app.use(cors())
app.use(cookieParser());

mongoose.set('strictQuery', true)

const mongoURI = `mongodb+srv://Prudhvi876:Prudhvi876@cluster0.xa0edpx.mongodb.net/hotelbooking?retryWrites=true&w=majority`

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(res => {
  console.log('Connected to db successfully')
}).catch(err => {
  console.log('Failed to connect', err)
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/auth",authRoute)
app.use("/api/hotels",hotelsRoute)
app.use("/api/rooms",roomsRoute)
app.use("/api/users",usersRoute)

app.use((err,req,res,next)=>{

    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"

    return res.status(errorStatus).json({
        success : false,
        status : errorStatus,
        message : errorMessage,
        stack : err.stack
    })
})


app.listen(4000, () => {
    console.log("Backend server is running!");
})