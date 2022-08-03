import React, { useState,useEffect } from "react";
import { observer } from 'mobx-react'
import '../styles/CreatePlaylist.scss'

const CreatePost = (props) => {

  const handleValues = (e) => {
    console.log('props.store.currentPost',props.store.currentPost?.subject)
    if(props.store.currentPost===undefined) props.store.currentPost = {}
    const {name,value} = e.target
    props.store.currentPost[name] = value
  }

  async function handleSubmit (event) {
    event.preventDefault()
    if (props.store.currentPost?.hash === undefined) {
      const newPost = await props.store.createNewPost()
      props.history.push("/")
      props.store.currentPost = undefined
    }else{
      await props.store.removePost()
      const newPost = await props.store.createNewPost() 
      props.history.push("/") //TODO maybe forward to new post address here
      props.store.currentPost = undefined
    }
    
  }

  return(
    <form onSubmit={handleSubmit}>
      <input name="subject" type="text" value={props.store.currentPost?.subject?props.store.currentPost?.subject:''} onChange={handleValues} placeholder="Subject" /><br/>
      <textarea name="body" type="text" value={props.store.currentPost?.body?props.store.currentPost?.body:''} cols={70} rows={10} onChange={handleValues}  placeholder="Body" />
      <br/>
      {props.store.currentPost?.hash===undefined?<input type="submit" value="Post" />:<input type="submit" value="Update" />}&nbsp;
      {props.store.currentPost?.hash!==undefined?<input type="button" value="Delete" onClick={() => {props.store.removePost();  props.store.currentPost = undefined; props.history.push("/")}}/>:''}

    </form>
  )
}

export default observer(CreatePost)
