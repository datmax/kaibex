import React, { useState, useEffect, useMemo } from 'react'
import { FaTimes, FaWindowClose } from 'react-icons/fa'
import { Dialog, Transition } from '@headlessui/react'

function Toast({ type, message, close, visible }) {
  const [closed, setClosed] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (visible) {
        console.log('asda')
        setClosed(true)
        close()
      }
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [visible])

  const handleClose = () => {
    setClosed(true)
    close()
  }

  if (type == 'error') {
    return (
      <Transition
        show={visible}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className=" card-error absolute z-50 mr-10 mt-10  w-full items-center rounded-xl py-4  transition  ease-in-out   hover:bg-black  md:right-1  md:w-1/6 ">
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
      </Transition>
    )
  } else {
    return (
      <Transition
        show={visible}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="card absolute z-50  mr-10 mt-10  w-full items-center rounded-xl py-4  transition  ease-in-out   hover:bg-black  md:right-1  md:w-1/6 ">
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
      </Transition>
    )
  }
}

export default Toast
