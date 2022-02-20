/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useMoralis } from 'react-moralis'



export default function Modal({ open, onClose, tokens, onChangeToken, add }) {
  const { Moralis } = useMoralis()
  const cancelButtonRef = useRef(null)
  const inputHandler = (event) => {
    setsearch(event.target.value)
  }
  const [search, setsearch] = useState('')
  const [result, setResult] = useState('')

  const addToken = (token) => {
    setsearch('')
    setResult("")
    onChangeToken(token)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search != '') {
        Moralis.Web3API.token
          .getTokenMetadata({ chain: '0x1', addresses: [search] })
          .then((res) => {
            if (res[0].name != '') {
              setResult(res[0])
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [search])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex  h-full items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="card-info inline-block w-full transform overflow-hidden rounded-lg  text-left  shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h2"
                      className="text-lg  font-medium leading-6  text-white  "
                    >
                      Stake
                    </Dialog.Title>
                    <div className='flex flex-col'>
                    <input
                      className="my-4 basis-3/4 rounded-lg border-2 border-black bg-gray-900 py-2 px-1 text-white outline-none"
                      value={search}
                      placeholder="Amount..."
                      onChange={inputHandler}
                      type="text"
                    ></input>
                    <div className='basis-1/4'>
                        <button>click</button>
                    </div>
                    </div>
                    
                  </div>
                </div>
                <div className="flex px-4">
                  <div className="w-full">
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 ">
                      {tokens.map((token) => (
                        <div
                          className=" card flex justify-evenly cursor-pointer border-2 py-2 text-center text-white "
                          onClick={() => addToken(token)}
                          key={token.symbol}
                        >
                          <img src={token.thumbnail} className="w-6 h-6" ></img> <p >{token.symbol}</p> 
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
             
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
