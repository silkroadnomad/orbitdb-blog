import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {create} from 'ipfs'
import store from './store/BlogStore'
import BlogPost from './components/BlogPost'
import BlogIndex from './pages/BlogIndex'
import './styles/style.css'
import './styles/normalize.css'

class App extends React.Component {
  async componentDidMount () {
    const ipfs = await create({
      repo: './ipfs-repo',
      EXPERIMENTAL: { pubsub: true },
      preload: { "enabled": false },
      config: {
        // Bootstrap: [
        // ],
        Addresses: {
          Swarm: [
            // Use IPFS dev webrtc signal server
            '/dns6/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
            '/dns4/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
            // Use local signal server
            // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
          ]
        },
      }
    })
    await store.connect(ipfs)
    console.log("odb id:", store.odb.identity.id)
  }

  render() {
    return (
      <div>
        <Router>
          <Route path="/orbitdb/:hash/:name" component={(props) => <BlogPost {...props} store={store}/> }/>
          <Route exact path="/" component={props => <BlogIndex {...props} store={store} />}/>
        </Router>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
