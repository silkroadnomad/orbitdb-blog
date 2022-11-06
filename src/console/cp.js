import Identities from 'orbit-db-identity-provider'
import OrbitDB from 'orbit-db'
import {startIPFS} from '../orbitdb/startIPFS'
import {log} from '../utils/loaderPrettyLog.js'

/**
 * Function executable in the command line to spin up a second ipfs node with a second orbit node
 * in order to migrate from another database and change the permissions.
 */
 const cp = async ourDBName => {
    log.action('starting second ipfs node...')
    let newDbName = ourDBName!==undefined?ourDBName:"notTheSame02" //process.env.DB_NAME
    const {ipfs,identity} = await startIPFS({'repo':'./ipfs-repo2'})
    const ourIdentity = identity || (await Identities.createIdentity({ id: "user" }))
    window.ipfs2 = ipfs;
    log.success('using Identity',ourIdentity)
    const odb = await OrbitDB.createInstance(ipfs, {
      ourIdentity,
      directory: "./odb2",
    });
    log.success('created new odb',odb)
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
    log.success('created new feed',feed)
  
    const capabilities = feed.access.capabilities
    log.msg("capabilities",capabilities)
  
    feed.events.on("replicated", async (dbAddress, count, newFeed, d) => {
      log.success("replicated - loading posts from db");
      log.msg("dbAddress", dbAddress);
      log.msg("count", count);
      log.msg("feed", newFeed);
    });
  
    feed.events.on("ready", async (dbAddress, feedReady) => {
      log.success("database ready " + dbAddress, feedReady);
      if(feed !== undefined) feed.all.map((e)=>console.log(e));
      else log.msg('feed is still undefined although ready')
  
      log.action('copying old feed into new feed')
      log.msg('old feed lenghth',store.feed.all.length)
      log.msg('new feed lenghth',feed.all.length)

      store.feed.all.map((e)=>{
        log.action("adding object",e)
        feed.add(e.payload.value)
      });
      
      log.msg('new feed lenghth',feed.all.length)
      log.msg('feed id',feed.id)
      window.feed2 = feed;
    });
  
    feed.load();
  
  }
  log.success('cp command for console loaded.')
  window.cp = cp;