
  import React, { useState, useEffect, useMemo } from 'react'
  import {
    useMoralis,
    useNativeBalance,
    useERC20Balances,
    useTokenPrice,
  } from 'react-moralis'

  import farms from '../web3/farms';

export default function Fang(props){

    const linkDecimals =  18;


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

  const [farmerPools, setFarmerPools] = useState([]);
  const [pool, setPool] = useState();
  const [farmable, setfarmable] = useState();
  const [getMultiplier, setGetMultiplier] = useState();
  const [timeRemaining, setTimeRemaining] = useState();
  const [rewardTimed, setRewardTimed] = useState();
  const [poolBalance, setPoolBalance] = useState();
  const [poolDetails, setPoolDetails] = useState();
  const [farmingUnit, setFarmingUnit] = useState();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [rewards, setRewards] = useState(0);
  const [rewardRate, setRewardRate] = useState();

  const [staked, setstaked] = useState(0);

  const updateRewards = useEffect(() => {
    if(isWeb3Enabled){
        console.log(account)
        Moralis.executeFunction({
            contractAddress: farms.address,
            abi : farms.abi,
            functionName: "_calculate_rewards",
            params: {
                id: 1,
                addy: account
            }
        }).then((res) =>{
            setRewards(res);
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }
  }, [account, isWeb3Enabled]);
  
  const updateLocked = useEffect(()=>{
    if(isWeb3Enabled){
        console.log(account)
        Moralis.executeFunction({
            contractAddress: farms.address,
            abi : farms.abi,
            functionName: "get_reward_rate",
            params: {
                id: 1,
            }
        }).then((res) =>{
            setRewardRate(res);
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

}, [isWeb3Enabled, account]);


const updatePool = useEffect(() => {
    if(isWeb3Enabled){
        console.log(account)
        Moralis.executeFunction({
            contractAddress: farms.address,
            abi : farms.abi,
            functionName: "get_single_pool",
            params: {
                id: 1,
                addy: account
            }
        }).then((res) =>{
            setFarmingUnit(res);
            setstaked(parseInt(res[1]._hex))
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

}, [isWeb3Enabled, account]);

const getFarmerPools = useEffect(() => {
    if(isWeb3Enabled){
        console.log(account)
        Moralis.executeFunction({
            contractAddress: farms.address,
            abi : farms.abi,
            functionName: "get_farmer_pools",
            params: {
                farmer: account
            }
        }).then((res) =>{
            setFarmerPools(res);
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

}, [isWeb3Enabled, account]);

   const getFarmingUnit = useEffect(() => {
       if(isWeb3Enabled){
           console.log(account)
           Moralis.executeFunction({
               contractAddress: farms.address,
               abi : farms.abi,
               functionName: "get_single_pool",
               params: {
                   id: 1,
                   addy: account
               }
           }).then((res) =>{
               setFarmingUnit(res)
               
               console.log(res)
           }).catch((err)=>{
               console.log(err)
           })
       }

   }, [isWeb3Enabled, account]);


   const unstake = () =>{}
   const stake = () =>{}
   const reinvest = () =>{}

    return(<div className="w-full  lg:w-5/6 xl:w-2/3  card-blue p-4 mt-10 bg-black bg-opacity-10 ">
        <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="first flex">
            <img src="https://res.cloudinary.com/mazculo/image/upload/v1645323915/kaiba-icon-white_1_vnsl0v.png" className="w-10 h-10 mr-2"  />
            <div className="title py-4"> 
            <h2 className='text-2xl font-medium '>Stake FANG-LP</h2>
            <h2 className=" text-slate-300 ">Farm FANG</h2>

            </div>
            </div>
            <div className='section w-full py-4'>
            <h2 className='text-xl font-medium'  >APR</h2>
            <h3>12%/115%</h3>
        </div>
        <div className='section w-full py-4'>
            <h2 className='text-xl font-medium'>My staked FANG-LP:</h2>
            <h3>1200</h3>
        </div>
        <div className='section w-full py-4'>
            <h2 className='text-xl font-medium'>My earned FANG:</h2>
            <h3>350</h3>
        </div>

        </div>
        <div className='grid grid-cols-3  md:inline-grid py-4 gap-10    '>
            <div className="mx-auto"> 
            <button className=" lg:my-2  p-4 card  bg-emerald-900 font-extrabold" onClick={()=> reinvest}>Reinvest</button>

            </div>
            <div className="mx-auto"> 
            <button className=" lg:my-2 p-4 card-error bg-red-900 font-extrabold" onClick={()=> harvest}>Harvest</button>

            </div >
                        <div className="mx-auto"> 
            <button className=" lg:my-2 p-4 card-info  bg-blue-900 font-extrabold" onClick={()=>stake}>Stake</button>

            </div>



        </div>
       
    </div>)
}