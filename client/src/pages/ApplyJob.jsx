import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets';
import kconvert from 'k-convert'
import moment from 'moment'
import Jobcard from '../components/Jobcard';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useAuth} from '@clerk/clerk-react'


const ApplyJob = () => {

  const {gettoken}=useAuth()
  const { id } = useParams();
  const { jobs,backendurl ,userdata,userapplication,fetchusrapplications} = useContext(AppContext)
  const [jobdata, setJobData] = useState(null)
  const navigate=useNavigate()
  const [isalreadtapplied,setisalreadyapplied]=useState(false)



  const fetchJob = async () => {
   
    try{
      const {data}=await axios.get(backendurl+ `/api/jobs/${id}`)
      if(data.success){
        setJobData(data.job)

      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  const applyhandler=async()=>{
    try{
      if(!userdata){
        return toast.error('Login to apply for jobs')
      }
      if(!userdata.resume){
        navigate('/applications')
        return toast.error('Upload resume to apply')
      }
      const token=await gettoken()
      const {data}= await axios.post(backendurl+'/api/users/apply',
        {jobId:jobdata._id},
        {headers:{Authorization:`Bearer ${token}`}}
      )
      if(data.success){
        toast.success(data.message)
        fetchusrapplications()
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)

    }
  }
  const checkalreadyapplied=()=>{
    const hasapplied=userapplication.some(item=> item.jobId._id===jobdata._id)
    setisalreadyapplied(hasapplied)
  }

  useEffect(() => {
    

      fetchJob()
    
  }, [id, jobs])


  useEffect(()=>{
    if(userapplication.length>0 && jobdata ){
      checkalreadyapplied()
    }
  },[jobdata,userapplication,id])
  return jobdata ? (
    <>
    <Navbar/>
    <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
      <div className='bg-white text-black rounded-lg w-ful'>
        <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
          <div className='flex flex-col md:flex-row items-center'>
            <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={jobdata.companyId.image} alt="" />
            <div className='text-center md:text-left text-neutral-700'>
              <h1 className='text-2xl sm:text-4xl font-medium'>{jobdata.title}</h1>
              <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                <span className='flex items-center gap-1'>
                  <img src={assets.suitcase_icon} alt="" />
                  {jobdata.companyId.name}
                </span>
                <span  className='flex items-center gap-1'>
                  <img src={assets.location_icon} alt="" />
                  {jobdata.location}
                </span>
                <span  className='flex items-center gap-1'>
                  <img src={assets.person_icon} alt="" />
                  {jobdata.level}
                </span>
                <span  className='flex items-center gap-1'>
                  <img src={assets.money_icon} alt="" />
                  CTC: {kconvert.convertTo(jobdata.salary)}
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
            <button onClick={applyhandler()} className='bg-blue-600 p-2.5 px-10 text-white rounded '>{isalreadtapplied ? "Already Applies" : "Apply Now"}</button>
            <p className='mt-1 text-gray-600'>Posted {moment(jobdata.date).fromNow()}</p>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row justify-between items-start'>
          <div className='w-full lg:w-2/3'>
            <h2 className='font-bold text-2xl mb-4'>Job Description</h2>
            <div className='rich-text' dangerouslySetInnerHTML={{__html:jobdata.description}}>
            </div>
            <button onClick={applyhandler()}  className='bg-blue-600 p-2.5 px-10 text-white rounded '>Apply Now</button>
          </div>

          <div className='w-full lg:w-1/3 mt-8 lg:ml-8 space-y-5'>
            <h2>More jobs from {jobdata.companyId.name}</h2>
            {jobs.filter(job=> job._id!==jobdata._id  && job.companyId._id===jobdata.companyId._id)
            .filter(job=>{
              const appliedjobsids=new Set(userapplication.map(app=> app.jobId && app.jobId._id))
              return !appliedjobsids.has(job._id)

            }).slice(0,4)
            .map((job,i)=><Jobcard key={i} job={job}/>)}
          </div>

        </div>
      </div>
    </div>
    <Footer/>
    
    </>
  ) : (
    <Loading/>
    
  )
}

export default ApplyJob
