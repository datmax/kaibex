import React, { useState, useEffect, useMemo } from 'react'
import { FaTimes, FaWindowClose } from 'react-icons/fa'

function Toast({ type, message, close, visible }) {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        close()
      }, 3000)
    } return () =>{
      clearTimeout(timer)
    }
  }, [closed])

  const handleClose = () =>{
    setClosed(true)
    close()
  }

  if (type == 'error') {
    return (
      
      <div className=" transition ease-in-out card-error absolute rounded-xl  z-10 mr-10 mt-10 w-full  items-center  py-4   hover:bg-black  md:right-1  md:w-1/6 ">
        <div className="flex flex-row px-2  align-bottom text-white">
          <p className="basis-11/12">{message} </p>
          <p className="basis-1/12 justify-end">
            <FaTimes
              className=" mt-1  cursor-pointer items-end"
              onClick={handleClose}
            ></FaTimes>
          </p>
        </div>
      </div>
    )
  } else {
    return (
      <div className=" transition ease-in-out card absolute rounded-xl  z-10 mr-10 mt-10 w-full  items-center  py-4   hover:bg-black  md:right-1  md:w-1/6 ">
        <div className="flex flex-row px-2  align-bottom text-white ">
          <p className="basis-11/12">{message} </p>
          <p className="basis-1/12 justify-end">
            <FaTimes
              className=" mt-1  cursor-pointer items-end"
              onClick={handleClose}
            ></FaTimes>
          </p>
        </div>
      </div>
    )
  }
}

export default Toast
