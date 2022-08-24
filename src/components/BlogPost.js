import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { Divider } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { observer } from 'mobx-react'
import Bio from "./bio"
import Layout from "./layout"
import Seo from "./seo"
import CreatePost from "./CreatePost"

const BlogPost = (props) => {

  const [comments, setComments] = useState([])
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
          setComments(props.store.currentPost.all)
          props.store.currentPost.events?.on('replicated', () => {
            setComments(props.store.currentPost.all)
          })
        }
      },() =>{
        console.log('failed loading previous and next post')
      })
    }
    load()
    return () => {
      setComments([])
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
        description={
          props.store.currentPost?.body ? props.store.currentPost?.body : ""
        }
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

          <h1 style={{fontSize:"2em"}} itemProp="headline">{props.store.currentPost?.subject}</h1>
          <p>
            <Moment fromNow ago>
              {props.store.currentPost?.createdAt}
            </Moment>{" "}
            ago &nbsp;
            <Moment date={props.store.currentPost?.createdAt} />
          </p>
        </header>

        <ReactMarkdown>{props.store.currentPost?.body}</ReactMarkdown>

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
