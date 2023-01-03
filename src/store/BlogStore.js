import { observable,makeAutoObservable } from 'mobx'
import Identities from 'orbit-db-identity-provider'
import OrbitDB from 'orbit-db'
import moment from 'moment'
import {log} from '../utils/loaderPrettyLog.js'

class BlogStore {

  @observable feed = null;
  @observable dbName = process.env.DB_NAME
  @observable posts = [];
  @observable data = {
    title: "Welcome to Nico-Krause.com!"
  };
  @observable isOnline = false;
  @observable identity = {};
  @observable currentMediaFeed = {}; //feed holding the current feed (each post has a mediafeed)
  @observable currentPost = {}; //simple object holding the post
  @observable capabilities = []

  constructor() {
    makeAutoObservable(this)
    this.ipfs = null;
    this.odb = null;
  }

  async connect(ipfs, options = {}) {

    //set up orbitdb
    if(ipfs) this.ipfs = ipfs;
    log.msg("options creating ",options.id?options:'undefined')
    log.msg("current identity is",this.identity._id?this.identity._id:'undefined')
    if(this.identity.id===undefined){
      this.identity = await Identities.createIdentity({ id: "user" })
      log.success("Identity created",this.identity)
    } 

    options.identity = this.identity
   
    this.odb = await OrbitDB.createInstance(this.ipfs, {
      identity: options.identity,
      directory: "./odb",
    });

    this.feed = await this.odb.feed(options.dbName?options.dbName:this.dbName, {
      identity: this.identity, 
      accessController: {
        type: 'orbitdb'
      }
    })
    this.capabilities = this.feed.access.capabilities

    await this.loadPosts();
    this.isOnline = true;
  }

  setCurrentPost = _currentPost => this.currentPost = _currentPost
  setDbAddress = dbAddress => this.dbName = dbAddress

  canWrite = (identity) => {
    const _canAdmin = this.feed?.access?.capabilities?.admin!==undefined?Array.from(
      this.feed?.access?.capabilities?.admin?.keys()).indexOf(identity)!==-1:""
    const _canWrite = this.feed?.access?.capabilities?.write!==undefined?Array.from(
      this.feed?.access?.capabilities?.write?.keys()).indexOf(identity)!==-1:""
    return _canWrite || _canAdmin
  }
  
  setTagsOfCurrentPost = (tags) => {
    this.currentPost.tags = tags
  }

  addPostToStore = (entry) => {

    if (this.posts.filter((e) => {return e.hash === entry.hash;}).length === 0) {
      const newPostObj = {
        hash: entry.hash,
        subject: entry.payload.value.subject || entry.payload.value.name,
        body: entry.payload.value.body,
        photoCID: entry.payload.value.photoCID || "QmdhR6iJYDGVhBw5PQssgtLUC6aqJ6CzfwbiUYPXrDpSoi",
        tags: entry.payload.value.tags,
        postDate: entry.payload.value.postDate,
        createdAt: entry.payload.value.createdAt,
        address: entry.payload.value.address,
      }
      log.action("adding newPostObj to posts store", newPostObj);
      this.posts.push(newPostObj);
    }
  }

  async loadPosts() {

    this.feed.events.on("replicated", async (dbAddress, count, newFeed, d) => {
      log.success("replicated - loading posts from db");
      log.msg("dbAddress", dbAddress);
      log.msg("count", count);
      log.msg("feed", newFeed);
      newFeed.all.map(this.addPostToStore);
    });

    this.feed.events.on("write", async (hash, entry, heads) => {
      log.success("orbit db wrote to ipfs" + hash, entry);
      this.addPostToStore(entry);
    });

    // When the database is ready (ie. loaded), display results
    this.feed.events.on("ready", (dbAddress, feedReady) => {
      log.success("database ready " + dbAddress, feedReady);
      if(this.feed !== undefined) this.feed.all.map(this.addPostToStore);
      else log.danger('feed is still undefined although ready')
    });

    this.feed.events.on("replicate.progress", async (dbAddress, hash, obj) => {
      log.success("replicate.progress", dbAddress, hash);
      log.msg('post subject',obj.payload.value.subject)
      log.msg('post body',obj.payload.value.body)
      if(obj.payload.op==="DEL"){
        const entryHash = obj.payload.value
        for (let i = 0; i < this.posts.length; i++) {
          log.msg("iterating through posts>", this.posts[i].hash, this.posts[i].address);
          if (this.posts[i].hash === entryHash) {
            log.success("removed post from store because it was deleted on another node",entryHash);
            this.posts = [] //empty store because it gets reloaded anyways
          }
        } 
      } 
    });
    await this.feed.load();
  }

