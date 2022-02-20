import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
import {
  useMoralis,
  useNativeBalance,
  useERC20Balances,
  useTokenPrice,
} from 'react-moralis'

import Modal from '../components/Modal'
import Toast from '../components/Toast'

import tokenList from '../web3/tokens'
import uniswap from '../web3/uniswap'
import erc20 from '../web3/erc20'
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

  const { getBalances, } = useNativeBalance()

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

  const [approved, setApproved] = useState(true)
  const [enough, setEnough] = useState(true);
  const [swapping, setSwapping] = useState(false);

  const [alert, setAlert] = useState({
    message: '',
    type: null,
    visible: false,
  })

  useEffect(() => {
    const connectorId = window.localStorage.getItem('connectorId')

    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled])

  useEffect(() =>{
    let stored = localStorage.getItem("tokens");
    if(stored){
      setTokens(currentList =>{
        return [...currentList, ...(JSON.parse(stored))]
      })
    }
  },[])



  const alertHandler = () => {
    console.log('hello')
    setAlert({visible: false})
  }

  const approve = () => {
    Moralis.executeFunction({
      abi: erc20,
      contractAddress: inputToken.address,
      functionName: 'approve',
      params: { _spender: uniswap.address, _value: bigNumber },
    })
      .then((res) => {
        res.wait().then((res)=>{
          setAlert({
            type: 'success',
            message: 'Token approved.',
            visible: true,
          })
          setApproved(true)
        })
        
      })
      .catch((err) => {
        setAlert({
          type: 'error',
          message: 'Approve denied by User.',
          visible: true,
        })
      })
  }

  const inputTokenHandler = (token) => {
    let inTokens = false;
    tokens.forEach((currentToken) =>{
      if(token == currentToken) inTokens = true;
    })
    if(!inTokens){
      console.log("cazzo")
      let saved = localStorage.getItem("tokens")
      if(saved != null){
        saved = JSON.parse(saved)
        
        localStorage.setItem("tokens", JSON.stringify([...saved, token]))
      }
      else{
        localStorage.setItem("tokens", JSON.stringify([token]))
      }

      setTokens(currentList => {
        return [...currentList, token]
      });
    }
    console.log(tokens)
    console.log(inTokens);
    if (inputToken != token) {
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
    }

    setInputOpen(false)
    setInputToken(token)
  }
  const outputTokenHandler = (token) => {
    let inTokens = false;
    tokens.forEach((currentToken) =>{
      if(token == currentToken) inTokens = true;
    })
    if(!inTokens){
      setTokens(currentList => {
        return [...currentList, token]
      });
    }
    if (outputToken != token) {
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
    }
    setOutputOpen(false)

    setOutputToken(token)
  }

  const inputChangeHandler = (event) => {
    setInput(event.target.value)
  }

  const outputChangeHandler = (event) => {
    setOutput(event.target.value)
  }

  const swap = () => {
    if(inputToken != outputToken && outputToken.name ){
      setSwapping(true)
      console.log(BigInt(input * Math.pow(10, inputToken.decimals)))
      console.log((output - ((output / 100) * 5)) * Math.pow(10, outputToken.decimals))

      if(inputToken.name == "Ethereum"){ Moralis.executeFunction({
        
          abi: uniswap.abi,
          contractAddress: uniswap.address,
          functionName: "swapExactETHForTokensSupportingFeeOnTransferTokens",
          params: {
            to: account,
            amountOutMin: 0,
            path: [inputToken.address, outputToken.address],
            deadline: Date.now() + 60 * 60 * 3 *1000,
          },
          msgValue: BigInt(input * Math.pow(10, inputToken.decimals))
        }).then((tx) => {
          tx.wait().then((res) =>{
            console.log(res);
            setSwapping(false);
            fetchERC20Balances();
            getBalances();
            setAlert({message: "Transaction successful!", type: "success", visible: true})
          })
        }).catch((err)=>{
          console.log(err);
          setSwapping(false);
          setAlert({message: "Transaction Failed.", type: "error", visible: true})
        })
        
      }
      if(outputToken.name == "Ethereum"){
        Moralis.executeFunction({
        
          abi: uniswap.abi,
          contractAddress: uniswap.address,
          functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
          params: {
            to: account,
            amountIn: BigInt(input * Math.pow(10, inputToken.decimals)),
            amountOutMin: 0,
            path: [inputToken.address, outputToken.address],
            deadline:Date.now() + 60 * 60 * 3 *1000
          },
        }).then((tx) => {
          tx.wait().then((res) =>{
            console.log(res);
            setSwapping(false);
            fetchERC20Balances();
            setAlert({message: "Transaction successful!", type: "success", visible: true})
          })
        }).catch((err)=>{
          console.log(err);
          setSwapping(false);
          setAlert({message: "Transaction Failed.", type: "error", visible: true})
        })
      }
      else if(inputToken.name !="Ethereum" && outputToken.name !="Ethereum"){
        Moralis.executeFunction({
        
          abi: uniswap.abi,
          contractAddress: uniswap.address,
          functionName: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
          params: {
            to: account,
            amountIn: BigInt(input * Math.pow(10, inputToken.decimals)),
            amountOutMin: 0,
            path: [inputToken.address, outputToken.address],
            deadline: Date.now() + 60 * 60 * 3 *1000
          },
        }).then((tx) => {
          tx.wait().then((res) =>{
            console.log(res);
            setSwapping(false);
            fetchERC20Balances();
            getBalances();
            setAlert({message: "Transaction successful!", type: "success", visible: true})
          })
        }).catch((err)=>{
          console.log(err);
          setSwapping(false);
          setAlert({message: "Transaction Failed.", type: "error", visible: true})
        })
      }
    }
    
  }


  const fetchInputBalance = useMemo(() => {
    console.log("INPUT UPDATE!")
    if (inputToken.name == 'Ethereum') {
      getBalances({
        onSuccess: (balance) => {
          balance =  balance.balance / Math.pow(10, 18)
          setInputBalance(balance.toFixed(3))
        },

        onError: (error) => {
          console.error('CULO')
        },
      })
    } else{
      let bal = 0

      data?.filter((token) => {
        if (token.name == 'Ethereum') {
        } else if (token.token_address == inputToken.address) {
          bal = token.balance / Math.pow(10, token.decimals)
        }
      })
    setInputBalance(bal.toFixed(3))
    }
   
  }, [data, inputToken])

  const fetchOutputBalance = useMemo(() => {

    if (outputToken.name == 'Ethereum') {
      getBalances({
        onSuccess: (balance) => {
          console.log(balance)
          let bal = balance.balance / Math.pow(10, 18)
          setOutputBalance(bal.toFixed(3))
        },

        onError: (error) => {
          console.error('CULO')
        },
      })
    } else{
    let bal = 0
    data?.filter((token) => {
      console.log(token, inputToken)
      console.log(token.token_address, outputToken.address)
      if (token.token_address == outputToken.address) {
        bal = token.balance / Math.pow(10, token.decimals)

      }
    })
    setOutputBalance(bal.toFixed(3))

    }

      
  }, [data, outputToken])

  const previewOutput = useEffect(() => {
    console.log(outputToken.name)
    if (isWeb3Enabled && inputToken.name != 'Ethereum') {
      Moralis.Web3API.token
        .getTokenAllowance({
          owner_address: account,
          spender_address: uniswap.address,
          address: inputToken.address,
        })
        .then((res) => {
          console.log(res)
          if (res.allowance == '0') {
            setApproved(false)
          } else setApproved(true)
        })
    }
    else{
      setApproved(true)
    }

    const timer = setTimeout(() => {
      if (input == '') setOutput('')
      if (
        inputToken &&
        outputToken &&
        !outputPreview &&
        inputToken != outputToken && 
        input > 0 
      ) {
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
                console.log((res[1] / Math.pow(10, outputToken.decimals)).toFixed(3));
                setOutput((res[1] / Math.pow(10, outputToken.decimals)).toFixed(3))
              })
              .catch((err) => {
                console.warn(err)
              })
          })
          .catch((err) => {
            console.log(err)
          })
          if(input > inputBalance){
            
            setEnough(false)
          }
          else setEnough(true)
      }
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [input, isWeb3Enabled, inputToken, outputToken?.name])



  const previewInput = useEffect(() => {
  const timer = setTimeout(() => {
      if (output == '') setInput('')
      if (
        inputToken &&
        outputToken &&
        !inputPreview &&
        inputToken != outputToken
      ) {
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
    }, 1000)
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
    <div className=" relative mx-2">
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
        <Toast
          visible={alert.visible}
          message={alert.message}
          type={alert.type}
          close={alertHandler}
        ></Toast>

      <div className=" flex  flex-col items-center justify-center  pt-32 align-middle ">
        <Head>
          <title>Kaibex</title>
          <meta name="description" content="Swap better." />
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins&displfay=swap"
            rel="stylesheet"
          />
        </Head>

        <div className=" card  w-full  border-2 bg-transparent px-4 pt-2 pl-4 text-gray-50  sm:w-11/12  md:w-10/12 lg:w-2/3  xl:w-1/3">
          <div className="  flex flex-row py-4 pt-4">
            <div className="basis-4/5">
              <p className=" text-2xl">Swap</p>
            </div>
            <div className="basis-1/5">
              <h2 className="cursor-pointer text-right text-2xl"> ...</h2>
            </div>
          </div>
          <div className="flex flex-row ">
            <div className=" card relative basis-3/4  rounded-md bg-inherit">
              <input
                className="w-full bg-transparent py-2 px-2 text-white outline-none "
                placeholder="0.00"
                type="number"
                value={input}
                onChange={inputChangeHandler}
              ></input>
              <button onClick={()=> setInput(inputBalance)} className="absolute top-1 right-4  mx-1 my-1  bg-inherit text-gray-500 hover:text-white" >
                MAX
              </button>
            </div>
            <div className=" basis-1/4 px-2 ">
              <button
                className=" card w-full rounded-md border-2 py-2 hover:animate-pulse hover:bg-slate-800"
                onClick={() => setInputOpen(true)}
              >
                {inputToken.symbol}
              </button>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="basis-3/4 mt-2">${(inputPrice * input).toFixed(3)}</div>
            <div className="basis-1/4 mt-2">Balance: {inputBalance}</div>
          </div>
          <div className='py-4'></div>
         
          <div className="  flex flex-row ">
            <div className=" card relative basis-3/4  rounded-md bg-inherit">
              <input
                className="w-full bg-inherit py-2   px-2 outline-none "
                placeholder="0.00"
                type="number"
                value={output}
                onChange={outputChangeHandler}
              ></input>
             
            </div>
            <div className=" basis-1/4 px-2  ">
              <button
                className="card w-full rounded-md border-2 py-2 hover:animate-pulse hover:bg-slate-800"
                onClick={() => {
                  setOutputOpen(true)
                }}
              >
                {outputToken.symbol || 'Select'}
              </button>
            </div>
          </div>
          <div className="mb-2 flex flex-rowm mt-2 ">
            <div className="basis-3/4">
              ${(outputPrice * output).toFixed(3)}
            </div>
            <div className="basis-1/4 ">Balance: {outputBalance}</div>
          </div>
          <div className=" my-4 flex w-auto flex-col justify-center pt-5 ">
            {!approved && (
              <button
                className="card mx-10 mt-4 rounded border-2 border-white py-2"
                onClick={() => approve()}
              >
                Approve
              </button>
            )}
            {approved && enough && !swapping && (
              <button className=" card mx-10 mt-4 rounded border-2 border-white py-2 hover:animate-pulse" onClick={swap}>
                Swap
              </button>
            )}
                        { !enough && (
              <button className="card-error card mx-10 mt-4 rounded border-2 border-white py-2" >
                Not enough balance.
              </button>
            )}
                                    { swapping && (
              <button className="card-info card mx-10 mt-4 rounded border-2 border-white py-2">
                Swapping...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
