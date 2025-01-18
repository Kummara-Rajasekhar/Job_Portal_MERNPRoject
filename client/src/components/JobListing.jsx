import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { space } from 'postcss/lib/list'
import { assets, JobCategories, JobLocations, jobsData } from '../assets/assets'
import Jobcard from './Jobcard'

const JobListing = () => {

    const { jobs, setjobs, issearched, searchfilter, setsearchfilter } = useContext(AppContext)
    const [showfilter, setshowfilter] = useState(false)
    const [currentpage, setcurrentpage] = useState(1)
    const [selectedcategories, setselectedcategories] = useState([])
    const [selectedlocations, setselectedlocations] = useState([])

    const [filteredjobs, setfilteredjobs] = useState(jobs);
    const handleCategoryChange = (category) => {
        setselectedcategories(
            prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }
    const handleLocationsChange = (location) => {
        setselectedlocations(
            prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
        )
    }

    useEffect(() => {
        const matchesCategory = job => selectedcategories.length === 0 || selectedcategories.includes(job.category)
        const matchesLocation = job => selectedlocations.length === 0 || selectedlocations.includes(job.location)
        const matchesTitle = job => searchfilter.title === "" || job.title.toLowerCase().includes(searchfilter.title.toLowerCase())
        const matchesSearchLocation = job => searchfilter.location === "" || job.location.toLowerCase().includes(searchfilter.location.toLowerCase())
        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
        )


        setfilteredjobs(newFilteredJobs)
        setcurrentpage(1)

    }, [jobs, selectedcategories, selectedlocations, searchfilter])




    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
            <div className='w-full lg:w-1/4 bg-white px-4'>
                {
                    issearched && (searchfilter.title !== "" || searchfilter.location !== "") &&
                    (
                        <>
                            <h3 className='font-medium text-lg mb-4'>Current search</h3>
                            <div className='mb-4 text-gray-600'>
                                {
                                    searchfilter.title && (
                                        <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                                            {searchfilter.title}
                                            <img onClick={e => setsearchfilter(prev => ({ ...prev, title: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                        </span>
                                    )
                                }
                                {
                                    searchfilter.location && (
                                        <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                                            {searchfilter.location}
                                            <img onClick={e => setsearchfilter(prev => ({ ...prev, location: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                        </span>
                                    )
                                }
                            </div>
                        </>
                    )

                }

                <button onClick={e => setshowfilter(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
                    {
                        showfilter ? "Close" : "Filters"
                    }
                </button>

                <div className={showfilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {
                            JobCategories.map((cat, i) => (
                                <li key={i} className='flex gap-3 items-center'>
                                    <input onChange={() => handleCategoryChange(cat)} checked={selectedcategories.includes(cat)} className='scale-125' type="checkbox" />
                                    {cat}
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className={showfilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4 pt-14'>Search by Locations</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {
                            JobLocations.map((cat, i) => (
                                <li key={i} className='flex gap-3 items-center'>
                                    <input onChange={() => handleLocationsChange(cat)} checked={selectedlocations.includes(cat)} className='scale-125' type="checkbox" />
                                    {cat}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                <h3 className='font-medium text-3xl py-2 ' id='job-list'>Latest Jobs</h3>
                <p className='mb-8'>get your desired job from top companies</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {
                        filteredjobs.slice((currentpage - 1) * 6, currentpage * 6).map((job, i) => (
                            <Jobcard key={i} job={job} />
                        ))
                    }
                </div>


                {
                    filteredjobs.length > 0 && (
                        <div className='flex items-center justify-center space-x-2 mt-10'>
                            <a href="#job-list">
                                <img onClick={() => setcurrentpage(Math.max(currentpage - 1), 1)} src={assets.left_arrow_icon} alt="" />
                            </a>
                            {
                                Array.from({ length: Math.ceil(filteredjobs.length / 6) }).map((_, i) => (
                                    <a key={i} href='#job-list'>

                                        <button onClick={() => setcurrentpage(i + 1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentpage === i + 1 ? 'bg-blue-100 text-blue-500' : "text-gray-500"}`}>{i + 1}</button>
                                    </a>


                                ))
                            }
                            <a href="#job-list">
                                <img onClick={() => setcurrentpage(Math.min(currentpage + 1, Math.ceil(filteredjobs.length / 6)))} src={assets.right_arrow_icon} alt="" />
                            </a>
                        </div>
                    )
                }
            </section>



        </div>
    )
}

export default JobListing
