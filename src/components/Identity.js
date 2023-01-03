import React,{useEffect} from 'react';
import { observer } from 'mobx-react'
import { Box,Input,FormLabel } from '@chakra-ui/react'

const Identity = (props) => {
    useEffect(() => {
        console.log("running useEffect inside Identity",props.store?.identity?.id)
    }, [props.store?.identity?.id]);
    return (
        <Box fontSize='xs'>
              <FormLabel htmlFor="myIdentity">My Identity:</FormLabel>
              <Input name="myIdentity" readOnly={true} value={props.store?.identity?.id}/>

              <FormLabel htmlFor="dbAddress">dbAddress:</FormLabel>
              <Input name="dbAddress" readOnly={true} value={props.store.feed?.id}/> 
          </Box>
        )
}
export default observer(Identity)