import React, { useEffect } from "react"
import { ChakraProvider } from '@chakra-ui/react'
import { HashRouter as Router, Route } from 'react-router-dom'
import connectOrbit from './orbitdb/connectOrbit'

import store from './store/BlogStore'
import BlogPost from './components/BlogPost'
import Settings from './components/Settings'
import BlogIndex from './pages/BlogIndex'

import './console/help'
import './console/cp' //javascript console browser 
import './console/dropCurrentMediaFeed'

import './styles/style.css'
import './styles/normalize.css'

const App = () => {

  useEffect(() => {
    connectOrbit(store)
  },[store.dbName])
    return (
      <ChakraProvider>
          <Router>
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