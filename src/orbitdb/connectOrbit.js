import {startIPFS} from './startIPFS'

const connectOrbit = async (store,options) => {
    console.log("running connectIFS with dbName"+store.dbName, options)
    
    let dbName =  store.dbName===undefined?process.env.DB_NAME:store.dbName
    if(options===undefined) options = {}
    options.dbName= dbName;
  
    let startIPFSObj
    console.log("store.ipfs",store.ipfs)
    if(store.ipfs===undefined || store.ipfs===null){
      console.log('starting ipfs')
      startIPFSObj = await startIPFS(options)
      console.log('startIPFSObj.ipfs',startIPFSObj.ipfs)
      console.log("store.identity",store.identity)
      if(store?.identity?.id === undefined) options.identity = startIPFSObj.identity
      console.log('options.identity',startIPFSObj.identity)
      await store.connect(startIPFSObj.ipfs,options)
  
      // store.ipfs = startIPFSObj.ipfs
      // store.identity = startIPFSObj.identity
    }else  await store.connect(store.ipfs,options)


    console.log("odb id:", store.odb.identity.id)
    console.log("dbName:",dbName)
    console.log("store.feed.id:", store.feed.id)
  }
  export default connectOrbit