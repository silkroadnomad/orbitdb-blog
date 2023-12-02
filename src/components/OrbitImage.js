import React, { useEffect, useState } from "react";
import { connectOrbit } from '../orbitdb/connectOrbit';
import { loadImgURL } from '../utils/helper';
import { log } from '../utils/loaderPrettyLog.js';

const OrbitImage = (props) => {
    
    const MAX_BYTES = 100024000
    const [imgData, setImgData] = useState();

    useEffect(() => {

        const loadData = async () => {
            await connectOrbit(props.store,{noAuth:true})
            const cid = props.match.params.cid
            const mimeType = props.match.params.mime.replace('_','/')  
            if(cid!==undefined) 
              log.action("OrbitImage CID was requested in URL",cid)
            else 
              log.action('No image CID was recognized in URL',props.match.params)
              
            const _imgData = await loadImgURL(props.store.ipfs,cid,mimeType,MAX_BYTES)
            setImgData(_imgData)
        }
        loadData()

    }, [props.store.ipfs,props.store.identity]);

    return (
      <div>
        <img src={imgData} />
      </div>
    )
}

export default OrbitImage;