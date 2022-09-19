import React from 'react';
import { observer } from 'mobx-react'
import { Box } from '@chakra-ui/react'
const Identity = (props) => {
    console.log("Identity feed",props.store?.feed)
    return (
        <Box fontSize='xs'>
            <div> My Identity: {props.store?.identity?.id} </div>
            <div> Odb Identity Id: {props.store?.odb?.identity.id} </div>
            <div> Odb Id: {props.store?.odb?.id} </div>
            <div> dbName: {props.store?.dbName} </div>
            <div> dbAddress: {props.store?.feed?.id} </div>
          </Box>
        )
}
export default observer(Identity)