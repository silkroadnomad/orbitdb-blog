import { observable,makeAutoObservable } from 'mobx'
import Identities from 'orbit-db-identity-provider'
import OrbitDB from 'orbit-db'

class BlogStore {

  @observable feed = null;
  @observable dbName = process.env.DB_NAME
  @observable posts = [];
  @observable data = {
    title: "Welcome to Nico-Krause.com!"
  };
  @observable isOnline = false;
  @observable identity = {};
  @observable currentMediaFeed = {}; //feed holding the current feed
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
    console.log("options",options)
    if(this.identity===undefined) this.identity = (await Identities.createIdentity({ id: "user" }))
    // const ourIdentity = options.identity || (await Identities.createIdentity({ id: "user" }))
    options.identity = this.identity
    console.log("this.identity",this.identity)
    this.odb = await OrbitDB.createInstance(ipfs, {
      identity: options.identity,
      directory: "./odb",
    });

    this.feed = await this.odb.feed(options.dbName, {
      identity: this.identity, 
      accessController: {
        type: 'orbitdb'
      }
    })
    this.capabilities = this.feed.access.capabilities

    await this.loadPosts();
    this.isOnline = true;
  }

  setCurrentPost = currentPost => this.currentPost = currentPost
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
        tags: entry.payload.value.tags,
        postDate: entry.payload.value.postDate,
        createdAt: entry.payload.value.createdAt,
        address: entry.payload.value.address,
      }
      console.log("adding newPostObj to posts store", newPostObj);
      this.posts.push(newPostObj);
    }
  }

  async loadPosts() {

    this.feed.events.on("replicated", async (dbAddress, count, newFeed, d) => {
      console.log("replicated - loading posts from db");
      console.log("dbAddress", dbAddress);
      console.log("count", count);
      console.log("feed", newFeed);
      newFeed.all.map(this.addPostToStore);
    });

    this.feed.events.on("write", async (hash, entry, heads) => {
      console.log("wrote something adding to Posts" + hash, entry);
      this.addPostToStore(entry);
    });

    // When the database is ready (ie. loaded), display results
    this.feed.events.on("ready", (dbAddress, feedReady) => {
      console.log("database ready " + dbAddress, feedReady);
      if(this.feed !== undefined) this.feed.all.map(this.addPostToStore);
      else console.log('feed is still undefined although ready')
    });

    this.feed.events.on("replicate.progress", async (dbAddress, hash, obj) => {
      console.log("replicate.progress", dbAddress, hash);
      console.log('obj.payload',obj.payload)
      if(obj.payload.op==="DEL"){
        const entryHash = obj.payload.value
        for (let i = 0; i < this.posts.length; i++) {
          console.log(">", this.posts[i].hash, this.posts[i].address);
          if (this.posts[i].hash === entryHash) {
            console.log("removed post from store because it was deleted on another node",entryHash);
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
      console.log(`creating new postFeed update:${(update===true)}`, this.currentPost.subject)
      newMediaFeed = await this.odb.feed(this.currentPost.subject, {
        identity: this.identity, 
        accessController: {
          type: 'orbitdb'
        }
      })
    }

    this.feed.access.capabilities.admin.forEach((identity) => {
      //only add if not there yet
      if(Array.from(newMediaFeed?.access?.capabilities?.admin?.keys()  || []).indexOf(identity)===-1){  
        newMediaFeed.access.grant("admin",identity)
        console.log('newMediaFeed.capabilities',newMediaFeed?.access?.capabilities) 
      }
    })

    this.feed.access.capabilities.write.forEach((identity) => {
      console.log(`granting admin identity to ${identity} for new feed`,newMediaFeed)
      //only add if not there yet
      if(Array.from(newMediaFeed?.access?.capabilities?.write?.keys()  || []).indexOf(identity)===-1)  
        newMediaFeed.access.grant("write",identity)
      console.log('newMediaFeed.capabilities',newMediaFeed?.access?.capabilities) 
    })

    const p = {
      subject: this.currentPost.subject,
      body: this.currentPost.body,
      tags: this.currentPost.tags?this.currentPost.tags:[],
      postDate: this.currentPost.postDate,
      createdAt: this.currentPost.createdAt?this.currentPost.createdAt:new Date().getTime(),
      address: newMediaFeed!==undefined?newMediaFeed.address.toString():this.currentMediaFeed.address.toString(),
    }
    
    console.log("storing new post... ",p)
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
    console.log(`loading previous post of address ${address}`);
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
    console.log(`loading next post of address ${address}`);
    for (var i = 0;i < this.posts.length;i++){
      if(this.posts[i].address===address){
        const nextPost =  {address:this.posts[i+1]?.address,subject:this.posts[i+1]?.subject}
        return nextPost
      }
    }
    return "#"
  }

  async joinBlogPost(address,getMedia,setMediaFunc) {
    console.log("joinBlogPost - loading address", address);
    if (this.odb) {
      const ourPost = this.posts.filter((item)=>{return item.address === address})
      
      this.posts.forEach((item)=>console.log(item.subject))
      this.currentPost = ourPost.length>0?ourPost[0]:this.posts[0]

      try {
        const mediaFeedOfPost =  await this.odb.open(address,{identity:this.identity})
        console.log("opened mediaFeedOfPost",mediaFeedOfPost)
        // const mediaFeedOfPost = this.odb.stores[address] || (await this.odb.open(address))
        console.log('mediaFeedOfPost permissions',mediaFeedOfPost.access.capabilities)

        mediaFeedOfPost.events.on("replicated", async (dbAddress, count, newFeed, d) => {
          console.log("replicated - loading posts from db");
          console.log("dbAddress", dbAddress);
          console.log("count", count);
          const mediaElements = []
          
          //this seems necessary because allmfeeds of the current odb are replicating even if its not the current feed
          //otherwise a replication of another feed is updating the media in the current media feed.
          if(dbAddress===this.currentMediaFeed.id){ 
            mediaFeedOfPost.all.map( m => mediaElements.push(m));
            console.log('mediaFeedOfPost.all.length',mediaFeedOfPost.all.length)
            setMediaFunc(mediaElements)
          }
        });
    
        mediaFeedOfPost.events.on("write", async (hash, entry, heads) => {
          console.log("wrote something adding to Posts" + hash, entry);
          const mediaElements = []
          mediaFeedOfPost.all.map( m => mediaElements.push(m));
          console.log('mediaFeedOfPost.all.length',mediaFeedOfPost.all.length)
          setMediaFunc(mediaElements)
        });
    
        // When the database is ready (ie. loaded), display results
        mediaFeedOfPost.events.on("ready", (dbAddress, feedReady) => {
          console.log("database ready " + dbAddress, feedReady);
          const mediaElements = []
          if(dbAddress===mediaFeedOfPost.id){
            mediaFeedOfPost.all.map( m => mediaElements.push(m));
            console.log('ready - mediaFeedOfPost.all.length',mediaFeedOfPost.all.length)
            setMediaFunc(mediaElements)
          }
        });
    
        mediaFeedOfPost.events.on("replicate.progress", async (dbAddress, hash, obj) => {
          console.log("replicate.progress", dbAddress, hash);
          if(obj.payload.op==="DEL"){ //TODO fix deleting media by replication
            const entryHash = obj.payload.value
          }
        });
        
        await mediaFeedOfPost.load()
        this.currentMediaFeed = mediaFeedOfPost
      } catch (ex) {
        console.log(ex, "comments feed could not loaded",this.currentMediaFeed )
      } 
    } else console.log('odb not loaded')
  }

  sendFiles(files, address) {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(this._sendFile(files[i], address));
    }
    return Promise.all(promises);
  }

  async _sendFile(file, address) {
    console.log("file", file);
    console.log("address", address);
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
    console.log("filename", name);
    const size = source.meta && source.meta.size ? source.meta.size : 0;

    const result = await this.ipfs.add(Buffer.from(source.buffer));
    console.log("result of ipfs.add", result);
    const hash = result.path;

    console.log("upload hash (cid)", hash);

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
    console.log("adding data to db on address", this.currentMediaFeed);
    if (this.currentMediaFeed) {
      console.log("mediaFeed permissions",this.currentMediaFeed?.access?.capabilities)
      const hash = await this.currentMediaFeed.add(data);
      console.log("got hash", hash);
      await this.currentMediaFeed.load();
      return this.currentMediaFeed.get(hash);
    }
    return;
  }
}

const store = window.store = new BlogStore()
export default store
