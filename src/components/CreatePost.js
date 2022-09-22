import React, {useEffect,useState} from "react";
import { observer } from 'mobx-react'
import { Button, Input,Textarea,Stack,HStack,Tag,TagLabel,TagCloseButton } from '@chakra-ui/react'
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons'
import '../styles/CreatePlaylist.scss'

const CreatePost = (props) => {

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
    const {name,value} = e.target
    if(value.indexOf("#")!=undefined){
      const tags = getHashTags(value)
      props.store.setTagsOfCurrentPost(tags)
    } 
    props.store.currentPost[name] = value
   }

  async function handleSubmit (event) {
    event.preventDefault()
    if (props.store.currentPost?.hash === undefined) {
      await props.store.createNewPost()
      props.history.push("/")
      props.store.currentPost = undefined
    }else{
      await props.store.removePost()
      await props.store.createNewPost() 
      props.history.push("/") 
      props.store.currentPost = undefined
    } 
  }
  const [canAppend, setCanAppend] = useState();
  useEffect(() => setCanAppend(props.store.canWrite(props.store?.identity?.id)), []);

  
  return !canAppend ? ("") : (
    <form onSubmit={handleSubmit}>
      <Input
        name="subject"
        type="text"
        value={
          props.store.currentPost?.subject
            ? props.store.currentPost?.subject
            : ""
        }
        onChange={handleValues}
        placeholder="Subject"
      />
      <br />
      <Textarea
        name="body"
        type="text"
        value={
          props.store.currentPost?.body ? props.store.currentPost?.body : ""
        }
        cols={70}
        rows={10}
        onChange={handleValues}
        placeholder="Body"
      />
      <br />
      <br />
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
