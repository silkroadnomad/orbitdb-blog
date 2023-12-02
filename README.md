# Orbit-DB Decentralized Blog
## Features
- Create your own decentralized blog with your own decentralized identity (currently only Metamask is supported).
- Add other identities to allow writing/admin permissions to the blog.
- Upload images to IPFS as attachments for the post.
- Images stored anywhere on IPFS can be embedded inside markdown using IPFS CID instead of filename.
- (Roadmap) Pin image CIDs and OrbitDB CIDs on Aleph-IM / Ar-Weave.
- (Roadmap) Uploaded images can be minted as NFT and sold on the integrated marketplace.
- (Roadmap) Running a Puppeteer-JS headless browser inside mobile app / or the project inside React-Native headless JS.
- (Roadmap) Writing comments (everybody allowed).
- (Roadmap) Writing comments only against BTC deposit to prevent spam.
- (Roadmap) Create several React-UI components to display featured posts and/or posts with a certain tag.

## Demo
- https://ipfs.le-space.de/ipns/decentrasol.network / https://decentrasol.network 
- https://ipfs.le-space.de/ipns/nicokrause.com  / https://nicokrause.com

## Usage
- Use Node 18.x.
- Clone this repository.
- Run ``yarn``.
- Create .env file with the following contents to configure your OrbitDB blog:
```
TITLE=Welcome to MyBlog
AUTHOR=SilkroadNomad
SUMMARY=A new travel blog about the silkroad
SOCIAL=https://twitter.com/SilkRoadNomadX
#DB_NAME=/orbitdb/zdpuAoRJtgSTi1SjHuzC9o5Nvg81eZxoDb2PoC82DXLHDt2EB/myblog01
DB_NAME=myblog01
```
- Run ``yarn start``.
- Open browser on http://localhost:8080.
- As soon as the blog is up - click on the upper right button and copy your dbAddress e.g. /orbitdb/zdpuAyxUrPnAgQfPy5fDGrsVukxQr5sHQ6DXVX5CHdqdV4o7W/myblog01.
- Replace in your .env ```DB_NAME=myblog01``` with your real blog address.
- Restart blog.
- Create your first post.
- Click on post / edit post and upload a photo into the drag & drop zone.
- Add some markdown.
- Any uploaded image can be added with the CID.
- Open a second browser with the same URL to see if both browsers replicate (new browser should receive all posts from first browser).
- Connect with Metamask and add Metamask address (ETH address to write permissions) possible only from first browser!
- Check out permissions handling.
- Please send me feedback @silkroadnomadx.

# Remarks:
1. You need to leave your blogs browser tab open of one device if you want to run this blog in production deployment (I did for some time ;)
2. Pinning this OrbitDb with a PinningService which is automatically replicating the OrbitDB was not yet fully successful

## Build 
- Run ``yarn build``.
- Run ``ipfs add dist`` update DNS with new CID.

## Todos
### Orbit - Todos
- Check WebTransport to connect to Go-IPFS.
    - https://github.com/libp2p/js-libp2p-webtransport.git
    - Try out https://github.com/libp2p/js-libp2p-webtransport/blob/main/test/browser.ts#L17.
    - https://www.youtube.com/watch?v=bmWLvS54-Zs
    - https://www.youtube.com/watch?v=Dt42Ss6X_Vk
- IPFS auto-pin uploaded media to own pinning service.
- (Auto) Pin project on IPFS - Orbit-pinning service.
    - https://github.com/orbitdb/field-manual/issues/83
- Show currently connected peers.

#### UI - Todos
- Improve Settings-Drawer UI.
- Index-Page modifications.
    - Alternative blog index view with cards + headline e.g. like https://bobbyhadz.com/.
    - Display author (identity) next to post (simply ID).
    - Responsive mobile navigation Chakra-UI (e.g. about page displaying a certain post).
- View Edit/Create Post page.
    - Bug: When deleting media from post it's deleting a wrong media from Orbit (last first - wrong index).
    - Display author (identity) next to post (simply ID).
    - When deleting a post, ask user before action.
    - Bug: When using navigation, it's not possible to add new media - identity seems not correct.
    - Add comments (make writable to everybody).
    - Add markdown editor to EditPost https://morioh.com/p/46067e5674d2.

- Create component which lists posts of a certain tag.
- Store profile data in Orbit-DB (bio, SEO, profile pic).
- Store profile information under ID.

## Nice to Haves
- DNS website - fallback HTML website in case my browser isn't online.

#### Difficulties & Discoveries
1. Another user reported his Windows Defender Firewall was blocking the website.
2. Some ISPs seem to restrict P2P connections.
3. Running VPN connections seem to disturb connecting via Peer2Peer.

## Changes
- 2022-09-25
    - Delete uploaded media from post.
    - Change permissions recursively also for all media threads of all posts.
    - When creating new post, inherit admin and write permissions from blog.
- 2022-09-21
    - Upload photos via drag & drop to a post.
    - Display the photos below the post.
- 2022-09-21
    - Added tag filter to URL e.g. /#/tag/yoga.
    - Fixed DB address via URL in the form /#/db/{dbAddress}.
- 2022-09-21
    - Hide add post box when no permission to append to log.
    - Add tags to blog post (parse #tags automatically from body).
- 2022-09-19
    - Run cp in console to create a new IPFS instance and a new feed with the data of current DB but new permissions.
- 2022-09-18
    - Added button which opens drawer to display identity, permission and OrbitDB related information.
- 2022-09-18
    - Create textbox + dropdown (admin/write) + button to add permission to current database.
- 2022-09-15
   - When deleting a post - replication is informed but hard to identify the removed item.
- 2022-09-14
    - Show capabilities (admin/write permissions) under settings.
- 2022-09-13
    - New branch 'did' with an identity which can write from two different browsers.
    - New branch 'eth-identity' with an identity which can write from two different browsers.
        - Use identity of Metamask https://github.com/orbitdb/orbit-db-identity-provider#creating-an-identity-with-an-ethereum-wallet.
        - Make blog only writable by my (Metamask) identity.
- 2022-08-27
    - Sort posts by date (latest on top).
    - Fixed title of main page via Helmet / SEO component (bio.js).
- 2022-08-26
    - Bug: Cannot delete nor edit first post.
- 2022-08-25 
    - Set database name in env.
- 2022-08-08
- Add Moment.js.
    - https://www.npmjs.com/package/react-moment#parsing-dates
- Added Chakra V1.
    - React examples https://codesandbox.io/examples/package/@chakra-ui/react.
    - Chakra show case https://chakra-ui.com/community/showcase.
    - Migration of Chakra libs https://v1.chakra-ui.com/guides/migration.
- 2022-08-06
    - Upgrade to React@18.
- 2022-08-05
    - Link IPFS hash with DNS name.
    - Store blog on IPFS.
- 2022-08-04
    - Previous post / next post.
- 2022-08-03
    - Save post / edit post.
    - Delete post.
    - Use markdown for rendering body https://www.npmjs.com/package/react-markdown#install.
- 2022-08-02 
    - Rerender post subject and body while typing.
- 2022-07-30 - Add post.
- 2022-07-29 - Show post.
