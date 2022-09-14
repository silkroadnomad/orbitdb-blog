import React from 'react';
import { observer } from 'mobx-react'
import { values,get } from "mobx"

const Capabilities = (props) => {

    const capabilities = values(props.store?.capabilities)
    let adminList,writeList
    if(capabilities && capabilities[0])
        adminList = values(capabilities[0]).map((d) => <li key={d}>{d}</li>);//console.log("capabilities[0]", values(capabilities[0]))
    if(capabilities && capabilities[1])
        writeList = values(capabilities[1]).map((d) => <li key={d}>{d}</li>);//console.log("capabilities[0]", values(capabilities[0]))
    
    return (
      <div>
        <b>Admins Id's:</b>
        <ul>{adminList}</ul>
        <b>Write Permission Id's:</b>
        <ul>{writeList}</ul>
      </div>
    )
}
export default observer(Capabilities)