import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
import {
  useMoralis,
  useNativeBalance,
  useERC20Balances,
  useTokenPrice,
} from 'react-moralis'
import toast, { Toaster } from 'react-hot-toast'

const bigNumber =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export default function Home() {
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

  const {
    fetchTokenPrice,
    formattedData,
    priceError,
    priceLoading,
    priceFetching,
  } = useTokenPrice()

  const { getBalances } = useNativeBalance()

  const approve = () => {
    toast.success('Approved!')
  }

  const mint = () => {
    toast.success('Minted!')
  }
  //TOKENS
  //INPUT

  //OUTPUT

  const [approved, setApproved] = useState(true)
  const [enough, setEnough] = useState(true)
  const [swapping, setSwapping] = useState(false)

  const [showFaq, setshowFaq] = useState(false)

  return (
    <div className=" relative mx-2">
      <div className=" flex  flex-col items-center justify-center pt-20 align-middle ">
        <Head>
          <title>FortunaDAO</title>
          <meta name="description" content="Get blessed." />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Arima+Madurai:wght@100;500;700;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Toaster position="top-center" reverseOrder={false} />
        <div className=" card  w-full  border-2 border-gray-500 bg-transparent px-4 py-4 pt-2 text-black sm:w-11/12  md:w-10/12 lg:w-2/3  xl:w-1/3">
          <div className="  w-full py-4 pt-4">
            <p className=" text-4xl font-extralight ">
              May the fortune assist you.
            </p>
          </div>
          <div className="text-3xl font-extrabold "> How it works:</div>
          <div className=" border-l-2 border-l-amber-900 bg-amber-900 bg-opacity-5 pl-2 font-normal text-gray-800">
            <p className="py-2">
              For each dice roll on our platform, 1 $FORTUNA token is minted and
              sent to the user. Users can roll an unlimited amount of times.
            </p>
            <p className="py-2"> The cost per roll is 0.088 WETH + gas.</p>
            <p>Each dice can roll a number between 1-1,000,000.</p>
            <p>
              Rolls above 600,000 (40% chance) wun a spot for the DAO in the
              pool that can claim 20% of the entire pot once a winner is decided
              .
            </p>
            <p className="py-2">
              Rolling 888,888 wins the pot for the DAO and ends the game.
            </p>
            <p>The game has a duration of 88 days.</p>
            <p className="py-2">
              For more info, check the{' '}
              <a
                className=" font-semibold text-amber-900"
                href="https://fortunadao.gitbook.io/fortunadao/"
              >
                Docs.
              </a>
            </p>
          </div>
          <div className="w-full py-4">
            Ticket size:{' '}
            <span className=" font-bold text-amber-900"> 0,088 WETH</span>
          </div>
          <div className="w-full py-4">
            Mint:
            <input
              type="number"
              name="qty"
              id=" "
              placeholder="Amount"
              className="mx-2 my-1 w-24 bg-yellow-100 px-2 pt-1 outline-none"
            />
          </div>
          <div className="w-full py-4">
            {approved && (
              <button
                onClick={mint}
                className="mx-auto w-full rounded-sm border-2 border-amber-100  bg-amber-100 py-4 text-xl font-bold text-black"
              >
                MINT
              </button>
            )}
            {!approved && (
              <button
                onClick={() => approve()}
                className="mx-auto w-full rounded-sm border-2 border-amber-100  bg-amber-100 py-4 text-xl font-bold text-black"
              >
                APPROVE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
