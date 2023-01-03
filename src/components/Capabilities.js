import React, {useState,useEffect} from 'react';
import { useForm } from "react-hook-form";
import { observer } from 'mobx-react'
import { values } from "mobx"
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  UnorderedList,
  ListItem,
  RadioGroup,
  Radio,
  Stack,
  h1
} from "@chakra-ui/react";

const Capabilities = (props) => {

    const [capabilitiesChanged, setCapabilitiesChanged] = useState(false);
    const [writeList, setWriteList] = useState([]);
    const [adminList, setAdminList] = useState([]);
    
    const addPermission = async (values) => {
      console.log('granting '+values.permission+" permission to ",values.identity)
      props.store.feed.access.grant(values.permission,values.identity);
      props.store.capabilities = props.store.feed.access.capabilities

      //change permission recursivly of all posts feeds //TODO do this only if wanted 
      props.store.feed.all.forEach(async (f) => {
        console.log(f)
        const mediaFeedOfPost = props.store.odb.stores[f.payload.value.address] || await props.store.odb.open(f.payload.value.address)
        await mediaFeedOfPost.load()
        mediaFeedOfPost.access.grant(values.permission,values.identity);
        console.log(`granting ${values.permission} permission for id:${values.identity} for feed ${f.payload.value.address}`) 
      });
      await props.store.connect()
      setCapabilitiesChanged(!capabilitiesChanged)
    }

    const removePermission = async (e,a) => {
      const permission = e.target.name
      const identity = e.target.value
      e.preventDefault();
      console.log('remove '+permission+" permission from ",identity)
      props.store.feed.access.revoke(permission,identity);
      props.store.capabilities = props.store.feed.access.capabilities
      //change permission recursivly of all posts feeds
      props.store.feed.all.forEach( async (f) =>{
        console.log(f)
          const mediaFeedOfPost = props.store.odb.stores[f.payload.value.address] || await props.store.odb.open(f.payload.value.address)
          await mediaFeedOfPost.load()
          mediaFeedOfPost.access.revoke(permission,identity);
          console.log(`revoking ${permission} permission for id:${identity} for feed ${f.payload.value.address}`) 
      });
      await props.store.connect()
      setCapabilitiesChanged(!capabilitiesChanged)
    }

    useEffect(() => {
      console.log('running useEffect inside Capabilities')
      let _capabilities
      if(props.store?.capabilities!==undefined) _capabilities = values( props.store?.capabilities)
      console.log('_capabilities',_capabilities)
      // setCapabilities(_capabilities)
  
      let _adminList,_writeList = []
      if(_capabilities !==undefined && _capabilities.length>0 && _capabilities[0]){
        _writeList = values(_capabilities[0]).map((d,i) => <ListItem key={d+i}>{d} <Button key={"button"+d+i} name={"write"} value={d} onClick={ (e) => removePermission(e) }>Remove write permission</Button></ListItem>);//console.log("capabilities[0]", values(capabilities[0]))
        console.log('_writeList',_writeList)
        setWriteList(_writeList)
      }
  
      if(_capabilities !==undefined && _capabilities.length>0 && _capabilities[1]){
        _adminList = values(_capabilities[1]).map((d,i) => <ListItem key={d+i}>{d} <Button key={"button"+d+i} name={"admin"} value={d} onClick={ (e) => removePermission(e) }>Remove  admin permission</Button></ListItem>);//console.log("capabilities[0]", values(capabilities[0]))      
        console.log('_adminList',_adminList)
        setAdminList(_adminList)
      }

    }, [capabilitiesChanged]);


    const { handleSubmit,register, formState: { errors, isSubmitting }} = useForm();

    return (
      <div>
        <form onSubmit={handleSubmit(addPermission)} hidden={isSubmitting}>
          <FormControl isInvalid={errors.permission}>
            <FormLabel htmlFor="permission">
             Give admin permission or write permission - permissions are set recursivly for all posts 
            </FormLabel>
            <RadioGroup defaultValue="write">
              <Stack spacing={4} direction="row">
                <Radio
                  id="permission"
                  name="permission"
                  {...register("permission")}
                  value="admin"
                >
                  admin
                </Radio>
                <Radio
                  id="permission"
                  name="permission"
                  {...register("permission")}
                  value="write"
                >
                  write
                </Radio>
              </Stack>
            </RadioGroup>
            <FormErrorMessage>
              {errors.permission && errors.permission.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.identity}>
            <FormLabel htmlFor="name">
              Give permission to another Identity
            </FormLabel>
            <Input
              id="identity"
              placeholder="Identity"
              {...register("identity", {
                required: "This is required",
                minLength: {
                  value: 40,
                  message: "Minimum length should be 40",
                },
              })}
            />
            <FormErrorMessage>
              {errors.identity && errors.identity.message}
            </FormErrorMessage>
          </FormControl>

          <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">Add</Button>
          <p>&nbsp;</p>
            <b>Write Permission Id's:</b>
            <UnorderedList>{writeList}</UnorderedList>
            <b>Admin Permission Id's:</b>
            <UnorderedList>{adminList}</UnorderedList>
          
        </form>
      </div>
    )
}
export default observer(Capabilities)