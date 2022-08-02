import React, { useState, useEffect } from "react"
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import './styles/Playlist.scss'
import { getDataTransferFiles } from './helper.js'

const Header = ({ title }) => {
  return (
    <div className='header'>
      <Link to={`/`} title="Back to Home"> .. </Link>
      <div id='title'>{title}</div>
    </div>
  )
}

const Posts = (props) => {
  const [items, setItems] = useState([])
  const [dragActive, setDragActive] = useState(false)

  let mounted = true
  const address = '/orbitdb/' + props.match.params.hash + '/' + props.match.params.name

  useEffect(handlePlaylistNameChange, [address,dragActive])

  function handlePlaylistNameChange () {
    console.log('handlePlaylistNameChange')
    function load () {
      console.log('loading')
      props.store.joinPlaylist(address).then(() => {
        console.log('joined ',address)
        if (mounted) {
          setItems(props.store.currentPost.all)
          props.store.currentPost.events.on('replicated', () => {
            console.log('comments replicated')
            setItems(props.store.currentPost.all)
          })
        }
      })
    }
    load()

    return () => {
      setItems([])
      mounted = false
    }
  }

  async function onDrop (event) {
     event.preventDefault()
     setDragActive(false)
     const files = getDataTransferFiles(event)
     try {
       await store.sendFiles(files, address)
       console.log(props.store.currrentPost)
       setItems(props.store.currrentPost.all)
     } catch (err) {
       console.log("ERROR", err)
       throw err
     }
  }

  const Post = ({ name, hash }) => {
    return (
      <div className='playlist-item' onClick={() => console.log(hash)}>{name}</div>
    )
  }

  return (
    <div className='Playlist'>
      <Header title={props.match.params.name} />
      <div className='dragZone'
          onDragOver={event => {
              event.preventDefault()
              !dragActive && setDragActive(true)
            }
          }
          onDrop={event => onDrop(event)}>
          <ul> {
  
            items.map(item => (
              <Post key={item.hash} name={item.payload.value.meta.name} hash={item.payload.value.content}/>
            )
          )}
          </ul>
        <h2 className="message">Drag audio files here to add them to the playlist</h2>
      </div>
    </div>
  )
}

const PostView = (props) => props.store.isOnline ? (<Posts {...props}/>) : null
export default observer(PostView)
