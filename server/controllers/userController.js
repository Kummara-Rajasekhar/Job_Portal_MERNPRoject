import JobApplication from "../models/JobApplication";
import  User  from "../models/User";
import Job from "../models/Job";
import {v2 as cloudinary} from 'cloudinary'
import { messageInRaw } from "svix";



export const getUserData= async(req,res)=>{
    const {userid}=req.auth.userId;

    try{
        const user=await User.findById(userid)
        if(!user){
            return res.json({success:false,message:"User not Found"})
        }
        res.json({success:true,user})

    }catch(error){
        res.json({success:true,message:error.message})
    }
}


export const applyForJob= async(req,res)=>{

    const {jobId}=req.body
    const  userId=req.auth.userId
    try{
        const isAlreadyApplied=await JobApplication.find({jobId,userId})
        if(isAlreadyApplied>0){
            return res.json({success:false,message:"Already Applied"})
        }
        const jobData=await Job.findById(jobId)
        if(!jobData){
            return res.json({success:false,message:"Job not Found"})

        }
        await JobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date:Date.now()
        })
        res.json({success:true,message:"Applied Successfully"})

    }
    catch(error){
        res.json({success:false,message:error.message})
    }
    
}



export const getUserJobApplication= async(req,res)=>{
    try{
        const userId=req.auth.userId
        const applications=await JobApplication.find({userId})
        .populate('companyId','name email image')
        .populate('jobId','title description location category level salary')
        .exec()
        if(!applications){
            return res.json({success:false,message:"No job applications found for this user"})
        }
        res.json({success:true,applications})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}


export const updateUserResume= async(req,res)=>{
    try{
        const userId=req.auth.userId
        const resumeFile=req.resumeFile
        const userData=await User.findById(userId)
        if(resumeFile){
            const resumeUpload=await cloudinary.uploader.upload(resumeFile.path)
            userData.resume=resumeUpload.secure_url
        }
        await userData.save()
        res.json({success:true,message:"Resume Updated"})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}





