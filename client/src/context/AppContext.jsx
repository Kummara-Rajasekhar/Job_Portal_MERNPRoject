import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import {useAuth, useUser } from '@clerk/clerk-react'





export const AppContext=createContext();

export const AppContextProvider=(props)=>{

    const [searchfilter,setsearchfilter]=useState(
        {
            title:'',
            location:'',

        }
    );
    const {user}=useUser()
    const {getToken}=useAuth()
    const [issearched,setissearched]=useState(false)
    const [jobs,setjobs]=useState([])
    const [showrecruiterlogin,setshowrecruiterlogin]=useState(false)

    const [companytoken,setcompanytoken]=useState(null)
    const [companydata,setcompanydata]=useState(null)
    const backendurl=import.meta.env.VITE_BACKEND_URL
    const [userdata,setuserdata]=useState(null)
    const [userapplication,setuserapplcations]=useState([])


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

    const fetchuserdata=async()=>{
        try{
            const token=await getToken();
            const {data}=await axios.get(backendurl+'/api/users/user',{headers:{Authorization:`Bearer ${token}`}})
            if(data.success){
                setuserdata(data.user);

            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)

        }
    }

    useEffect(()=>{
        if(user){
            fetchuserdata()
            fetchuserapplications()
        }
    },[user])

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


    const fetchuserapplications=async()=>{
        try{
            const token=await getToken()
            const {data}=await axios.get(backendurl+'/api/users/applications',
                {headers:{Authorization:`Bearer ${token}`}}
            )
            if(data.success){
                setuserapplcations(data.applications)
            }
            else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

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
        userdata,
        setuserdata,
        userapplication,
        setuserapplcations,
        fetchuserapplications


    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}











