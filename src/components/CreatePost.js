import React, { useState,useEffect } from "react";
import { observer } from 'mobx-react'
import '../styles/CreatePlaylist.scss'

const CreatePost = (props) => {

  const handleValues = (e) => {
    const {name,value} = e.target
    props.store.currentPost[name] = value
  }

  async function handleSubmit (event) {
    event.preventDefault()
    if (props.post === undefined) {
      const newPost = await props.store.createNewPost()
      console.log("Created", newPost)
      props.history.push("/")
    }else{
      const newPost = await props.store.createNewPost() //TODO give createdAt time to post if exists
      console.log("Created", newPost)
    }
    //TODO delete old post for update? props.post !== undefined
    
  }

  return(
    <form onSubmit={handleSubmit}>
      <input name="subject" type="text" value={props.store.currentPost.subject?props.store.currentPost.subject:''} onChange={handleValues} placeholder="Subject" /><br/>
      <textarea name="body" type="text" value={props.store.currentPost.body?props.store.currentPost.body:''} cols={70} rows={10} onChange={handleValues}  placeholder="Body" />
      <br/>
      {props.post===undefined?<input type="submit" value="Post" />:<input type="submit" value="Update" />}
    </form>
  )
}

export default observer(CreatePost)
