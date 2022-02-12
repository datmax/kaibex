/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { connectors } from './Account/config'
import { useMoralis, useNativeBalance } from 'react-moralis'

const styles = {
  text: {
    color: '#21BF96',
  },
  connector: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20px 5px',
    cursor: 'pointer',
  },
  icon: {
    alignSelf: 'center',
    fill: 'rgb(40, 13, 95)',
    flexShrink: '0',
    marginBottom: '8px',
    height: '30px',
  },
}

export default function LoginModal({ open, onClose, children }) {
  const cancelButtonRef = useRef(null)
  const { authenticate, isAuthenticated, account, chainId, logout } =
    useMoralis()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false)
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
            <div className=" inline-block w-full transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {connectors.map(({ title, icon, connectorId }, key) => (
                  <div
                    style={styles.connector}
                    key={key}
                    onClick={async () => {
                      try {
                        await authenticate({
                          provider: connectorId,
                          chainId: '1',
                        })
                        window.localStorage.setItem('connectorId', connectorId)
                        onclose
                      } catch (e) {
                        console.error(e)
                      }
                    }}
                  >
                    <img
                      src={icon.src}
                      alt={title}
                      width="30em"
                      height="30em"
                      style={styles.icon}
                    />
                    <p style={{ fontSize: '14px' }}>{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
