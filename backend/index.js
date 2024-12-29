import express, { response } from 'express';  // Replacing require with import
import cors from 'cors';
import dotenv from 'dotenv';
import visitorRouter from './routes/visitor.routes.js';

const app=express()
app.use(express.json()); // Parse JSON body
app.use(cors())

dotenv.config({
    path: "./.env",
  });

app.get('/',(req,res)=>{
    res.send("<h1>Helath check is active 😀</h1>")
})

app.use('/api/statics', visitorRouter)

app.listen(5007,()=>{
    console.log('Server is running on port 5007')
})
