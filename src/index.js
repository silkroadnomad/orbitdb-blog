import React, { useEffect,useState } from "react"
import { ChakraProvider } from '@chakra-ui/react'
import { HashRouter as Router, Route } from 'react-router-dom'
import OrbitImage from './components/OrbitImage';
import BlogPost from './components/BlogPost'
import Settings from './components/Settings'
import BlogIndex from './pages/BlogIndex'
import connectOrbit from './orbitdb/connectOrbit'
import store from './store/BlogStore'
import {log} from './utils/loaderPrettyLog.js'

import './console/help'
import './console/cp' //javascript console browser 
import './console/dropCurrentMediaFeed'
import './styles/normalize.css'
import './styles/style.css'

const App = () => {

  useEffect(() => {
    log.msg("URL hash in browser is",window.location.hash)
    if(window.location.hash.indexOf('#/images/')===-1)
      connectOrbit(store) //don't load orbit again when loading an image from IPFS via OrbitImage
      log.success('Database name in store is',store.dbName)
  },[store.dbName])
    return (
      <ChakraProvider>
          <Router>
            <Route path="/images/:cid/:mime" component={props => <OrbitImage {...props} store={store} />}/>  
            <Route exact path="/tag/:tag" component={props => <BlogIndex {...props} store={store} />}/>  
            <Route path="/orbitdb/:hash/:name" component={(props) => <BlogPost {...props} store={store}/> }/>
            <Route path="/db/:hash/:name" component={props => <BlogIndex {...props} store={store} />}/>
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