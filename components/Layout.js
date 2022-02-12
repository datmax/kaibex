import { useMoralis, useNativeBalance, useChain } from 'react-moralis'
import { useEffect, useState, useMemo } from 'react'
import Modal from './Modal'
import LoginModal from './LoginModal'

function SwitchToEth({ change }) {
  return (
    <button
      onClick={() => {
        change()
      }}
    >
      Switch to ETH
    </button>
  )
}

function User(props) {
  const { getBalances, data, nativeToken, error, isLoading } =
    useNativeBalance(props)
  const { chainId, switchNetwork, chain } = useChain()

  const {
    account,
    Moralis,
    user,
    logout,
    authenticate,
    enableWeb3,
    isInitialized,
    isAuthenticated,
    isWeb3Enabled,
  } = useMoralis(props)

  const [showLogin, setShowLogin] = useState(false)
  const [balanceData, setBalanceData] = useState(0)

  useMemo(() => {
    console.log(chain)
  }, [chain, data])

  return (
    <div>
      {account && (
        <p className="text-white">
          <span className=" hidden md:block ">
            {chainId == '0x1' ? (
              data?.formatted
            ) : (
              <SwitchToEth change={() => switchNetwork('0x1')}></SwitchToEth>
            )}
            {account.slice(0, 3) +
              '...' +
              account.slice(account.length - 3, account.length)}
          </span>
        </p>
      )}
      {(!isAuthenticated || !account) && (
        <div>
          <button onClick={() => setShowLogin(true)}>aaa</button>
          <LoginModal
            open={showLogin}
            onClose={() => setShowLogin(false)}
          ></LoginModal>
        </div>
      )}
    </div>
  )
}

export default function Layout({ children }) {
  const {
    Moralis,
    user,
    logout,
    authenticate,
    enableWeb3,
    isInitialized,
    isAuthenticated,
    isWeb3Enabled,
    useChain,
  } = useMoralis()

  return (
    <div className=" min-h-screen min-w-fit bg-black">
      <div className="flex flex-row">
        <div className="basis-10/12">
          <h1 className=" pt-4 pl-4 text-4xl text-white">KaibEx</h1>
        </div>
        <div className="basis-2/12 pt-4 pl-4 text-lg text-white">
          <User isAuthenticated={isAuthenticated}></User>
        </div>
      </div>
      <main>{children}</main>
    </div>
  )
}
