import React, { useState, useEffect, useMemo } from 'react'
import {
  useMoralis,
  useNativeBalance,
  useERC20Balances,
  useTokenPrice,
} from 'react-moralis'

import { ethers } from 'ethers'
import farms from '../web3/farms'
import StakeModal from './StakeModal'
import Toast from './Toast'

import toast, { Toaster } from 'react-hot-toast'

export default function Fang(props) {
  const linkDecimals = 18

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

  const [farmerPools, setFarmerPools] = useState([])
  const [pool, setPool] = useState()
  const [farmable, setfarmable] = useState()
  const [getMultiplier, setGetMultiplier] = useState()
  const [timeRemaining, setTimeRemaining] = useState()
  const [rewardTimed, setRewardTimed] = useState()
  const [poolBalance, setPoolBalance] = useState()
  const [poolDetails, setPoolDetails] = useState()
  const [farmingUnit, setFarmingUnit] = useState()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [rewards, setRewards] = useState(0)
  const [rewardRate, setRewardRate] = useState()
  const [modalOpen, setModalOpen] = useState(false)

  const [staked, setstaked] = useState(0)

  //--ALERT
  const [alert, setAlert] = useState({
    message: '',
    type: null,
    visible: false,
  })
  const alertHandler = () => {
    console.log('hello')
    setAlert({ visible: false })
  }
  //--END ALERT

  const updateRewards = useEffect(() => {
    if (isWeb3Enabled) {
      console.log(account)
      Moralis.executeFunction({
        contractAddress: farms.address,
        abi: farms.abi,
        functionName: '_calculate_rewards',
        params: {
          id: 1,
          addy: account,
        },
      })
        .then((res) => {
          setRewards(res)
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [account, isWeb3Enabled])

  const test = () => {}

  const provider = new ethers.providers.JsonRpcProvider()
  const signer = provider.getSigner()
  console.log(signer)
  provider.on('network', (newn, old) => {
    console.log(newn, old)
  })

  const updateLocked = useEffect(() => {
    if (isWeb3Enabled) {
      console.log(account)
      Moralis.executeFunction({
        contractAddress: farms.address,
        abi: farms.abi,
        functionName: 'get_reward_rate',
        params: {
          id: 1,
        },
      })
        .then((res) => {
          setRewardRate(res)
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [isWeb3Enabled, account])

  const updatePool = useEffect(() => {
    if (isWeb3Enabled) {
      console.log(account)
      Moralis.executeFunction({
        contractAddress: farms.address,
        abi: farms.abi,
        functionName: 'get_single_pool',
        params: {
          id: 1,
          addy: account,
        },
      })
        .then((res) => {
          setFarmingUnit(res)
          setstaked(parseInt(res[1]._hex))
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [isWeb3Enabled, account])

  const getFarmerPools = useEffect(() => {
    if (isWeb3Enabled) {
      console.log(account)
      Moralis.executeFunction({
        contractAddress: farms.address,
        abi: farms.abi,
        functionName: 'get_farmer_pools',
        params: {
          farmer: account,
        },
      })
        .then((res) => {
          setFarmerPools(res)
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [isWeb3Enabled, account])

  const getFarmingUnit = useEffect(() => {
    if (isWeb3Enabled) {
      console.log(account)
      Moralis.executeFunction({
        contractAddress: farms.address,
        abi: farms.abi,
        functionName: 'get_single_pool',
        params: {
          id: 1,
          addy: account,
        },
      })
        .then((res) => {
          setFarmingUnit(res)

          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [isWeb3Enabled, account])

  const harvest = () => {
    console.log('hello', isWeb3Enabled)
    if (isWeb3Enabled) {
      Moralis.executeFunction({
        contractAddress: farms.address,
        abi: farms.abi,
        functionName: 'issueInterestToken',
        params: {
          id: 1,
        },
      })
        .then((res) => {
          res
            .wait()
            .then((res) => {
              consolelog('YEY')
              setAlert({
                message: 'Harvest successful!',
                type: 'success',
                visible: true,
              })
            })
            .catch((err) => {
              toast.error('Transaction failed.' + err.error.message)
            })
        })
        .catch((err) => {
          toast.error('Transaction failed.' + err.error.message)
        })
    }
  }
  const stake = () => {}
  const reinvest = () => {}

  return (
    <>
      <Toaster
        toastOptions={{
          icon: null,
          error: {
            style: {
              color: 'white',
              backgroundColor: 'black',
              boxShadow:
                '0 0 0.1rem #fff, 0 0 0.2rem #fff, 0 0 0.1rem coral, 0 0 0.8rem coral, 0 0 0.8rem coral, inset 0 0 0.3rem coral',
              borderRadius: '20px',
            },
          },
          success: {
            style: {
              color: 'white',

              backgroundColor: 'black',

              boxShadow:
                '0 0 0.1rem #fff, 0 0 0.2rem #fff, 0 0 0.1rem #0e5e4c, 0 0 0.8rem #0e5e4c, 0 0 0.8rem #0e5e4c, inset 0 0 0.3rem #0e5e4c',
              borderRadius: '20px',
            },
          },
        }}
      ></Toaster>
      <StakeModal
        open={modalOpen}
        onSuccess={() =>
          setAlert({
            message: 'Transaction successful!',
            type: 'success',
            visible: true,
          })
        }
        onError={(error) => toast('make me a toast.')}
        onClose={() => setModalOpen(false)}
        coin="FANG"
      ></StakeModal>
      <Toast
        visible={alert.visible}
        message={alert.message}
        type={alert.type}
        close={alertHandler}
      ></Toast>
      <div className="card-blue  mt-10 w-full  bg-black bg-opacity-10 p-4 lg:w-5/6 xl:w-2/3 ">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="first flex">
            <img
              src="https://res.cloudinary.com/mazculo/image/upload/v1645323915/kaiba-icon-white_1_vnsl0v.png"
              className="mr-2 h-10 w-10"
            />
            <div className="title py-4">
              <h2 className="text-2xl font-medium ">Stake FANG-LP</h2>
              <h2 className=" text-slate-300 ">Farm FANG</h2>
            </div>
          </div>
          <div className="section w-full py-4">
            <h2 className="text-xl font-medium">APR</h2>
            <h3>12%/115%</h3>
          </div>
          <div className="section w-full py-4">
            <h2 className="text-xl font-medium">My staked FANG-LP:</h2>
            <h3>{staked / Math.pow(10, 18)}</h3>
          </div>
          <div className="section w-full py-4">
            <h2 className="text-xl font-medium">My earned FANG:</h2>
            <h3>{rewards / Math.pow(10, 18)}</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10  py-4 md:inline-grid md:grid-cols-4    ">
          <div className="mx-auto">
            <button
              className=" card-info bg-blue-900 p-4  font-extrabold lg:my-2"
              onClick={() => setModalOpen(true)}
            >
              Stake
            </button>
          </div>
          <div className="mx-auto">
            <button
              className=" card-info bg-blue-900 p-4  font-extrabold lg:my-2"
              onClick={test}
            >
              Unstake
            </button>
          </div>
          <div className="mx-auto">
            <button
              className=" card  bg-emerald-900 p-4  font-extrabold lg:my-2"
              onClick={() => toast.success('hello')}
            >
              Reinvest
            </button>
          </div>
          <div className="mx-auto">
            <button
              className=" card-error bg-red-900 p-4 font-extrabold lg:my-2"
              onClick={harvest}
            >
              Harvest
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
