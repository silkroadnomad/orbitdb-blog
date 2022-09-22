import Identities from 'orbit-db-identity-provider'
import OrbitDB from 'orbit-db'
import {startIPFS} from '../orbitdb/startIPFS'
/**
 * Function executable in the command line to spin up a second ipfs node with a second orbit node
 * in order to migrate from another database and change the permissions.
 */
 const cp = async ourDBName => {
    console.log('starting second ipfs node')
    let newDbName = ourDBName!==undefined?ourDBName:"notTheSame02" //process.env.DB_NAME
    const {ipfs,identity} = await startIPFS({'repo':'./ipfs-repo2'})
    const ourIdentity = identity || (await Identities.createIdentity({ id: "user" }))
    window.ipfs2 = ipfs;
    console.log("ourIdentity",ourIdentity)
    const odb = await OrbitDB.createInstance(ipfs, {
      ourIdentity,
      directory: "./odb2",
    });
    console.log('created new odb',odb)
    const feed = await odb.feed(newDbName, {
      identity: ourIdentity, 
      accessController: {
        type: 'orbitdb',
          accessController: {
            type: 'orbitdb',
            admin: [odb.identity.id, ourIdentity._id],
            write: [odb.identity.id, ourIdentity._id]
            //     write: publicAccess ? ["*"] : [this.odb.identity.id],
          }
      }
    })
    feed.access.grant("admin",ourIdentity._id);
    feed.access.grant("write",ourIdentity._id);
    console.log('created new feed',feed)
  
    feed.access.grant("admin",ourIdentity._id);
    const capabilities = feed.access.capabilities
    console.log("capabilities",capabilities)
  
    feed.events.on("replicated", async (dbAddress, count, newFeed, d) => {
      console.log("replicated - loading posts from db");
      console.log("dbAddress", dbAddress);
      console.log("count", count);
      console.log("feed", newFeed);
    });
  
    feed.events.on("ready", async (dbAddress, feedReady) => {
      console.log("database ready " + dbAddress, feedReady);
      if(feed !== undefined) feed.all.map((e)=>console.log(e));
      else console.log('feed is still undefined although ready')
  
      console.log('copying old feed into new feed')
      console.log('old feed lenghth',store.feed.all.length)
      console.log('new feed lenghth',feed.all.length)
      // await feed.drop()
      // feed.all.map((e)=> feed.remove(e.hash));
      store.feed.all.map((e)=>{
        console.log("adding object",e)
        feed.add(e.payload.value)});
      console.log('new feed lenghth',feed.all.length)
      console.log('feed id',feed.id)
      window.feed2 = feed;
    });
  
    feed.load();
  
  }
  console.log('cp command for console loaded.')
  window.cp = cp;