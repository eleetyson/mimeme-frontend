class Comment {
  constructor(comment) { // connect new comments to the appropriate meme objects
    console.log(comment)
    this.id = comment.id
    this.content = comment.content
    this.memeId = comment.meme_id
  }
}
