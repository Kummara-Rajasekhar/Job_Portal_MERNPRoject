import mongoose from "mongoose";


const JobSchema =new mongoose.Schema({
    title:{type:String,requires:true},
    description:{type:String,requires:true},
    location:{type:String,requires:true},
    category:{type:String,requires:true},
    level:{type:String,requires:true},
    salary:{type:String,requires:true},
    date:{type:String,requires:true},
    visible:{type:String,default:true},
    companyId:{type:mongoose.Schema.Types.ObjectId,ref:'Company',required:true},
})


const Job= mongoose.model('Job',JobSchema)
export default Job