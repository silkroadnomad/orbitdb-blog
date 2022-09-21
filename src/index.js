import React, { useEffect } from "react"
import { ChakraProvider } from '@chakra-ui/react'
import { HashRouter as Router, Route } from 'react-router-dom'
import {startIPFS} from './orbitdb/startIPFS'
import store from './store/BlogStore'
import BlogPost from './components/BlogPost'
import Settings from './components/Settings'
import BlogIndex from './pages/BlogIndex'

import Identities from 'orbit-db-identity-provider'
import OrbitDB from 'orbit-db'

import './styles/style.css'
import './styles/normalize.css'

const App = () => {

  useEffect(() => {

    const conectIPFS = async () => {
      console.log("running connectIFS with dbName",store.dbName)
      const {ipfs,identity} = await startIPFS()
      let dbName = process.env.DB_NAME
      dbName = store.dbName
      const options = {dbName: dbName};
      if(store.identity!==undefined) options.identity = identity
      await store.connect(ipfs,options)
  
      console.log("odb id:", store.odb.identity.id)
      console.log("dbName:",dbName)
      console.log("store.feed.id:", store.feed.id)
    }
    conectIPFS()
    
  },[store.dbName])
    return (
      <ChakraProvider>
          <Router>
          <Route path="/address/:hash" component={props => <BlogIndex {...props} store={store} />}/>  
          <Route path="/address/:hash/:name" component={props => <BlogIndex {...props} store={store} />}/>
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
window.cp = cp;