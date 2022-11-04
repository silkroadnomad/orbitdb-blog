import {startIPFS} from './startIPFS'

const connectOrbit = async (store,options) => {
    console.log("running connectIFS with dbName"+store.dbName, options)
    
    let dbName =  store.dbName===undefined?process.env.DB_NAME:store.dbName
    if(options===undefined) options = {}
    options.dbName= dbName;
  
    let ipfsInstance
    console.log("store.ipfs",store.ipfs)
    if(store.ipfs===undefined || store.ipfs===null){
      console.log('starting ipfs')
      const {ipfs} = await startIPFS(options)
      // store.identity = identity
      console.log('ipfs',ipfs)
      // try {
      
      // await ipfs.bootstrap.add("/ip4/65.21.180.203/tcp/4001/p2p/12D3KooWQEaozT9Q7GS7GHEzsVcpAmaaDmjgfH5J8Zba1YoQ4NU3")
      // await ipfs.bootstrap.add("/ip6/65.21.180.203/tcp/4001/p2p/12D3KooWQEaozT9Q7GS7GHEzsVcpAmaaDmjgfH5J8Zba1YoQ4NU3")

      // await ipfs.swarm.connect('/dns6/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star/p2p/12D3KooWQEaozT9Q7GS7GHEzsVcpAmaaDmjgfH5J8Zba1YoQ4NU3')
      // await ipfs.swarm.connect('/dns4/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star/p2p/12D3KooWQEaozT9Q7GS7GHEzsVcpAmaaDmjgfH5J8Zba1YoQ4NU3')


      // console.log("connectd to peers",peers)
      // }catch(ex){
      //     console.log('swarm connect error',ex)
      // }
      // const peers = await ipfs.swarm.peers()
      // console.log('not connected',peers)
      await store.connect(ipfs,options)
    }else  await store.connect(store.ipfs,options)


    console.log("odb id:", store.odb.identity.id)
    console.log("dbName:",dbName)
    console.log("store.feed.id:", store.feed.id)
  }
  export default connectOrbit