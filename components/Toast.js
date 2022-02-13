import React, { useState, useEffect, useMemo } from 'react'
import { FaTimes, FaWindowClose } from 'react-icons/fa'

function Toast({ type, message, close, visible }) {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        close()
      }, 2000)
    }
  })

  if (type == 'error') {
    return (
      <div className=" card-error absolute  z-10 mr-10 mt-10 w-full  items-center  py-4   hover:bg-black  md:right-1  md:w-1/6 ">
        <div className="flex flex-row px-2  align-bottom text-white md:w-1/4">
          <p className="basis-5/6">{message} </p>
          <p className="basis-1/6 justify-end">
            <FaTimes
              className="ml mt-1  cursor-pointer items-end"
              onClick={close}
            ></FaTimes>
          </p>
        </div>
      </div>
    )
  } else {
    return (
      <div className=" card absolute  z-10 mr-10 mt-10 w-full  items-center  py-4   hover:bg-black  md:right-1  md:w-1/6 ">
        <div className="flex flex-row px-2  align-bottom text-white md:w-1/4">
          <p className="basis-5/6">{message} </p>
          <p className="basis-1/6 justify-end">
            <FaTimes
              className="ml mt-1  cursor-pointer items-end"
              onClick={close}
            ></FaTimes>
          </p>
        </div>
      </div>
    )
  }
}

export default Toast
