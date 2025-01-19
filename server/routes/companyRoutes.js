import express from 'express'
import { Router } from 'express'
import upload from '../config/multer'
import { changeJobApllicationStatus, changeVisibility, getCompanyData, getCompanyjobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController'
import { protectCompany } from '../middleware/authMiddleware'

const router =express.Router()

router.post('/register',upload.single('image'),registerCompany)
router.post('/login',loginCompany)
router.post('/company',protectCompany,getCompanyData)
router.post('/post-job',protectCompany,postJob)
router.post('/applicants',protectCompany,getCompanyjobApplicants)
router.post('/list-jobs',protectCompany,getCompanyPostedJobs)
router.post('/change-status',protectCompany,changeJobApllicationStatus)
router.post('/change-visibility',protectCompany,changeVisibility)

export default router
