import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
import {
  useMoralis,
  useNativeBalance,
  useChain,
  useERC20Balances,
  useTokenPrice,
  useApiContract,
} from 'react-moralis'

import { FaArrowDown, FaArrowsAltV, FaEllipsisV } from 'react-icons/fa'
import Layout from '../components/Layout'
import Modal from '../components/Modal'

import tokenList from '../web3/tokens'
import uniswap from '../web3/uniswap'

export default function Home() {
  const {
    Moralis,
    user,
    logout,
    authenticate,
    enableWeb3,
    isInitialized,
    isAuthenticated,
    isWeb3Enabled,
    isWeb3EnableLoading,
  } = useMoralis()
  const { fetchERC20Balances, data, wait, isFetching, err } = useERC20Balances()

  const {
    fetchTokenPrice,
    formattedData,
    priceError,
    priceLoading,
    priceFetching,
  } = useTokenPrice()

  //TOKENS
  const [tokens, setTokens] = useState(tokenList)
  //INPUT
  const [inputPreview, setInputPreview] = useState(false)
  const [inputOpen, setInputOpen] = useState(false)
  const [inputToken, setInputToken] = useState(tokens[0])
  const [input, setInput] = useState('')
  const [inputBalance, setInputBalance] = useState(0)
  const [inputPrice, setInputPrice] = useState(0)
  //OUTPUT
  const [outputPreview, setoutputPreview] = useState(false)
  const [outputToken, setOutputToken] = useState('')
  const [outputOpen, setOutputOpen] = useState(false)
  const [output, setOutput] = useState('')
  const [outputBalance, setOutputBalance] = useState(0)
  const [outputPrice, setOutputPrice] = useState(0)

  useEffect(() => {
    const connectorId = window.localStorage.getItem('connectorId')

    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled])

  const inputTokenHandler = (token) => {
    console.log('hello')
    fetchERC20Balances()
    console.log(token)
    fetchTokenPrice({
      params: {
        address: token.address,
        chain: 'eth',
        exchange: 'uniswap-v2',
      },
      onSuccess: (price) => {
        setInputPrice(price.usdPrice)
      },
    })
    setInputOpen(false)
    setInputToken(token)
  }
  const outputTokenHandler = (token) => {
    setOutputOpen(false)
    fetchERC20Balances()
    fetchTokenPrice({
      params: {
        address: token.address,
        chain: 'eth',
        exchange: 'uniswap-v2',
      },
      onSuccess: (price) => {
        setOutputPrice(price.usdPrice)
      },
    })
    setOutputToken(token)
  }

  const inputChangeHandler = (event) => {
    setInput(event.target.value)
  }

  const outputChangeHandler = (event) => {
    setOutput(event.target.value)
  }

  const fetchInputBalance = useEffect(() => {
    let bal = 0
    data?.filter((token) => {
      console.log(token, inputToken)
      console.log(token.token_address, inputToken.address)
      if (token.token_address == inputToken.address) {
        bal = token.balance / Math.pow(10, token.decimals)
      }
    })
    setInputBalance(bal.toFixed(3))
  }, [data, inputToken])

  const fetchOutputBalance = useEffect(() => {
    let bal = 0
    data?.filter((token) => {
      console.log(token, inputToken)
      console.log(token.token_address, outputToken.address)
      if (token.token_address == outputToken.address) {
        bal = token.balance / Math.pow(10, token.decimals)
      }
    })
    setOutputBalance(bal.toFixed(3))
  }, [data, outputToken])

  const previewOutput = useEffect(() => {
    const timer = setTimeout(() => {
      if (input == '') setOutput('')
      if (inputToken && outputToken && !outputPreview) {
        Moralis.Web3API.defi
          .getPairAddress({
            token0_address: inputToken.address,
            token1_address: outputToken.address,
            exchange: 'uniswapv2',
            chain: '0x1',
          })
          .then(() => {
            console.log(input)
            Moralis.executeFunction({
              contractAddress: uniswap.address,
              abi: uniswap.abi,
              functionName: 'getAmountsOut',
              params: {
                amountIn: BigInt(input * Math.pow(10, inputToken.decimals)),
                path: [inputToken.address, outputToken.address],
              },
            })
              .then((res) => {
                setInputPreview(true)
                setInterval(() => setInputPreview(false), 500)
                setOutput(res[1] / Math.pow(10, outputToken.decimals))
              })
              .catch((err) => {
                console.warn(err)
              })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [input])

  const previewInput = useEffect(() => {
    const timer = setTimeout(() => {
      if (output == '') setInput('')
      if (inputToken && outputToken && !inputPreview) {
        Moralis.Web3API.defi
          .getPairAddress({
            token0_address: inputToken.address,
            token1_address: outputToken.address,
            exchange: 'uniswapv2',
            chain: '0x1',
          })
          .then((res) => {
            Moralis.executeFunction({
              contractAddress: uniswap.address,
              abi: uniswap.abi,
              functionName: 'getAmountsIn',
              params: {
                amountOut: BigInt(output * Math.pow(10, outputToken.decimals)),
                path: [inputToken.address, outputToken.address],
              },
            })
              .then((res) => {
                setoutputPreview(true)
                setTimeout(() => setoutputPreview(false), 800)
                console.log(res)
                setInput(res[0] / Math.pow(10, inputToken.decimals))
              })
              .catch((err) => {
                console.warn(err)
              })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [output])

  useEffect(() => {
    if (isWeb3Enabled) {
      fetchTokenPrice({
        params: {
          address: inputToken.address,
          chain: 'eth',
          exchange: 'uniswap-v2',
        },
        onSuccess: (price) => {
          console.log(price)
          setInputPrice(price.usdPrice)
        },
        onError: (err) => {
          console.log(err)
        },
      })
    }
  }, [isWeb3Enabled])

  return (
    <div>
      <Modal
        tokens={tokens}
        open={inputOpen}
        onClose={() => setInputOpen(false)}
        onChangeToken={inputTokenHandler}
      ></Modal>
      <Modal
        tokens={tokens}
        open={outputOpen}
        onClose={() => setOutputOpen(false)}
        onChangeToken={outputTokenHandler}
      ></Modal>
      <div className=" justify-centerbg-black  flex min-h-full flex-col items-center pt-32 align-middle ">
        <Head>
          <title>LoneSwap</title>
          <meta name="description" content="Swap better." />
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins&displfay=swap"
            rel="stylesheet"
          />
        </Head>

        <div className=" card  w-full  rounded-md border-2 bg-transparent px-4 pt-2 pl-4 text-gray-50  sm:w-11/12  md:w-10/12 lg:w-2/3  xl:w-1/3">
          <div className="  flex flex-row py-4 pt-4">
            <div className="basis-4/5">
              <p className=" text-2xl">Swap</p>
            </div>
            <div className="basis-1/5">
              <h1 className="cursor-pointer text-right text-2xl"> ...</h1>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" basis-3/4 rounded-md border-2 border-cyan-50 bg-inherit">
              <div className="flex flex-row bg-white">
                <input
                  className="basis-3/4 py-2 px-2 text-black outline-none"
                  placeholder="0.00"
                  type="number"
                  value={input}
                  onChange={inputChangeHandler}
                ></input>
                <button className="   mx-1 my-1 basis-1/4 border-2 border-black bg-inherit text-black">
                  {' '}
                  MAX
                </button>
              </div>
            </div>
            <div className="w-full basis-1/4 px-2 ">
              <button
                className=" w-full rounded-md border-2 py-2 hover:animate-pulse hover:bg-slate-800"
                onClick={() => setInputOpen(true)}
              >
                {inputToken.symbol}
              </button>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="basis-2/4">${(inputPrice * input).toFixed(3)}</div>
            <div className="basis-2/4">Balance: {inputBalance}</div>
          </div>
          <div className=" min-w-max items-center justify-center py-4 text-center">
            Invert
          </div>
          <div className="flex flex-row ">
            <div className=" basis-3/4 rounded-md border-2 border-cyan-50 bg-inherit">
              <div className="flex flex-row bg-white">
                <input
                  className="basis-3/4 py-2 px-2 text-black outline-none"
                  placeholder="0.00"
                  type="number"
                  value={output}
                  onChange={outputChangeHandler}
                ></input>
                <button className="   mx-1 my-1 basis-1/4 border-2 border-black bg-inherit text-black">
                  {' '}
                  MAX
                </button>
              </div>
            </div>
            <div className="w-full basis-1/4 px-2 ">
              <button
                className=" w-full rounded-md border-2 py-2 hover:animate-pulse hover:bg-slate-800"
                onClick={() => {
                  setOutputOpen(true)
                }}
              >
                {outputToken.symbol || 'Select'}
              </button>
            </div>
          </div>
          <div className="mb-2 flex flex-row">
            <div className="basis-2/4">
              ${(outputPrice * output).toFixed(3)}
            </div>
            <div className="basis-2/4">Balance: {outputBalance}</div>
          </div>
          <div className=" my-4 flex w-auto flex-col justify-center pt-5 ">
            <button className="mx-10 mt-4 rounded border-2 border-white py-2">
              Approve
            </button>
            <button className="mx-10 mt-4 rounded border-2 border-white py-2">
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
