import React, { useState, useEffect } from "react"
import { observer } from 'mobx-react'
import ReactMarkdown from 'react-markdown'
import Bio from "./bio"
import Layout from "./layout"
import Seo from "./seo"
import CreatePost from "./CreatePost"

const BlogPost = (props) => {

  const [comments, setComments] = useState([])
  // const { previous, next } = data
  let mounted = true
  const address = '/orbitdb/' + props.match.params.hash + '/' + props.match.params.name

  useEffect(() => {
   
    function load () {
      props.store.joinBlogPost(address).then(() => {
        if (mounted) {
          setComments(props.store.currentPost.all)
          props.store.currentPost.events?.on('replicated', () => {
            setComments(props.store.currentPost.all)
          })
        }
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
        title={props.store.currentPost.subject?props.store.currentPost?.subject:''}
        description={props.store.currentPost.body?props.store.currentPost.body:''}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{props.store.currentPost?.subject}</h1>
          <p>{props.store.currentPost?.date}</p>
        </header>

        <ReactMarkdown>{props.store.currentPost?.body}</ReactMarkdown>

        <hr />
        <CreatePost {...props} />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
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
          {
            // <li>
            //   {previous && (
            //     <Link to={previous.fields.slug} rel="prev">
            //       ← {previous.frontmatter.title}
            //     </Link>
            //   )}
            // </li>
            // <li>
            //   {next && (
            //     <Link to={next.fields.slug} rel="next">
            //       {next.frontmatter.title} →
            //     </Link>
            //   )}
            // </li>
          }
        </ul>
      </nav>
    </Layout>
  )
}

export default observer(BlogPost) 
