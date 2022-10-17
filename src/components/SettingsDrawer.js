import React  from "react"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button
} from "@chakra-ui/react"

import Identity from "./Identity";
import Capabilities from "./Capabilities";
import requestIdentity from "../orbitdb/requestIdentity";
import connectOrbit from "../orbitdb/connectOrbit";

function SettingsDrawer(props) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    const openMetamask = async () => { 
      const newIdentity = await requestIdentity()
      props.store.identity = newIdentity
      console.log('newIdentity for reloading orbit-db',newIdentity)
      connectOrbit(props.store)
    }

    return (
      <>
        <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        {props.store?.identity?.id!==undefined?props.store?.identity?.id.substring(0,10)+"..":'Connect'}
        </Button>
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
  
            <DrawerHeader>Identity & Permissions</DrawerHeader>
            <Button ref={btnRef} colorScheme='orange' onClick={openMetamask}>Metamask Connect</Button>
            <Identity store={props.store} />
            <DrawerBody>
                <Capabilities  {...props} />
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>Cancel</Button>
              {/*  <Button colorScheme='blue'>Save</Button> */}            
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }
export default SettingsDrawer