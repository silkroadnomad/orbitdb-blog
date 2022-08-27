# orbit-db decentralized blog
## features
- create your own decentralized blog with your own identity key

## usage
- use node 18.x
- clone this repo 
- run ``yarn``
- run ``yarn start``
- open browser on http://localhost:8080

## build 
- run ``yarn build``
- run ``ìpfs add dist`` update dns with new cid 

## todos
### orbit - todos 
- use identity of metamask https://github.com/orbitdb/orbit-db-identity-provider#creating-an-identity-with-an-ethereum-wallet
- make blog only writable by my (metamask) identity
- when deleting a post - replication is informed but hard to identify the removed item
- (auto) pin project on ipfs
- add identities to allowed blog posters
- show currently connected peers
- dns website - fallback html website hinterlegen als default und nur auf anforderung auf pure ipfs umschalten.

#### ui - todos
- change/edit post date 
- responsive mobile navigation chakra-ui (e.g. about page displaying a certain post)
- store profile data in orbit-db (bio, seo, profile pic)
- add comments (make writeable to everybody)
- upload photos to post via ipfs
- when deleting a post ask user before action

#### difficulties
1. another user reported his Windows defender firewall was blocking the website.
2. some isps seem to restrict p2p connections.

## Changes
- 2022-08-27
    - sort posts by date (latest on top)
    - fixed title of main page via helmet / seo component (bio.js)
- 2022-08-26
    - bug cannot delete nor edit first post
- 2022-08-25 
    - set database name in env
- 2022-08-08
- add moment.js 
    - https://www.npmjs.com/package/react-moment#parsing-dates
- added Chakra V1 
    - react examples https://codesandbox.io/examples/package/@chakra-ui/react
    - chakra show case https://chakra-ui.com/community/showcase
    - migration of chakra libs https://v1.chakra-ui.com/guides/migration
- 2022-08-06
    - upgrade to react@18 
- 2022-08-05
    - link ipfs hash with dns name
    - store blog on ipfs 
- 2022-08-04
    - previous post / next post 
- 2022-08-03
    - save post / edit post
    - delete post
    - use markdown for rendering body https://www.npmjs.com/package/react-markdown#install
- 2022-08-02 
    - rerender post subject and body while typing 
- 2022-07-30 - add post
- 2022-07-29 - show post