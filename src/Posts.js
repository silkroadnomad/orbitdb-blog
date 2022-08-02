import React from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import './styles/Playlists.scss'
import CreatePost from './components/CreatePost'

const Post =({ post,deleteFunc }) => {
  return (
    <li>
      <Link to={`${post.address}`}>{post.name}</Link> &nbsp;
      <Link to="#" onClick={()=> deleteFunc(post.hash)}>del</Link>
    </li>
  )
}

const Posts = (props) => {

  const deletePost = async (address) => {
    const playlist = await props.store.removePost(address)
    console.log('deleted post ',playlist)
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <CreatePost {...props} />
      <ul className="playlist-items">
        {" "}
        {props.store.posts.map((post) => {
          return <Post key={post.hash} post={post} deleteFunc={deletePost} />;
        })}
      </ul>
    </div>
  )
}

export default observer(Posts)
