import React, { useState, useEffect } from "react"
import { Img } from '@chakra-ui/react'
import {loadImgURL} from '../utils/helper'

const OrbitImageComponent = ({...props}) => { 

    const [url, setUrl] = useState()
    useEffect(() => {
        const loadData = async (cid) => {
            console.log('loading image',cid)
            const _url = await loadImgURL(props.store.ipfs,cid)
            setUrl(_url)
        }
        loadData(props.src)       
    }, []);
     return (<Img  {...props} src={url} />)
}
export default OrbitImageComponent 