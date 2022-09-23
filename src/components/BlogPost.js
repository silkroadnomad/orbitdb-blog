import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { Divider,HStack,Tag,TagLabel,TagCloseButton } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { observer } from 'mobx-react'
import { getDataTransferFiles } from '../utils/helper.js'
import Bio from "./bio"
import Layout from "./layout"
import Seo from "./seo"
import CreatePost from "./CreatePost"
import MediaItem from "./MediaItem"

const BlogPost = (props) => {

  const [dragActive, setDragActive] = useState(false)

  async function onDrop (event) {
    event.preventDefault()
    setDragActive(false)
    const files = getDataTransferFiles(event)

    try {
      await store.sendFiles(files, address)
      setMedia(props.store.currentMediaFeed?.all)
    } catch (err) {
      console.log("ERROR", err)
      throw err
    }
 }

  const [media, setMedia] = useState([])
  const [nextPost,setNextPost] = useState({address:'#'})
  const [previousPost,setPreviousPost] = useState({address:'#'})
  let mounted = true
  const address = '/orbitdb/' + props.match.params.hash + '/' + props.match.params.name
  
  useEffect(() => {
    
    function load () {
      setNextPost( props.store.nextPost(address))
      setPreviousPost( props.store.previousPost(address))
      props.store.joinBlogPost(address).then(() => {
        if (mounted) {
          console.log('loading')
          setMedia(props.store.currentMediaFeed?.all)
          props.store.currentMediaFeed?.events?.on('replicated', () => {
            console.log("REPLICATED")
            setMedia(props.store.currentMediaFeed?.all)
          })
        }
      },() =>{
        console.log('failed loading previous and next post')
      })
    }
    
    load()
    return () => {
      setMedia([])
      mounted = false
    }
  }, [props.store.isOnline,address])

  return (
    <Layout location={props.location} title={props.store.currentPost?.subject}>
      <Seo
        title={
          props.store.currentPost?.subject
            ? props.store.currentPost?.subject
            : ""
        }
        description={props.store.currentPost?.body ? props.store.currentPost?.body : ""}
      />
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            <Link to={previousPost?.address} rel="prev">
              {previousPost?.subject}
            </Link>
          </li>
          <li>
            <Link to={nextPost?.address} rel="next">
              {nextPost?.subject}
            </Link>
          </li>
        </ul>
      </nav>
      <Divider />

      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 style={{ fontSize: "2em" }} itemProp="headline">
            {props.store.currentPost?.subject}
          </h1>
          <p>
            <Moment fromNow ago>
              {props.store.currentPost?.createdAt}
            </Moment>{" "}
            ago &nbsp;
            <Moment date={props.store.currentPost?.createdAt} />
          </p>
        </header>

        <ReactMarkdown>{props.store.currentPost?.body}</ReactMarkdown>

        <HStack spacing={4}>
          {props.store.currentPost?.tags?.map(tagName => (
            <Tag
              size={"md"}
              key={tagName}
              borderRadius="full"
              variant="solid"
              colorScheme="red"
            >
              <TagLabel>{tagName}</TagLabel>
            </Tag>
          ))}
        </HStack>
        <div
          className="dragZone"
          onDragOver={event => {
            event.preventDefault()
            !dragActive && setDragActive(true)
          }}
          onDrop={event => onDrop(event)}
        >
          <h2 className="message">
            Drag audio files here to add them to the playlist
          </h2>
        </div>
        {
          media?.map(item => (<MediaItem item={item} store={store} />))
        }
  
        <Divider />
        <CreatePost {...props} />
        <Divider />
        <footer>
          <Bio />
        </footer>
      </article>
      <Divider />
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            <Link to={previousPost?.address} rel="prev">
              {previousPost?.subject}
            </Link>
          </li>
          <li>
            <Link to={nextPost?.address} rel="next">
              {nextPost?.subject}
            </Link>
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default observer(BlogPost) 
