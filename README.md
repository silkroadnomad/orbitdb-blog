# orbit-db decentralized blog
## features
- create your own decentralized blog with your own identity key
- add other identities (metamask supported right now) in order to allow writing to the blog
- (planed) upload media post attachments to ipfs
- (planed) writing comments (everybody allowed) 
- (planed) writing comments only against btc deposit to prevent spam 
- (planed) create several react-ui components to display features posts and/or posts with a certain tag

## demo
- https://ipfs.le-space.de/ipns/decentrasol.network / https://decentrasol.network 
- https://ipfs.le-space.de/ipns/nicokrause.com  / https://nicokrause.com

## usage
- use node 18.x
- clone this repo 
- run ``yarn``
- run ``yarn start``
- open browser on http://localhost:8080
- make a copy of the current db: Go to console -> await 

## build 
- run ``yarn build``
- run ``ìpfs add dist`` update dns with new cid 

## todos
### orbit - todos
- ipfs pin uploaded media
- (auto) pin project on ipfs - orbit-pinning service
    - https://github.com/orbitdb/field-manual/issues/83
- Bug: if device is offline - ipfs cannot connect to webrtc star - must work without internet too
    - e.g. remove addresses from swarm programmatically 
    - other possibilities? e.g. tell ipfs to not connect to swarm if not available or work without swarm.
    - ipfs node connects to some strange nodes e.g. wss://node2.preload.ipfs.io/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS where is this coming from?
- show currently connected peers

#### ui - todos
- create component which lists posts of a certain tag
- add comments (make writeable to everybody)
- display author (identity) next to post (simply id)
- when deleting a post ask user before action
- change/edit post date
- responsive mobile navigation chakra-ui (e.g. about page displaying a certain post)
- store profile data in orbit-db (bio, seo, profile pic)
- store profile information under id

## nice to haves
- dns website - fallback html website hinterlegen als default und nur auf anforderung auf pure ipfs umschalten.

#### difficulties & discoveries
1. another user reported his Windows defender firewall was blocking the website.
2. some isp's seem to restrict p2p connections.
3. running vpn connections seem to disturb connecting via peer2peer

## Changes
- 2022-09-25
    - delete uploaded media from post
    - change permissions recursively also for all mediethreads of all posts
    - when creating new post inherit admin and write permissions from blog 
- 2022-09-21
    - upload photos via drag & drop to a post
    - display the photos below the post 
- 2022-09-21
    - added tag filter to url e.g. /#/tag/yoga 
    - fixed db address via url in the form /#/db/{dbAddress}
- 2022-09-21
    - hide add post box when no permission to append to log
    - add tags to blog post (parse #tags automatically from body)
- 2022-09-19
    - run cp in console to create a a new ipfs instance and a new feed with the data of current db but new permissions
- 2022-09-18
    - added button which opens drawer to display identity, permission and orbitdb related informations.
- 2022-09-18
    - create textbox + dropdown (admin/write) + button to add permission to current database 
- 2022-09-15
   - when deleting a post - replication is informed but hard to identify the removed item
- 2022-09-14
    - show capabilities (admin/write permissions) under settings
- 2022-09-13
    - new branch 'did' with an identity which can write from two different browsers
    - new branch 'eth-identity' with an identity which can write from two different browsers
        - use identity of metamask https://github.com/orbitdb/orbit-db-identity-provider#creating-an-identity-with-an-ethereum-wallet
        - make blog only writable by my (metamask) identity
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