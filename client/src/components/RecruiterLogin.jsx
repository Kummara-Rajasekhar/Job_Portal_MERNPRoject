import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const RecruiterLogin = () => {
    const [state, setstate] = useState('Login')
    const [name, setname] = useState("")
    const [password, setpassword] = useState("")
    const [email, setemail] = useState("")
    const [image, setimage] = useState(false)
    const [istextdatasubmitted, setistextdatasubmitted] = useState(false)

    const onSubmitHandler=async(e)=>{
        e.preventDefault()
        if(state==='Sign Up' && !istextdatasubmitted){
            setistextdatasubmitted(true)
        }
    }
    const {setshowrecruiterlogin}=useContext(AppContext);

    useEffect(()=>{
        document.body.style.overflow='hidden'
        return()=>{
            document.body.style.overflow='unset'
        }

    },[])

    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <form onSubmit={onSubmitHandler} action="" className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
                <p>Welcomr back! Please sign in to continue </p>
                {
                    state === 'Sign Up' && istextdatasubmitted
                        ? <>
                        <div className='flex items-center gap-4 my-10'>
                            <label htmlFor="image">
                                <img className='w-16 rounded-full' src={ image ? URL.createObjectURL(image) :assets.upload_area} alt="" />
                                <input onChange={e=>setimage(e.target.files[0])} type="file" id='image' />
                            </label>
                            <p>Upload Company <br />logo </p>
                        </div>
                        
                        </>
                        :
                        <>
                            {state !== "Login" && (
                                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                    <img src={assets.person_icon} alt="" />
                                    <input className='outline-none tex-sm' onChange={e => setname(e.target.value)} type="text" placeholder='Company Name' required />
                                </div>
                            )}

                            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                <img src={assets.email_icon} alt="" />
                                <input className='outline-none text-sm' onChange={e => setemail(e.target.value)} type="email" placeholder='Email Id' required />
                            </div>
                            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                <img src={assets.lock_icon} alt="" />
                                <input className='outline-none text-sm ' onChange={e => setpassword(e.target.value)} type="password" placeholder='Password' required />
                            </div>
                        </>
                }
                {state==='Login' && <p className='text-sm text-blue-600 mt-4 cursor-pointer'>Forgot password</p>
                }

                <button type='submit' className='bg-blue-600 w-full text-white text-white py-2 rounded-full mt-4'>
                    {state === 'Login' ? 'login' :  istextdatasubmitted ? 'create account' :'next'}
                </button>
                {
                    state === 'Login'
                        ? <p className='mt-5 text-center'>Don't have an account <span className='text-blue-600 cursor-pointer' onClick={() => setstate("Sign Up")}>Sign Up</span></p>
                        : <p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setstate("Login")}>Login</span></p>
                }

                <img onClick={e=> setshowrecruiterlogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />


            </form>
        </div>
    )
}

export default RecruiterLogin
