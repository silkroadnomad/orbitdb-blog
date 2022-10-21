import React, {useEffect,useState} from "react";
import { observer } from 'mobx-react'
import { Button, Input,Textarea,Stack,Box } from '@chakra-ui/react'
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons'
import { getDataTransferFiles } from '../utils/helper.js'
import '../styles/CreatePlaylist.scss'
import moment from 'moment'
const CreatePost = (props) => {

  const [dragActive, setDragActive] = useState(false)
  async function onDrop (event) {
    event.preventDefault()
    setDragActive(false)
    const files = getDataTransferFiles(event)

    try {
      console.log("props.store.currenMediaFeed.id",props.store.currentMediaFeed.id)
      await store.sendFiles(files, props.store.currentMediaFeed.id)
      console.log('media feed length now:',props.store.currentMediaFeed?.all.length)
      props.refreshFunc(props.store.currentMediaFeed?.all)
    } catch (err) {
      console.log("ERROR", err)
      throw err
    }
 }

  function getHashTags(inputText) {  
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var matches = [];
    var match;
    while ((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }
    return matches;
  }

  const handleValues = (e) => {
    if(props.store.currentPost===undefined) props.store.currentPost = {}
    let {name,value} = e.target
      console.log("name",name)
      console.log("value",value)
    if(name === "postDate" && value.length===10){ 
        if(moment(value).isValid()){
          const currentPost = props.store.currentPost
          currentPost["postDate"] = value
          props.store.setCurrentPost(currentPost) 
        }
    }
    else {
      if(value.indexOf("#")!==undefined){
        const tags = getHashTags(value)
        props.store.setTagsOfCurrentPost(tags)
      }

      const currentPost = props.store.currentPost
      currentPost[name] = value
      props.store.setCurrentPost(currentPost) 
    }
  }

  async function handleSubmit (event) {
    event.preventDefault()
    if (props.store.currentPost?.hash === undefined) {
      await props.store.createNewPost()
      props.history.push("/")
      props.store.currentPost = undefined
    }else{
      //udpate existing post (first delete old and then create new one - don't create new media feed in such a situation)
      await props.store.removePost()
      await props.store.createNewPost(true) //true means update 
      props.history.push("/") 
      props.store.currentPost = undefined
    } 
  }

  const [canAppend, setCanAppend] = useState();
  useEffect(() => {
    setCanAppend(props.store.canWrite(props.store?.identity?.id))
  }, [props.store?.feed]);

  return !canAppend ? (
    ""
  ) : (
    <form onSubmit={handleSubmit}>
        <Input
        name="subject"
        type="text"
        value={
          props.store.currentPost?.subject ? props.store.currentPost?.subject : ""
        }
        onChange={handleValues}
        placeholder="Subject"
      />
      <br />
      <Textarea
        name="body"
        type="text"
        defaultValue={
          props.store.currentPost?.body ? props.store.currentPost?.body : ""
        }
        cols={70}
        rows={10}
        onBlur={handleValues}
        placeholder="Body"
      />
      <br />

      {
        (props.store.currentPost?.address!==undefined)?(
      <Box
        boxSize="sm"
        bg="tomato"
        w="100%"
        className="dragZone"
        onDragOver={event => {
          event.preventDefault()
          // event.originalEvent.dataTransfer.setData('text/plain', 'anything');
          !dragActive && setDragActive(true)
        }}
        onDrop={event => onDrop(event)}
      >
        <h2 className="message">Drag media files here to add them to the blog post</h2>
      </Box>):("")}
      
      <br />
      <Input
          name="postDate"
          type="text"
          // value={  props.store.currentPost?.postDate!==undefined?props.store.currentPost?.postDate:props.store.currentPost?.createdAt!==undefined?moment(props.store.currentPost?.createdAt).format("YYYY-MM-DD"):moment(new Date()).format("YYYY-MM-DD") }
          defaultValue={ props.store.currentPost?.postDate!==undefined?props.store.currentPost?.postDate:moment(new Date()).format("YYYY-MM-DD")}
          onChange={handleValues}
          placeholder="Post Date"
      /> 
      <br/>
      <Stack direction="row" spacing={4} align="center">
        {props.store.currentPost?.hash === undefined ? (
          <Button
            type="submit"
            colorScheme="teal"
            variant="solid"
            leftIcon={<AddIcon />}
          >
            Post
          </Button>
        ) : (
          <Button
            type="submit"
            colorScheme="teal"
            variant="solid"
            leftIcon={<EditIcon />}
          >
            Update
          </Button>
        )}
        {props.store.currentPost?.hash !== undefined ? (
          <Button
            type="submit"
            colorScheme="teal"
            variant="solid"
            leftIcon={<DeleteIcon />}
            onClick={() => {
              props.store.removePost()
              props.store.currentPost = undefined
              props.history.push("/")
            }}
          >
            Delete
          </Button>
        ) : (
          ""
        )}
      </Stack>
    </form>
  )
}

export default observer(CreatePost)
