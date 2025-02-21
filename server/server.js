
import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from '@sentry/node'
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import jobRouter from './routes/companyRoutes.js'
import userRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import {clerkMiddleware} from '@clerk/express'



const app=express()

await connectDB()
await connectCloudinary()


app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/',(req,res)=> res.send("API Working"))

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
  

app.post('/webhooks',clerkWebhooks)
app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRouter)
app.use('/api/users',userRoutes)


const PORT=process.env.PORT || 5000
Sentry.setupConnectErrorHandler(app)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})














