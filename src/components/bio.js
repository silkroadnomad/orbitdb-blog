/**
 * Bio component 
 */

import * as React from "react"
import profilePic from '../images/profile-pic.png';

const Bio = () => {

  const authorName = process.env.AUTOR
  const authorSummary = process.env.SUMMARY
  const social = process.env.SOCIAL 

  return (
    <div className="bio">
    <img  
      src={profilePic}
      className="bio-avatar"
      layout="fixed"
      formats={["auto", "webp", "avif"]}
      width={50}
      height={50}
      quality={95}
      alt="Profile picture"
      />
      {authorName && (
        <p>
          Written by <strong>{authorName}</strong> &nbsp;
          {authorSummary || null}
          {` `}
          <a href={`${social}`}>You should also follow via twitter</a>
        </p>
      )}
    </div>
  )
}

export default Bio
