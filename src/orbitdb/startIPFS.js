import {create} from 'ipfs'
import {log} from '../utils/loaderPrettyLog.js'
export const startIPFS = async (_options) => {

    let repo = _options?.repo!==undefined?_options.repo:'./ipfs-repo'
    let ipfs 

    const options = {
      repo: repo,
      EXPERIMENTAL: { pubsub: true },
      preload: { "enabled": false },
      config: {
        Bootstrap: ['/ip4/65.21.180.203/tcp/4001/p2p/12D3KooWQEaozT9Q7GS7GHEzsVcpAmaaDmjgfH5J8Zba1YoQ4NU3'], 
        Addresses: {
          Swarm: [
            '/dns6/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
            '/dns4/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
          ]
        },
      }
    }

    try {
        if(ipfs!==undefined)
          await ipfs.stop()
        ipfs = await create(options)

    }catch(ex){
        log.error("Couldn't create IPFS node. Trying without network.",ex)
        options.config.Bootstrap = []
        options.config.Addresses.Swarm = []
        log.action('Options:',options)
        ipfs = await create(options)
    }

    ipfs.libp2p.on('peer:discovery', (peer) => {
      log.action('Discovered:', peer)
    })
  
    ipfs.libp2p.on('peer:connect', async (peer) => {
      log.action('Connected:', peer)
  
    ipfs.swarm.peers().then(peers => log.info('Current peers connected:', peers))

    for await (const { cid, type } of ipfs.pin.ls()) {
      log.action("Pinned files:",{ cid, type })
    }
    })
    return {ipfs};
  }