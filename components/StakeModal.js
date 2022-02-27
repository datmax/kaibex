/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useMoralis, useERC20Balances } from 'react-moralis'
const FANG = '0x0fcf2733bd8ef455577ddd78cb56595985655aa3'
import erc20 from '../web3/erc20'
import farms from '../web3/farms'

export default function Modal({ open, onClose, coin, onSuccess, onError }) {
  const {
    Moralis,
    user,
    account,
    logout,
    authenticate,
    enableWeb3,
    isInitialized,
    isAuthenticated,
    isWeb3Enabled,
    isWeb3EnableLoading,
  } = useMoralis()
  const { fetchERC20Balances, data, isFetching, err } = useERC20Balances()

  const cancelButtonRef = useRef(null)
  const inputHandler = (event) => {
    setAmount(event.target.value)
  }

  const stake = () => {
    console.log(amount, locking)
    Moralis.executeFunction({
      contractAddress: farms.address,
      abi: farms.abi,
      functionName: 'farmTokens',
      params: {
        TOKEN: FANG,
        _amount: BigInt(amount * Math.pow(10, 18)),
        locking: locking * 60 * 60 * 24,
      },
    })
      .then((res) => {
        res
          .wait()
          .then((res) => {
            onSuccess()
          })
          .catch((err) => onerror(err.error.message))
      })
      .catch((err) => onerror(err.error.message))
  }

  useEffect(() => {
    if (data) {
      console.log(data)
      data.filter((token) => {
        if (token.token_address == FANG) {
          setBalance(token.balance / Math.pow(10, token.decimals))
          console.log(token.balance)
        }
      })
    }
  }, [open, account, data])

  const [amount, setAmount] = useState('')
  const [result, setResult] = useState('')
  const [isStaking, setIsStaking] = useState(false)
  const [balance, setBalance] = useState(0)
  const [locking, setLocking] = useState(0)

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
            <div className="card-white inline-block w-full transform overflow-hidden rounded-lg  text-left  shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h2"
                      className="text-lg  font-medium leading-6  text-white  "
                    >
                      Stake {coin}
                    </Dialog.Title>
                    <div className=" card relative my-4  w-full rounded-md bg-inherit">
                      <input
                        className="w-full bg-transparent py-2 px-2 text-white outline-none "
                        placeholder="Enter an amount..."
                        type="number"
                        value={amount}
                        onChange={inputHandler}
                      ></input>
                      <button
                        onClick={() => setInput(inputBalance)}
                        className="absolute top-1 right-4  mx-4 my-1  bg-inherit text-gray-500 hover:text-white"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>

                <div className=" text-white">
                  <div className=" w-full px-2 text-right font-thin">
                    <h6>Balance: {balance}</h6>
                  </div>

                  <div className=" w-full font-thin">Lock for:</div>
                  <div
                    className="grid grid-cols-2 gap-4"
                    onClick={() => setLocking(1)}
                  >
                    <div className="card my-4 flex w-full flex-row px-4 py-2">
                      <div className="basis-1/2">1 Day</div>
                      <div className="basis-1/2 text-right">10x</div>
                    </div>
                    <div
                      className={
                        'card-info my-4 flex w-full flex-row px-4 py-2 '
                      }
                      onClick={() => setLocking(7)}
                    >
                      <div className="basis-1/2">1 week</div>
                      <div className="basis-1/2 text-right">120x</div>
                    </div>
                  </div>
                  {isStaking && (
                    <button className="card-hover my-4 w-full animate-pulse px-4 py-4">
                      Staking...
                    </button>
                  )}
                  {!isStaking && (
                    <button
                      className="card-hover my-4 w-full px-4 py-4"
                      onClick={stake}
                    >
                      Stake
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
