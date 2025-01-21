import Company from "../models/Company";
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import generateToken from "../utils/generateToken";
import { messageInRaw } from "svix";
import Job from "../models/Job";
import JobApplication from "../models/JobApplication";


export const registerCompany= async(req,res)=>{
    const {name,email,password}=req.body;
    const imagefile=req.file;
    if(!name || !email || !password || !imagefile){
        return res.json({success:false,message:"Missing Details"})

    }
    try{
        const companyExists=await Company.findOne({email})
        if(companyExists){
            return res.json({success:false,message:"Company already registered"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)
        const imageupload =await cloudinary.uploader(imagefile.path)
        const company=await Company.create({
            name,
            email,
            password:hashPassword,
            image:imageupload
        })
        res.json({
            success:true,
            company:{
                _id:company._id,
                name:company.name,
                email:company.email,
                image:company.image

            },
            token:generateToken(company._id)
        })
    }

    catch(error){
        res.json({success:false,message:error.message})

    }



}

export const loginCompany= async(req,res)=>{
    const {email,password}=req.body
    try{
        const company= await Company.findOne({email})
        if(await bcrypt.compare(password,company.password)){
            res.json({
                success:true,
                company:{
                    _id:company._id,
                    name:company.name,
                    email:company.email,
                    image:company.image
    
                },
                token:generateToken(company._id)

            })
        }else{
            res.json({success:false,message:"Invalid email or password"})
        }


    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const getCompanyData= async(req,res)=>{
    try{
        const company=req.company
        res.json({success:true,company})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const postJob= async(req,res)=>{
    const {title,description,loocation,salary,level,category}=req.body
    const companyId=req.company._id
    try{
        const newJob= new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date:Date.now(),
            level,
            category,
        })
        await newJob.save()
        res.json({success:true,newJob})
    }
    catch(error){
        res.json({success:false,message:error.message})

    }


    
}


export const getCompanyjobApplicants= async(req,res)=>{
    try{
        const companyId=req.company._id
        const applicantions=await JobApplication.find({companyId})
        .populate('userId','name image resume ')
        .populate('jobId','title location category level salary')
        .exec()
        res.json({success:true ,applicantions})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}


export const getCompanyPostedJobs= async(req,res)=>{
    try{
        const companyId=req.company._id
        const jobs=await Job.find(companyId)
        const jobsData=await Promise.all(jobs.map(async (job)=>{
            const applicants=await JobApplication.findById({jobId:job._id})
            return {...job.toObject(),applicants:applicants.length}
        }))
        res.json({success:true,jobsData})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const changeJobApllicationStatus= async(req,res)=>{
    try{
        const {id,status}=req.body
        await JobApplication.findOneAndUpdate({_id:id},{status})
        res.json({success:true,message:"Status Changed"})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}


export const changeVisibility= async(req,res)=>{
    try{
        const {id}=req.body
        const companyId=req.company._id
        const job= await Job.findById(id)
        if(companyId.toString()=== job.companyId.toString()){
            job.visible=!job.visible;
        }
        await job.save()
        res.json({success:true,job})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

















