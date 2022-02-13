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
  const [selected, setSelected] = useState(chainId)

  useMemo(() => {
    isWeb3Enabled && setSelected(Moralis.getChainId())
  }, [isWeb3Enabled])

  return (
    <div>
      {account && (
        <p className="text-white">
          <span className=" mr-4 md:block  ">
            {selected == '0x1' ? (
              (data?.balance / Math.pow(10, 18))?.toFixed(3) + ' ETH '
            ) : (
              <SwitchToEth
                change={() =>
                  switchNetwork('0x1')
                    .then(() => {
                      setSelected('0x1')
                    })
                    .catch(() => console.log('fanculo'))
                }
              ></SwitchToEth>
            )}
            {' | ' +
              account.slice(0, 3) +
              '...' +
              account.slice(account.length - 3, account.length)}
          </span>
        </p>
      )}
      {(!isAuthenticated || !account) && (
        <div>
          <button onClick={() => setShowLogin(true)}>Connect</button>
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
    <div className=" min-h-screen min-w-full ">
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
