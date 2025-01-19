import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets';


const AddJob = () => {

  const [title, settitle] = useState('');
  const [location, setlocation] = useState('Bangalore');
  const [category, setcategory] = useState('Programming');
  const [level, setlevel] = useState('Beginner level');
  const [salary, setsalary] = useState(0);
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      })

    }
  }, [])


  return (
    <form className='container p-4 flex flex-col w-full items-start gap-3' action="">
      <div className='w-full'>
        <p className='mb-2'>Job Title</p>
        <input className='w-full max-w-lg px-3 py-2 border-2 border-gary-300 rounded' type="text" placeholder='Type here' onChange={e => settitle(e.target.value)} required />
      </div>
      <div className='w-full max-w-lg'>
        <p className='my-2'>Job Description</p>
        <div ref={editorRef}>

        </div>
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Job Category</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setcategory(e.target.value)} >
            {
              JobCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))
            }
          </select>
        </div>
        <div>
          <p className='my-2'>Job Locations</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setlocation(e.target.value)} >
            {
              JobLocations.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))
            }
          </select>
        </div>
        <div>
          <p className='my-2'>Job Level</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setcategory(e.target.value)} >
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>

      <div>
        <p className='mb-2'>Job Salary</p>
        <input min={0} className='w-full px-3 py-2 border-2 border-gary-300 rounded sm:w-[120px]' onChange={e=> setsalary(e.target.value)} type="number" placeholder='2500' />
      </div>
      <button className='w-28 py-3 mt-4 bg-black text-white rounded'>ADD</button>
    </form>
  )
}

export default AddJob
