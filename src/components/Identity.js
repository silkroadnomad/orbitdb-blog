import React from 'react';
import { observer } from 'mobx-react'

const Identity = (props) => {
    return (<div> Identity: {props.store?.identity?.id} </div>)
}
export default observer(Identity)