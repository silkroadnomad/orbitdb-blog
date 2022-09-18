import React, { useEffect } from "react"
import { ChakraProvider } from '@chakra-ui/react'
import { HashRouter as Router, Route } from 'react-router-dom'
import {startIPFS} from './orbitdb/startIPFS'
import store from './store/BlogStore'
import BlogPost from './components/BlogPost'
import Settings from './components/Settings'
import BlogIndex from './pages/BlogIndex'

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

const test = () => {
  console.log('called test function')
}
window.test = test;