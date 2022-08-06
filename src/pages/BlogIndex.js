import React, { useEffect, useState }  from "react"
import { Link } from "react-router-dom";
import { observer } from 'mobx-react'
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import CreatePost from "../components/CreatePost"
import ReactMarkdown from 'react-markdown'

const BlogIndex = (props) => {

  if (props.store.posts.length === 0) {
    return (
      <Layout location={props.location} title={props.store.data.title}>
        <Seo title="All posts" />
        <Bio />
        <p>
          {props.store.isOnline?'No blog posts found.':'Blog loading ...'} 
        </p>
        <CreatePost {...props} />
      </Layout>
    )
  }

  return (
    <Layout location={props.location} title={props.store.data.title}>
      <Seo title="All posts" />
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {props.store.posts.map((post,i) => {
          if(post.subject===undefined) return (<li key={"empty_"+i}>&nbsp;</li>) //for some reason elements stay undefined in stores array after deleting them
          const subject  = post.name || post.subject // post.frontmatter.title || post.fields.slug
          //const key = post.hash //post.fields.slug
          const slug = post.hash
          const postDate = post.createdAt?new Date(post.createdAt).toISOString():undefined
       
          return (
            <li key={slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={`${post.address}`} itemProp="url">
                      <span itemProp="headline">{subject}</span>
                    </Link>
                  </h2>
                  <small>Created: {postDate}</small>
                </header>
                <section><ReactMarkdown>{post.body}</ReactMarkdown></section>
              </article>
            </li>
          )
        })}
      </ol>
      <CreatePost {...props} />
    </Layout>
  )
}

export default observer(BlogIndex) 