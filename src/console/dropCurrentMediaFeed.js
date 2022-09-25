const dropCurrentMediaFeed = async () => {

    console.log('dropping current MediaFeed',window.store.currentMediaFeed.id)

    await window.store.currentMediaFeed.drop()

}
window.dropCurrentMediaFeed = dropCurrentMediaFeed;