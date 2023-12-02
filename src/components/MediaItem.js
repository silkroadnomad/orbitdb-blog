import React, {useEffect,useState} from "react"
import { Box, Image } from '@chakra-ui/react'
import {loadImgURL} from '../utils/helper'
import { ContextMenu } from 'chakra-ui-contextmenu';
import { MenuList, MenuItem } from '@chakra-ui/menu';
import {log} from '../utils/loaderPrettyLog.js'
const MediaItem = (props) => {

    const [imgData, setImgData] = useState();
    const MAX_BYTES = 100024000

    useEffect(() => {
        log.action("requesting media item of of media feed from ipfs ",props?.item?.payload?.value?.meta)
        const loadData = async () => {
            const _imgData = await loadImgURL(props.store.ipfs,
                  props.item.payload.value.content,
                  props.item.payload.value?.meta?.mimeType, MAX_BYTES);
            setImgData(_imgData)
        }
        loadData()
    }, []);

    const makeDefaultPhoto = async () => {
      log.action(`making this cid default photo for the post ${props.store.currentMediaFeed.id} `,props.item.hash)
      await props.store.removePost()
      const currentPost = props.store.currentPost 
      currentPost["photoCID"] = props.item.payload.value.content
      props.store.setCurrentPost(currentPost)
      await props.store.createNewPost(true) 
      log.success('made default photo',props.store.currentPost.photoCID)

    }

    const deleteMediaItem = () => {
      log.action(`deleting media item from mediafeed ${props.store.currentMediaFeed.id} `,props.item.hash)
      props.store.currentMediaFeed.remove(props.item.hash);
      log.success('deleted!')
    }

            // <Box key={props.item.payload.value.content} boxSize='sm'>
        //     <Image key={"i_"+props.item.payload.value.content} src={imgData} alt={props.item.payload.value.meta.name}  />
        // </Box>
    return (
      <ContextMenu
        renderMenu={() => (
          <MenuList>
            <MenuItem onClick={() => makeDefaultPhoto()} >Make default photo</MenuItem>
            <MenuItem onClick={() => deleteMediaItem()}  >Delete</MenuItem>
          </MenuList>
        )}
      >
        {ref => (
          <div ref={ref} key={props.item.payload.value.content}>
            <Image
              boxSize="100px"
              objectFit="cover"
              key={"i_" + props.item.payload.value.content}
              src={imgData}
              alt={props.item.payload.value.meta?.name}
            />
            <div>CID:{props.item.payload.value.content}</div>
          </div>

        )}
      </ContextMenu>
    )

}
export default MediaItem