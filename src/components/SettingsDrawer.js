import React  from "react"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Button,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react"

import Identity from "./Identity";
import Capabilities from "./Capabilities";
import requestIdentity from "../orbitdb/requestIdentity";
import connectOrbit from "../orbitdb/connectOrbit";

export function SettingsDrawer(props) {

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
        <Button ref={btnRef} padding={5} spac colorScheme='teal' onClick={onOpen}>
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
          <DrawerBody>
            <Tabs isFitted variant='enclosed'>
              <TabList mb='1em'>
                <Tab>ID</Tab>
                <Tab>Access</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Button ref={btnRef} padding={5} colorScheme='orange' onClick={openMetamask}>Connect Metamask</Button>
                  <Identity store={props.store} />
                </TabPanel>
                <TabPanel>
                  <Capabilities  {...props} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>            
            <DrawerFooter> 
            <Button variant='outline' mr={3} onClick={onClose}>X</Button>
                {/*
                  <DrawerHeader>Identity & Permissions</DrawerHeader>
                            <DrawerCloseButton />
                  <Button variant='outline' mr={3} onClick={onClose}>Close</Button>  <Button colorScheme='blue'>Save</Button> */}            
              </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }
export default SettingsDrawer