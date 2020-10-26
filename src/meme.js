class Meme {

  static allMemes = []

  constructor(meme) {
    // this.name = ...
    // this.description = ...
    // this.comments = ...
    Meme.allMemes.push(this)
  }

  static fetchMemes() {
    
  }
}
