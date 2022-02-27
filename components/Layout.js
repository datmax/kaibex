import { useMoralis, useNativeBalance, useChain } from 'react-moralis'
import { useEffect, useState, useMemo } from 'react'
import LoginModal from './LoginModal'
import { FaStream } from 'react-icons/fa'

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
    useNativeBalance()
  const { chainId, switchNetwork, chain } = useChain()

  const {
    account,
    Moralis,
    isWeb3EnableLoading,
    enableWeb3,
    isAuthenticated,
    isWeb3Enabled,
  } = useMoralis(props)

  const [showLogin, setShowLogin] = useState(false)
  const [balanceData, setBalanceData] = useState(0)
  const [selected, setSelected] = useState(chainId)

  useEffect(() => {
    const connectorId = window.localStorage.getItem('connectorId')

    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled])

  useEffect(() => {
    const timeout = setInterval(() => {
      getBalances()
    }, 15000)
    return () => {
      clearTimeout(timeout)
    }
  }, [account])

  useMemo(() => {
    isWeb3Enabled && setSelected(Moralis.getChainId())
  }, [isWeb3Enabled])

  return (
    <div>
      {account && (
        <p className=" pt-2">
          {selected == '0x1' && data?.balance ? (
            (data?.balance / Math.pow(10, 18))?.toFixed(3) + ' ETH '
          ) : (
            <SwitchToEth
              change={() =>
                switchNetwork('0x1')
                  .then(() => {
                    setSelected('0x1')
                  })
                  .catch(() => console.log('KAIBA FTW'))
              }
            ></SwitchToEth>
          )}
          <span className="hidden md:inline">
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
    <div className=" relative  h-screen w-full   ">
      <div className=" flex flex-row">
        <div className="  basis-6/12">
          <h1 className=" pt-4 pl-4 text-4xl text-black">
            <img
              className="hidden h-10  w-10 md:inline"
              src="https://res.cloudinary.com/mazculo/image/upload/v1645926232/wfyxXVUT_400x400_gb2w1g.jpg"
              alt=""
            />
            FortunaDAO
          </h1>
        </div>
        <div className="basis-5/12 pt-4 pl-4 text-right text-lg text-black ">
          <User isAuthenticated={isAuthenticated}></User>
        </div>
        <div className="hidden justify-end pt-4 pl-4  align-baseline text-black ">
          <div className="relative">
            <FaStream size={20} className="cursor-pointer ">
              {' '}
            </FaStream>
          </div>
        </div>
      </div>
      <main className="px-2">{children}</main>
    </div>
  )
}
