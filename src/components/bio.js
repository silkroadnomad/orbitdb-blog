/**
 * Bio component 
 */

import * as React from "react"
import { Image } from '@chakra-ui/react'
import profilePic from '../images/nico-profile-pic.png';

const Bio = () => {

  const authorName = process.env.AUTOR
  const authorSummary = process.env.SUMMARY
  const social = process.env.SOCIAL 

  return (
    <div className="bio">
    <Image
      m={[2, 3]}
      boxSize='100px'
      objectFit='cover'
      src={profilePic}
      alt='Nico Krause'
    />
      {authorName && (
        <p>
          <strong>{authorName}</strong> &nbsp;<br/>
          {authorSummary || null}
          {` `} <br/>
          <a href={`https://twitter.com/${social}`}>Twitter: @{social}</a>
        </p>
      )}
    </div>
  )
}

export default Bio
