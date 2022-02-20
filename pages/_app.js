import { MoralisProvider } from 'react-moralis'
import '../styles/globals.css'
import Layout from '../components/Layout'
function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_APP_ID}
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
    >
      {console.log(process.env.NEXT_PUBLIC_APP_ID)}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MoralisProvider>
  )
}
export default MyApp
