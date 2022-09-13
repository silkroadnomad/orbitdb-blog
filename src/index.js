import React, { useEffect } from "react"
import { ChakraProvider } from '@chakra-ui/react'
import { HashRouter as Router, Route } from 'react-router-dom'
import {create} from 'ipfs'
import store from './store/BlogStore'
import BlogPost from './components/BlogPost'
import Settings from './components/Settings'
import BlogIndex from './pages/BlogIndex'
import Identities from 'orbit-db-identity-provider'
import { ethers } from "ethers";
import './styles/style.css'
import './styles/normalize.css'

const App = () => {
  useEffect(() => {
    const load = async () => {

      const ipfs = await create({
        repo: './ipfs-repo',
        EXPERIMENTAL: { pubsub: true },
        preload: { "enabled": false },
        config: {
          // Bootstrap: [
          // ],
          Addresses: {
            Swarm: [
              // Use IPFS dev webrtc signal server
              '/dns6/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
              '/dns4/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
              // Use local signal server
              // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
            ]
          },
        }
      })
      const dbName = process.env.DB_NAME

      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const wallet = provider.getSigner();
      // const signer = async (id, data) => { return await wallet.signMessage({ message: data }) }


      // try {
      //   await provider.send("eth_requestAccounts", []) // <- this promps user to connect metamask
      //   const address  = await wallet.getAddress()
      //   console.log('wallet.getAddress()',address)
      //   // store.identity = await IdentityProvider.createIdentity(wallet1.address, { type: 'ethers', identitySignerFn: signer })
      //   store.identity = await Identities.createIdentity({
      //     type: "ethereum",
      //     wallet: wallet,
      //   })
      //   console.log("Identity created", store.identity)
      // } catch (ex) {
      //   store.identity = undefined
      //   console.log("Identity not given.")
      // }
      const options = {dbName: dbName};
      if(store.identity!==undefined) options.identity = store.identity //add to eth-identiy to connect to orbit-db only when given (otherwise generate one in browser)
      await store.connect(ipfs,options)

  
      console.log("odb id:", store.odb.identity.id)
      console.log("dbName:",dbName)
    }
    load()
  })
    return (
      <ChakraProvider>
          <Router>
            <Route path="/orbitdb/:hash/:name" component={(props) => <BlogPost {...props} store={store}/> }/>
            <Route exact path="/" component={props => <BlogIndex {...props} store={store} />}/>
            <Route exact path="/settings" component={props => <Settings {...props} store={store} />}/>
          </Router>
      </ChakraProvider>
    )
}
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App/>);