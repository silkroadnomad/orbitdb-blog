import { observable,makeAutoObservable } from 'mobx'
import Identities from 'orbit-db-identity-provider'
import OrbitDB from 'orbit-db'

class BlogStore {
  @observable posts = [];
  @observable data = {
    title: "Welcome to Nico-Krause.com!"
  };
  @observable isOnline = false;
  @observable identity = {};
  @observable currentFeed = {};
  @observable currentPost = {};
  @observable capabilities = []

  constructor() {
    makeAutoObservable(this)
    this.ipfs = null;
    this.odb = null;
    this.feed = null;
  }

  getFeed() {
    return this.feed
  }

  async connect(ipfs, options = {}) {
    //set up orbitdb
    this.ipfs = ipfs;
    console.log("options.identity",options.identity)
    const ourIdentity =
      options.identity || (await Identities.createIdentity({ id: "user" }));

    console.log("ourIdentity",ourIdentity)
    this.odb = await OrbitDB.createInstance(ipfs, {
      ourIdentity,
      directory: "./odb",
    });
    this.identity = ourIdentity
    const  dbAddress = "/orbitdb/zdpuArefdqxWRmCe18Gj56uyn1cWFF7TEdNubF8ecYAdfLsLx/decentrasol-dev07"
    this.feed = await this.odb.feed(dbAddress, {
      // this.feed = await this.odb.feed(options.dbName, {
        identity: ourIdentity, 
        accessController: {
        //  type: 'orbitdb', //OrbitDBAccessController
          type: 'orbitdb',
            accessController: {
              type: 'orbitdb',
             // write: [options.identity.id]
              //     write: publicAccess ? ["*"] : [this.odb.identity.id],
            }
        }
      })
      this.feed.access.grant("admin","0xC36053102a04E365867dB9554E83d60d6E305231");
      console.log('capabilities',this.feed.access.capabilities)
      this.capabilities = this.feed.access.capabilities
      // this.write = this.feed.access.capabilities.write
    // const publicAccess = true;
    // this.feed = await this.odb.open(options.dbName, {
    //   create: true, // If database doesn't exist, create it
    //   overwrite: true, // Load only the local version of the database, don't load the latest from the network yet
    //   localOnly: false,
    //   type: "feed", //eventlog,feed,keyvalue,docstore,counter
    //   // If "Public" flag is set, allow anyone to write to the database,
    //   // otherwise only the creator of the database can write
    //   accessController: {
    //     write: publicAccess ? ["*"] : [this.odb.identity.id],
    //   },
    // });
    await this.loadPosts();
    this.isOnline = true;
  }

  addPostToStore = (entry) => {
    if (this.posts.filter((e) => {return e.hash === entry.hash;}).length === 0) {
      const newPostObj = {
        hash: entry.hash,
        subject: entry.payload.value.subject || entry.payload.value.name,
        body: entry.payload.value.body,
        createdAt: entry.payload.value.createdAt,
        address: entry.payload.value.address,
      };
      console.log("adding newPostObj to posts store", newPostObj);
      this.posts.push(newPostObj);
    }
  };

  async loadPosts() {
    // this.feed = await this.odb.feed(this.odb.identity.id + '/playlists')

    this.feed.events.on("replicated", async (dbAddress, count, newFeed, d) => {
     // this.feed = await newFeed.load(); (seems not to work correctly)
      console.log("replicated - loading posts from db");
      console.log("dbAddress", dbAddress);
      console.log("count", count);
      console.log("feed", newFeed);
      newFeed.all.map(this.addPostToStore);
      //remove remotely deleted entries from playlist store
    });

    this.feed.events.on("write", async (hash, entry, heads) => {
      console.log("wrote something adding to Posts" + hash, entry);
      this.addPostToStore(entry);
    });

    // When the database is ready (ie. loaded), display results
    this.feed.events.on("ready", (dbAddress, feedReady) => {
      console.log("database ready " + dbAddress, feedReady);
      // this.feed = feedReady
      if(this.feed !== undefined)        this.feed.all.map(this.addPostToStore);
      else console.log('feed is still undefined although ready')

    });

    this.feed.events.on("replicate.progress", async (dbAddress, hash, obj) => {
      console.log("replicate.progress", dbAddress, hash, obj);
      // this.feed = await this.feed.load(); doesn't seem to be useful here.
      const entry = await this.feed.get(hash);
      for (let i = 0; i < this.posts.length; i++) {
        console.log(">", this.posts[i].hash, this.posts[i].address);
        if (this.posts[i].hash === entry.hash) {
          console.log(
            "removed playlist from store because it was deleted on another node",
            entry.hash
          );
          this.playlist = this.posts.splice(i, 1);
        }
      }
    });
    await this.feed.load();
  }

  /**
   * Create a new feed for every post
   */
  async createNewPost() {
    console.log("creating new postFeed", this.currentPost.subject)
    const postsFeed = await this.odb.feed(this.currentPost.subject, {
      accessController: { type: "orbitdb", write: [this.odb.identity.id] },
    })

    const p = {
      subject: this.currentPost.subject,
      body: this.currentPost.body,
      createdAt: this.currentPost.createdAt?this.currentPost.createdAt:new Date().getTime(),
      address: postsFeed.address.toString(),
    }

    const hash = await this.feed.add(p);
    return hash;
  }

  async removePost() {
    const filteredData = this.posts.filter((item) => {
      return item.hash !== this.currentPost.hash
    });

    this.posts.replace(filteredData);
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

  //   if (this.odb) {
  //     console.log('loading comments of post ',nextAddress)
  //     const blogPost = this.odb.stores[nextAddress] || (await this.odb.open(nextAddress));
  //     await blogPost.load();
  //     this.currentFeed = blogPost; 
  //   }else console.log('odb not loaded')

  // }

  async joinBlogPost(address) {
    console.log("joinBlogPost - loading address", address);
    if (this.odb) {
      const ourPost = this.posts.filter((item)=>{return item.address === address})
      this.posts.forEach((item)=>console.log(item.subject))
      this.currentPost = ourPost.length>0?ourPost[0]:this.posts[0]

      try {
        const blogPost =
        this.odb.stores[address] || (await this.odb.open(address));
        await blogPost.load();
        this.currentFeed = blogPost
      }catch(ex){
        console.log(ex,'comments feed could not loaded')
      } 
    }else console.log('odb not loaded')
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
    console.log("adding data to db on address", address);
    const blogPost = this.odb.stores[address] || (await this.odb.open(address));
    if (blogPost) {
      const hash = await blogPost.add(data);
      console.log("got hash", hash);
      await blogPost.load();
      this.currentFeed = blogPost;
      console.log("blogPost feed loaded", this.currentFeed);
      return blogPost.get(hash);
    }
    return;
  }
}

const store = window.store = new BlogStore()
export default store