  /**
   * Create a new comment feed for every post
   */
  async createNewPost(update) {

    let newMediaFeed = this.currentMediaFeed
    
    if(update===undefined){ //only create new feed if we create it first time (in case of update no need to do that)
      log.action(`creating new postFeed update:${(update===true)}`, this.currentPost.subject)
      newMediaFeed = await this.odb.feed(this.currentPost.subject, {
        identity: this.identity, 
        accessController: {
          type: 'orbitdb'
        }
      })
    }

    this.feed?.access?.capabilities?.admin?.forEach((identity) => {
      //only add if not there yet
      if(Array.from(newMediaFeed?.access?.capabilities?.admin?.keys()  || []).indexOf(identity)===-1){  
        newMediaFeed.access.grant("admin",identity)
        log.msg('newMediaFeed.capabilities',newMediaFeed?.access?.capabilities) 
      }
    })

    this.feed?.access?.capabilities?.write?.forEach((identity) => {
      log.action(`granting admin identity to ${identity} for new feed`,newMediaFeed)
      //only add if not there yet
      if(Array.from(newMediaFeed?.access?.capabilities?.write?.keys()  || []).indexOf(identity)===-1)  
        newMediaFeed.access.grant("write",identity)
        log.msg('newMediaFeed.capabilities',newMediaFeed?.access?.capabilities) 
    })

    const p = {
      subject: this.currentPost.subject,
      body: this.currentPost.body,
      photoCID: this.currentPost.photoCID,
      tags: this.currentPost.tags?this.currentPost.tags:[],
      postDate:  this.currentPost.postDate?this.currentPost.postDate:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      createdAt: this.currentPost.createdAt?this.currentPost.createdAt:new Date().getTime(),
      address: newMediaFeed!==undefined?newMediaFeed.address.toString():this.currentMediaFeed.address.toString(),
    }

    log.action("storing new post ... ",p)
    const hash = await this.feed.add(p);
    return hash;
  }

  async removePost(absolute) {
    const filteredData = this.posts.filter((item) => {
      return item.hash !== this.currentPost.hash
    });

    this.posts.replace(filteredData);
    if(absolute) this.currentMediaFeed.drop()
    const hash = await this.feed.remove(this.currentPost.hash);
    return hash;
  }

  previousPost(address) {
    if(!address) return "please provide address of current post"
    log.action(`loading previous post of address ${address}`);
    for (var i = 0;i < this.posts.length;i++){
      if(this.posts[i].address===address){
        const previousPost =  {address:this.posts[i-1]?.address,subject:this.posts[i-1]?.subject}
        return previousPost
      }
    }
    return "#"
  }

  nextPost(address) {
    if(!address) return "please provide address of current post"
    log.action(`loading next post of address ${address}`);
    for (var i = 0;i < this.posts.length;i++){
      if(this.posts[i].address===address){
        const nextPost =  {address:this.posts[i+1]?.address,subject:this.posts[i+1]?.subject}
        return nextPost
      }
    }
    return "#"
  }

