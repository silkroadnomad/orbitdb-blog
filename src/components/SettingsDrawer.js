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
  Button, Input
} from "@chakra-ui/react"
import Identity from "./Identity";
import Capabilities from "./Capabilities";

function SettingsDrawer(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    return (
      <>
        <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        {props.store?.identity?.id!==undefined?props.store?.identity?.id.substring(0,10)+"..":'Authenticate'}
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