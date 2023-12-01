# orbit-db decentralized blog
## features
- create your own decentralized blog with your own decentralized identity (right now metamask only) 
- add other identities in order to allow writing / admin permissions to the blog
- upload images to ipfs as attachments for the post
- images stored anywhere on ipfs can be embedded inside markdown using IPFS CID instead filename
- (roadmap) pin image cids and orbitdb cids on aleph-im / ar-weave
- (roadmap) uploaded images can be minted as nft and sold on the integrated marketplace
- (roadmap) running a puppeter-js headless browser inside mobile app / or the project inside react-native headless js
- (roadmap) writing comments (everybody allowed) 
- (roadmap) writing comments only against btc deposit to prevent spam 
- (roadmap) create several react-ui components to display features posts and/or posts with a certain tag

## demo
- https://ipfs.le-space.de/ipns/decentrasol.network / https://decentrasol.network 
- https://ipfs.le-space.de/ipns/nicokrause.com  / https://nicokrause.com

## usage
- use node 18.x
- clone this repo 
- run ``yarn``
- create .env file with the following contents to configure your orbitdb blog
```
TITLE=Welcome to MyBlog
AUTOR=SilkroadNomad
SUMMARY=A new travel blog about the silkroad
SOCIAL=https://twitter.com/SilkRoadNomadX
#DB_NAME=/orbitdb/zdpuAoRJtgSTi1SjHuzC9o5Nvg81eZxoDb2PoC82DXLHDt2EB/myblog01
DB_NAME=myblog01
```
- run ``yarn start``
- open browser on http://localhost:8080
- as soon as the blog is up - click on the upper right button and copy your dbAddress e.g. /orbitdb/zdpuAyxUrPnAgQfPy5fDGrsVukxQr5sHQ6DXVX5CHdqdV4o7W/myblog01
- replace in your .env ```DB_NAME=myblog01``` with your real blog address
- restart blog
- create your first post
- click on post / edit post and upload a photo into the drag & drop zone
- add some markdown 
- add any uploaded image can be added with the cid

## build 
- run ``yarn build``
- run ``ìpfs add dist`` update dns with new cid 

## todos
### orbit - todos
- check webtransport to connect to go-ipfs
    - https://github.com/libp2p/js-libp2p-webtransport.git
    - try out https://github.com/libp2p/js-libp2p-webtransport/blob/main/test/browser.ts#L17
    - https://www.youtube.com/watch?v=bmWLvS54-Zs
    - https://www.youtube.com/watch?v=Dt42Ss6X_Vk
- ipfs auto-pin uploaded media to own pinning service
- (auto) pin project on ipfs - orbit-pinning service
    - https://github.com/orbitdb/field-manual/issues/83
- show currently connected peers

#### ui - todos
- Improvide Settings-Drawer UI
- Index-Page modifications
    - alternative blog index view with cards + headline e.g. like https://bobbyhadz.com/
    - display author (identity) next to post (simply id)
    - responsive mobile navigation chakra-ui (e.g. about page displaying a certain post)
- View Edit/Create Post page
    - bug: when deleting media from post its deleting a wrong media from orbit (last first - wrong index)
    - display author (identity) next to post (simply id)
    - when deleting a post ask user before action
    - bug: when using navigation - its not possible to add new media - identity seems not correct 
    - add comments (make writeable to everybody)
    - add markdown editor to EditPost https://morioh.com/p/46067e5674d2

- create component which lists posts of a certain tag
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