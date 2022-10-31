import {create} from 'ipfs'
export const startIPFS = async (options) => {
    let repo = options?.repo!==undefined?options.repo:'./ipfs-repo'
    const ipfs = await create({
      repo: repo,
      EXPERIMENTAL: { pubsub: true },
      preload: { "enabled": false },
      config: {
        Bootstrap: ['/ip4/65.21.180.203/tcp/4001/p2p/12D3KooWQEaozT9Q7GS7GHEzsVcpAmaaDmjgfH5J8Zba1YoQ4NU3'],
        Addresses: {
          Swarm: [
            //Use default 
            // "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star" //doesn't work 
            // Use IPFS dev webrtc signal server
            '/dns6/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
            '/dns4/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
            // Use local signal server
            // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
          ]
        },
      }
    })
    return {ipfs};
  }