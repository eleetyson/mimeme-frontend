class Comment {
  constructor(comment) { // connect new comments to the appropriate meme objects
    this.id = comment.id
    this.content = comment.content
    this.meme_id = comment.meme_id
    Comment.allComments.push(this)
  }
}
