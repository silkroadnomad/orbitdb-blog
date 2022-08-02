import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";

import Bio from "./bio"
import Layout from "./layout"
import Seo from "./seo"
import CreatePost from "./CreatePost"

const BlogPost = (props) => {

  const [comments, setComments] = useState([])
  const [post, setPost] = useState()
  // const { previous, next } = data
  let mounted = true
  const address = '/orbitdb/' + props.match.params.hash + '/' + props.match.params.name

  useEffect(() => {
    console.log('useEffect')
    const ourPost = props.store.posts.filter((item)=>{return item.address === address})
    setPost(ourPost[0])

    function load () {
      props.store.joinBlogPost(address).then(() => {
        if (mounted) {
          setComments(props.store.currentPost.all)
          // props.store.currentPost?.events.on('replicated', () => {
          //   setComments(props.store.currentPost.all)
          // })
        }
      })
    }
    load()

    return () => {
      setComments([])
      mounted = false
    }
  }, [address,post])

  return (
    <Layout location={props.location} title={post?.subject}>
      <Seo title={post?.subject} description={post?.body || post?.excerpt} />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post?.subject}</h1>
          <p>{post?.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post?.body }}
          itemProp="articleBody"
        />
        <hr />
        <CreatePost {...props} post={post} updateHandler={(post) => {setPost(post); console.log("newPost",post)}} />
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

export default BlogPost
