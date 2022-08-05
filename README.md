# orbit-db decentralized blog
## features
- create your own decentralized blog with your own identity key

## usage
- use node 18.x
- clone this repo 
- run ``npm i``
- run ``npm start``
- open browser on http://localhost:8080

## build 
- run ``npm run build``
- run ``ìpfs add dist`` update dns with new cid 

## todos
### orbit - todos
- pin project on ipfs
- when deleting a post - replication is informed but hard to identify the removed item

#### ui - todos
- test chakra-ui 
- add comments
- upload photos to post via ipfs
- when deleting a post ask user before action

## done
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