  async joinBlogPost(address,getMedia,setMediaFunc) {
    log.action("joinBlogPost - loading address", address);
    if (this.odb) {
      const ourPost = this.posts.filter((item)=>{return item.address === address})
      
      // this.posts.forEach((item)=>log.msg("item.subject))
      this.currentPost = ourPost.length>0?ourPost[0]:this.posts[0]

      try {
        const mediaFeedOfPost =  await this.odb.open(address,{identity:this.identity})
        log.success("opened mediaFeedOfPost",mediaFeedOfPost)
        // const mediaFeedOfPost = this.odb.stores[address] || (await this.odb.open(address))
        log.msg('mediaFeedOfPost permissions',mediaFeedOfPost.access.capabilities)

        mediaFeedOfPost.events.on("replicated", async (dbAddress, count, newFeed, d) => {
          log.success("replicated - loading posts from db");
          log.msg("dbAddress", dbAddress);
          log.msg("count", count);
          const mediaElements = []
          
          //this seems necessary because all feeds of the current odb are replicating even if its not the current feed
          //otherwise a replication of another feed is updating the media in the current media feed.
          if(dbAddress===this.currentMediaFeed.id){ 
            mediaFeedOfPost.all.map( m => mediaElements.push(m));
            log.msg('mediaFeedOfPost length',mediaFeedOfPost.all.length)
            setMediaFunc(mediaElements)
          }
        });
    
        mediaFeedOfPost.events.on("write", async (hash, entry, heads) => {
          log.success("new feed entrry was written as " + hash, entry);
          const mediaElements = []
          mediaFeedOfPost.all.map( m => mediaElements.push(m));
          log.msg('mediaFeedOfPost length',mediaFeedOfPost.all.length)
          setMediaFunc(mediaElements)
        });
    
        // When the database is ready (ie. loaded), display results
        mediaFeedOfPost.events.on("ready", (dbAddress, feedReady) => {
          log.success("database ready " + dbAddress, feedReady);
          const mediaElements = []
          if(dbAddress===mediaFeedOfPost.id){
            mediaFeedOfPost.all.map( m => mediaElements.push(m));
            log.msg('mediaFeedOfPost length',mediaFeedOfPost.all.length)
            setMediaFunc(mediaElements)
          }
        });
    
        mediaFeedOfPost.events.on("replicate.progress", async (dbAddress, hash, obj) => {
          log.success("replicate.progress", dbAddress, hash);
          if(obj.payload.op==="DEL"){ 
            const entryHash = obj.payload.value
          }
        });
        
        await mediaFeedOfPost.load()
        this.currentMediaFeed = mediaFeedOfPost
      } catch (ex) {
        log.danger(ex, "comments feed could not loaded",this.currentMediaFeed )
      } 
    } else log.danger('odb not loaded')
  }

  sendFiles(files, address) {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(this._sendFile(files[i], address));
    }
    return Promise.all(promises);
  }

  async _sendFile(file, address) {
    log.action("sending file", file);
    log.msg("with address", address);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const f = await this.addFile(address, {
          filename: file.name,
          buffer: event.target.result,
          meta: { mimeType: file.type, size: file.size },
        });
        resolve(f);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async addFile(address, source) {

    if (!source || !source.filename) {
      throw new Error("Filename not specified");
    }
    const isBuffer = source.buffer && source.filename;
    const name = source.filename.split("/").pop();
    log.msg("filename", name);
    const size = source.meta && source.meta.size ? source.meta.size : 0;

    const result = await this.ipfs.add(Buffer.from(source.buffer));
    log.success("ipfs add executed with result", result);
    const hash = result.path;

    log.action("upload hash (cid)", hash);

    // Create a post
    const data = {
      content: hash,
      meta: Object.assign(
        {
          from: this.odb.identity.id,
          type: "file",
          ts: new Date().getTime(),
        },
        { size, name },
        source.meta || {}
      ),
    };

    return await this.addPost(address, data);
  }

  async addPost(address, data) {
    log.action("adding data to db on address", this.currentMediaFeed);
    if (this.currentMediaFeed) {
      log.msg("mediaFeed permissions",this.currentMediaFeed?.access?.capabilities)
      const hash = await this.currentMediaFeed.add(data);
      log.succes("added media to mediafeed and got hash", hash);
      await this.currentMediaFeed.load();
      return this.currentMediaFeed.get(hash);
    }
    return;
  }
}

const store = window.store = new BlogStore()
export default store
