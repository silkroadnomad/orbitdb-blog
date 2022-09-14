import React, { useEffect } from "react"
import Identity from "./Identity"
import Capabilities from "./Capabilities"
import { observer } from 'mobx-react'

const Settings = (props)  => {
  return (
    <div>
        Settings:
        <Identity {...props} />
       <Capabilities  {...props} />
    </div>
  )
}
export default  observer(Settings)
