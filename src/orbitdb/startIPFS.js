import {create} from 'ipfs'
import { webTransport } from './webTransport'
import { noise } from 'libp2p-noise'
export const startIPFS = async (_options) => {
    // const {webTransport} = require('@libp2p/webtransport')
    let repo = _options?.repo!==undefined?_options.repo:'./ipfs-repo'
    let ipfs 
    const options = {
      repo: repo,
      EXPERIMENTAL: { pubsub: true },
      preload: { "enabled": false },
      config: {
        // Bootstrap: ['/ip4/65.21.180.203/tcp/4001/p2p/12D3KooWQEaozT9Q7GS7GHEzsVcpAmaaDmjgfH5J8Zba1YoQ4NU3'], 
        Addresses: {
          Swarm: [
            // '/ip4/65.21.180.203/udp/4002/quic/webtransport/certhash/uEiDsQaOEzyisykzrNgwoKEoQWANoP5MzOUZaePw-FRu5rg/certhash/uEiCoVqAKR0Nqyc1OK6-ENX2TJgZ8h1gYy8Wd0Sz6kAPaRw'
          ]
        },
      },
      libp2p: {
        transports: [
          webTransport()
        ],
        connectionEncryption: [
          noise()
        ]
      }
    }

    try {
      if(ipfs!==undefined)
        await ipfs.stop()
      ipfs = await create(options)
    }catch(ex){
        console.log("couldn' create ipfs node trying without network",ex)
        options.config.Bootstrap = []
        options.config.Addresses.Swarm = []
        console.log('options',options)
        ipfs = await create(options)
    }

    ipfs.libp2p.on('peer:discovery', (peer) => {
      console.log('discovered', peer)
    })
  
    ipfs.libp2p.on('peer:connect', async (peer) => {
      console.log('connected', peer)
  
      ipfs.swarm.peers().then(peers => console.log('current peers connected: ', peers))
    })
    return {ipfs};
  }