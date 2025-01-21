import React, { useContext, useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '../components/Loading'

const ViewApplications = () => {

  const {backendurl}=useContext(AppContext)
  const [applicants,setapplicants]=useState(false)
  const fetchcompanyjobapplications=async()=>{
    try{
      const {data}=await axios.get(backendurl+'/api/company/applicants',
        {headers:{token:companytoken}}
      )
      if(data.success){
        setapplicants(data.applicants.reverse())
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(companytoken){
      fetchcompanyjobapplications()
    }
  },[companytoken])


  const changejobstatus=async(is,status)=>{
    try{
      const {data}=await axios.post(backendurl+'/api/company/change-status',
        {id,status},
        {headers:{token:companytoken}}
      )
      if(data.success){
        fetchcompanyjobapplications()

      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }
  return  applicants ? applicants.length===0 ? (
    <div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl'>No Applicants Available</p>
  </div>
  )
  :(
    <div className='container mx-auto p-4'>
      <div >
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>User name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              applicants.filter(item=>item.jobId && item.userId).map((app,i)=>(
                <tr key={i} className='text-gray-700'>
                  <td className='py-2 px-4 border-b text-center'>{i+1}</td>
                  <td className='py-2 px-4 border-b text-center flex items-center'>
                    <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={app.userId.image} alt="" />
                    <span>{app.userId.name}</span>
                  </td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{app.jobId.title}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{app.jobId.location}</td>
                  <td className='py-2 px-4 border-b '>
                    <a className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center' href={app.userId.resume} target='_blank'>
                      Resume <img src={assets.resume_download_icon} alt="" />
                    </a>
                  </td>
                  <td className='py-2 px-4 border-b relative'>
                    {
                      app.status==='Pending'
                      ?<div className='relative inline-block text-left group'>
                      <button className='text-gray-500 action-button'>...</button>
                      <div className='z-10 hidden absolute right-0 md:lefft-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                        <button onClick={()=> changejobstatus(app._id,'Accepted')} className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>Accept</button>
                        <button onClick={()=> changejobstatus(app._id,'Rejected')}  className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>Reject</button>
                      </div>
                    </div>
                    : <div>{app.status}</div>
                    }
                    
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  ):<Loading/>

}

export default ViewApplications
