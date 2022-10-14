import React, { useState, useEffect } from "react"
import { Img } from '@chakra-ui/react'
import {loadImgURL} from '../utils/helper'

const OrbitImageComponent = ({...props}) => { 

    const MAX_BYTES = 100024000;
    const [url, setUrl] = useState()
    useEffect(() => {

        const loadData = async (cid,mimeType) => {
            const _url = await loadImgURL(props.store.ipfs,cid,mimeType, MAX_BYTES)
            setUrl(_url)
        }
        loadData(props.src,"images/jpeg")
        // props?.store?.currentMediaFeed?.all?.map((item)=>{
        //     if(item.payload.value.content===props.src){
                // loadData(props.src,item.payload.value.meta.mimeType)
            // }
        // })
       
    }, []);
     return (<Img  {...props} src={url} />)
}
export default OrbitImageComponent 