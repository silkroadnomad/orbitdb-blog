import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { Divider,HStack,Tag,TagLabel,Img } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { observer } from 'mobx-react'
import Bio from "./bio"
import Layout from "./layout"
import Seo from "./seo"
import CreatePost from "./CreatePost"
import MediaItem from "./MediaItem"
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import OrbitImageComponent from "./OrbitImageComponent";


const BlogPost = (props) => { 

  const [media, setMedia] = useState([])

  const [nextPost,setNextPost] = useState({address:'#'})
  const [previousPost,setPreviousPost] = useState({address:'#'})

  const address = '/orbitdb/' + props.match.params.hash + '/' + props.match.params.name
  const getOrbitImageComponent = (otherProps) => {
    return (<OrbitImageComponent store={props.store} {...otherProps}/>)
  }

  useEffect(() => {
  
    function load () {
      setNextPost( props.store.nextPost(address))
      setPreviousPost( props.store.previousPost(address))

      props.store.joinBlogPost(address,media,setMedia)
    }
    
    load()

    return () => {
      setMedia([])  
    }
  }, [props.store.isOnline,address])
  
  return (
    <Layout location={props.location} title={props.store.currentPost?.subject} store={props.store}>
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
        key={"0"}
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
              {props.store.currentPost?.postDate}
            </Moment>{" "}
            ago &nbsp;
            <Moment date={props.store.currentPost?.postDate} />
          </p>
        </header>
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
        <ReactMarkdown components={{ChakraUIRenderer, img: getOrbitImageComponent } }>{props.store.currentPost?.body}</ReactMarkdown>

        {
          media?.map((item,i) => (<MediaItem key={i} item={item} store={store} />))
        }

        <Divider />
        <footer>
          <Bio />
        </footer>
      </article>
      <Divider />
      <CreatePost {...props} refreshFunc={setMedia} />

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