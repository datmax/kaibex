import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
import {
  useMoralis,
  useNativeBalance,
  useERC20Balances,
  useTokenPrice,
} from 'react-moralis'

import Farm from '../components/Farm'
import Fang from '../components/Fang'
import LPFarm from '../components/LPFarm'

export default function Stake() {
  return (
    <div className=" flex  flex-col items-center justify-center  pt-20 align-middle text-white ">
      <Head>
        <title>Kaibex: Farms</title>
        <meta name="description" content="Swap better." />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins&displfay=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="text-center  text-4xl font-extrabold">Farms</div>
      <Fang></Fang>
      <Farm></Farm>

      <LPFarm></LPFarm>
    </div>
  )
}
