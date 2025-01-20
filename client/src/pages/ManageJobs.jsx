import React, { useContext, useEffect, useState } from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ManageJobs = () => {

  const navigate =useNavigate()
  const [jobs,setjobs]=useState([])
  const {backendurl,comapnytoken}=useContext(AppContext)
  const fetchcompanyjobs=async()=>{
    try{
      const {data}=await axios.get(backendurl+'/api/company/list-jobs',{headers:{token:comapnytoken}})
      if(data.success){
        setjobs(data.jobs.reverse())
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  const changejobvisibility=async(id)=>{
      try{
        const {data}=await axios.post(backendurl+'/api/compnay/change-visibility',
          {id},
          {headers:{token:comapnytoken}}
        )
        if(data.success){
          toast.success(data.message)
          fetchcompanyjobs()
        }else{
          toast.error(data.message)
        }
      }catch(error){
        toast.error(error.message)
      }
  }



  useEffect(()=>{
    if(comapnytoken){
      fetchcompanyjobs()
    }
  },[comapnytoken])

  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm '>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 border-b text-left '>Job Title</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b text-center'>Applicants</th>
              <th className='py-2 px-4 border-b text-left '>Visible</th>
            </tr>
          </thead>
          <tbody>
            
              {
                jobs.map((job,i)=>(
                  <tr className='text-gray-700' key={i}>
                    <td className='py-2 px-4 border-b max-sm:hidden'>{i+1}</td>
                    <td className='py-2 px-4 border-b'>{job.title}</td>
                    <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
                    <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                    <td className='py-2 px-4 border-b text-center'>{job.applicants}</td>
                    <td className='py-2 px-4 border-b'>
                      <input onChange={()=>changejobvisibility(job._id)} className='scale-125 ml-4' type="checkbox" checked={job.visible} />
                    </td>
                  </tr>
                ))
              }
            
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-end'>
        <button onClick={()=>navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'>Add new job</button>
      </div>
    </div>
  )
}

export default ManageJobs
