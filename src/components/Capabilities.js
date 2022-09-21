import React from 'react';
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
  Stack
} from "@chakra-ui/react";

const Capabilities = (props) => {

    const removePermission = (e,a) => {
      const permission = e.target.name
      const identity = e.target.value
      event.preventDefault();
      console.log('remove '+permission+" permission from ",identity)
      props.store.feed.access.revoke(permission,identity);
    }

    function addPermission(values) {
      console.log('adding '+values.permission+" permission to ",values.identity)
      props.store.feed.access.grant(values.permission,values.identity);
    } 

    let capabilities 
    if(props.store?.capabilities!==undefined) capabilities = values( props.store?.capabilities)
    console.log('capabilities',capabilities)
    let adminList,writeList = []
    if(capabilities !==undefined && capabilities.length>0 && capabilities[0]){
      writeList = values(capabilities[0]).map((d,i) => <ListItem key={d+i}>{d} <Button key={"button"+d+i} name={"write"} value={d} onClick={ (e) => removePermission(e) }>Remove write permission</Button></ListItem>);//console.log("capabilities[0]", values(capabilities[0]))
    }

    if(capabilities !==undefined && capabilities.length>0 && capabilities[1]){
      adminList = values(capabilities[1]).map((d,i) => <ListItem key={d+i}>{d} <Button key={"button"+d+i} name={"admin"} value={d} onClick={ (e) => removePermission(e) }>Remove  admin permission</Button></ListItem>);//console.log("capabilities[0]", values(capabilities[0]))      
    }

    const { handleSubmit,register, formState: { errors, isSubmitting }} = useForm();

    return (
      <div>
        <h1>Capabilities</h1>
        <form onSubmit={handleSubmit(addPermission)}>

        <b>Write Permission Id's:</b>
        <UnorderedList>{writeList}</UnorderedList>
        <b>Admins Id's:</b>
        <UnorderedList>{adminList}</UnorderedList>


          <FormControl isInvalid={errors.permission}>

            <FormLabel htmlFor="permission">
              Choose if permssion should be as admin or just a general write permission
            </FormLabel>
          
            <RadioGroup defaultValue="write">
              <Stack spacing={4} direction="row">
                <Radio id="permission" name="permission" {...register("permission")} value="admin">admin</Radio>
                <Radio id="permission" name="permission" {...register("permission")} value="write">write</Radio>
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
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    )
}
export default observer(Capabilities)