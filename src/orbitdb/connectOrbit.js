import {startIPFS} from './startIPFS'
import {log} from '../utils/loaderPrettyLog.js'

const connectOrbit = async (store,options) => {

  log.action("connectOrbit with dbName and options "+store.dbName, options)
    
    let dbName =  store.dbName===undefined?process.env.DB_NAME:store.dbName
    if(options===undefined) options = {}
    options.dbName= dbName;
  
    let ipfsInstance
    log.msg("ipfs in store",store.ipfs)
    if(store.ipfs===undefined || store.ipfs===null){
      log.action('starting ipfs')
      const {ipfs} = await startIPFS(options)
      // store.identity = identity
      log.success('created ipfs instance',ipfs)
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


    log.msg("odb.identity.id:", store.odb.identity.id)
    log.msg("dbName:",dbName)
    log.msg("feed.id:", store.feed.id)
  }
  export default connectOrbit