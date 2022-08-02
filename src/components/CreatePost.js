import React, { useState,useEffect } from "react";
import '../styles/CreatePlaylist.scss'

const CreatePost = (props) => {

  const [post,setPost] = useState({subject:'',body:""})

  const handleValues = (e) => {
    const {name,value} = e.target
    const newPost = {...post,[name]:value}
    props.updateHandler(newPost)
    setPost(newPost)
  }

  
  async function handleSubmit (event) {
    event.preventDefault()
    const newPost = await props.store.createNewPost(post.subject,post.body) //TODO give createdAt time to post if exists  
    console.log("Created",newPost)
    //TODO delete old post for update? props.post !== undefined
    props.history.push('/');
  }
  
  useEffect(() => {
    setPost({'subject':props?.post?.subject,'body':props?.post?.body})
  }, [props?.post]);

  return(
    <form onSubmit={handleSubmit}>
      <input name="subject" type="text" value={post?.subject} placeholder="Subject" onChange={handleValues} /><br/>
      <textarea name="body" type="text" value={post?.body} cols={70} rows={10} placeholder="Body" onChange={handleValues} />
      <br/>
      {props.post===undefined?<input type="submit" value="Post" />:<input type="submit" value="Update" />}
    </form>
  )
}

export default CreatePost
