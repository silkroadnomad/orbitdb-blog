/**
 * Bio component 
 *
 */

import * as React from "react"
import profilePic from '../images/profile-pic.png';

const Bio = () => {
  // const data = useStaticQuery(graphql`
  //   query BioQuery {
  //     site {
  //       siteMetadata {
  //         author {
  //           name
  //           summary
  //         }
  //         social {
  //           twitter
  //         }
  //       }
  //     }
  //   }
  // `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = {name:"Nico Krause", summary:"I am doing decentralized blogs"} //data.site.siteMetadata?.author
  const social = {twitter:"inspiraluna"}  //data.site.siteMetadata?.social

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
      {author?.name && (
        <p>
          Written by <strong>{author.name}</strong> {author?.summary || null}
          {` `}
          <a href={`https://twitter.com/${social?.twitter || ``}`}>
            You should follow them on Twitter
          </a>
        </p>
      )}
    </div>
  )
}

export default Bio
