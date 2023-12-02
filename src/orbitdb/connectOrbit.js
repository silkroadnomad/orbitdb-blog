import {startIPFS} from './startIPFS'
import {log} from '../utils/loaderPrettyLog.js'

export const connectOrbit = async (store,options) => {

  log.action("connectOrbit with dbName and options "+store.dbName, options)
    
    let dbName =  store.dbName===undefined?process.env.DB_NAME:store.dbName
    if(options===undefined) options = {}
    options.dbName= dbName;
  
    let ipfsInstance
    log.msg("ipfs in store",store.ipfs)
    if(store.ipfs===undefined || store.ipfs===null){
      log.action('starting ipfs')
      const {ipfs} = await startIPFS(options)
      log.success('created ipfs instance',ipfs)
      await store.connect(ipfs,options)
    }else  await store.connect(store.ipfs,options)


    log.msg("odb.identity.id:", store.odb.identity.id)
    log.msg("dbName:",dbName)
    log.msg("feed.id:", store.feed.id)
  }
  export default connectOrbit