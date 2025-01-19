import jwt from 'jsonwebtoken'

import Company from '../models/Company'
import { messageInRaw } from 'svix'

export const protectCompany=async(req,res,next)=>{
    const token =req.headers.token
    if(!token){
        return res.json({success:false,message:"Not authorised, Login Again"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.Company=await Company.findById(decoded).select('-password')
        next()
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}