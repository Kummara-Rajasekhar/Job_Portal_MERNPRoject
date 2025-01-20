import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";





export const AppContext=createContext();

export const AppContextProvider=(props)=>{

    const [searchfilter,setsearchfilter]=useState(
        {
            title:'',
            location:'',

        }
    );
    const [issearched,setissearched]=useState(false)
    const [jobs,setjobs]=useState([])
    const [showrecruiterlogin,setshowrecruiterlogin]=useState(false)

    const [companytoken,setcompanytoken]=useState(null)
    const [companydata,setcompanydata]=useState(null)
    const backendurl=import.meta.env.VITE_BACKEND_URL
    const [userdata,setuserdata]=useState(null)


    const fetchjobs=async() =>{

        try{
            const {data}=await axios.get(backendurl+'/api/jobs')
            if(data.success){
                setjobs(jobsData);
                
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    const fetchcompanydata=async()=>{
        try{
            const {data}=await axios.get(backendurl+'/api/company/company',{headers:{token:companytoken}})
            if(data.success){
                setcompanydata(data.company)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(companytoken){
            fetchcompanydata()
        }
    },[companytoken])

    useEffect(()=>{
        fetchjobs()

        const storedcompanyToken=localStorage.getItem('companytoken')
        if(storedcompanyToken){
            setcompanytoken(storedcompanyToken)
        }
    },[])

    const value={
        searchfilter,
        setsearchfilter,
        issearched,
        setissearched,
        jobs,
        setjobs,
        showrecruiterlogin,
        setshowrecruiterlogin,
        companydata,
        setcompanytoken,
        companytoken,
        setcompanydata,
        backendurl,


    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}











