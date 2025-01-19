import express from "express"
import { applyForJob, getUserData, getUserJobApplication, updateUserResume } from "../controllers/userController"
import upload from "../config/multer"

const router=express.Router()


router.get('/user',getUserData)
router.get('/apply',applyForJob)
router.get('/applications',getUserJobApplication)
router.get('/update-resume',upload.single('resume'),updateUserResume)

export default router