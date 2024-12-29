import mongoose from "mongoose"

const connectDB=async(req,res)=>{
    try {
        const connect=await mongoose.connect(process.env.DB_URL)
        if(connect){
            console.log("DB Connected")
        }
    } catch (error) {
        console.log(error)
        
    }
}

export default connectDB