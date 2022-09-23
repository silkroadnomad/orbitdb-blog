import React, {useEffect,useState} from "react"
import { Box, Image } from '@chakra-ui/react'
import {loadImgURL} from '../utils/helper'
const MediaItem = (props) => {

    const [imgData, setImgData] = useState();

    useEffect(() => {
        const loadData = async () => {
            const _imgData = await loadImgURL(props.store.ipfs,props.item.payload.value.content,props.item.payload.value.meta.mimeType, 1024000);
            setImgData(_imgData)
        }
        loadData()
    }, []);
    
    return (
        <Box key={props.item.payload.value.content} boxSize='sm'>
            <Image key={"i_"+props.item.payload.value.content} src={imgData} alt={props.item.payload.value.meta.name}  />
        </Box>
    )

}
export default MediaItem