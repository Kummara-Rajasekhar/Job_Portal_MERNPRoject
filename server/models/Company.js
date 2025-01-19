import mongoose from "mongoose";


const companySchema =new mongoose.Schema({
    name:{type:String,requires:true},
    email:{type:String,requires:true,unique:true},
    image:{type:String,requires:true},
    password:{type:String,requires:true},
})


const Company= mongoose.model('Company',companySchema)
export default Company