import React, { useEffect,useState } from "react"
import { ChakraProvider } from '@chakra-ui/react'
import { HashRouter as Router, Route } from 'react-router-dom'
import connectOrbit from './orbitdb/connectOrbit'
import {log} from './utils/loaderPrettyLog.js'

import store from './store/BlogStore'
import BlogPost from './components/BlogPost'
import Settings from './components/Settings'
import StartPage from './pages/StartPage'

import './console/help'
import './console/cp' //javascript console browser 
import './console/dropCurrentMediaFeed'
import './styles/style.css'
import './styles/normalize.css'

import {loadImgURL} from './utils/helper'


const App = () => {

  const OrbitImage = (props) => {
    
    const MAX_BYTES = 100024000
    const [imgData, setImgData] = useState();
  
    useEffect(() => {

        const loadData = async () => {
            await connectOrbit(store,{noAuth:true})
            const cid = props.match.params.cid
            const mimeType = props.match.params.mime.replace('_','/')  
            if(cid!==undefined) 
              log.action("orbitimage CID was requeested in url",cid)
            else 
              log.action('no image CID was recognissed in url',props.match.params)
              
            const _imgData = await loadImgURL(props.store.ipfs,cid,mimeType,MAX_BYTES)
            setImgData(_imgData)
        }
        loadData()

    }, [props.store.ipfs,props.store.identity]);

    return (
      <div>
        <img src={imgData} />
      </div>
    )
  }

  useEffect(() => {
    log.msg("url hash in browser was",window.location.hash)
    if(window.location.hash.indexOf('#/images/')===-1)
      connectOrbit(store) //don't load orbit again when loading an image from ipfs via OrbitImage
      log.success('dbName in store ',store.dbName)
  },[store.dbName])
    return (
      <ChakraProvider>
          <Router>
            <Route path="/images/:cid/:mime" component={props => <OrbitImage {...props} store={store} />}/>  
            <Route exact path="/tag/:tag" component={props => <StartPage {...props} store={store} />}/>  
            <Route path="/orbitdb/:hash/:name" component={(props) => <BlogPost {...props} store={store}/> }/>
            <Route path="/db/:hash/:name" component={props => <StartPage {...props} store={store} />}/>
            <Route exact path="/" component={props => <StartPage {...props} store={store} />}/>
            <Route exact path="/settings" component={props => <Settings {...props} store={store} />}/>
          </Router>
      </ChakraProvider>
    )
}
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App/>);