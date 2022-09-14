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
      const {ipfs,identity} = await startIPFS()
      const dbName = process.env.DB_NAME
      const options = {dbName: dbName};
      if(store.identity!==undefined) options.identity = identity
      await store.connect(ipfs,options)
  
      console.log("odb id:", store.odb.identity.id)
      console.log("dbName:",dbName)
    }
    conectIPFS()
    
  })
    return (
      <ChakraProvider>
          <Router>
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