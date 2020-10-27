const API_URL = "http://localhost:3000"

class Meme {

  static allMemes = [] // class-level array to hold all meme objects

  constructor(meme) { // instantiate new memes and add them to the class array
    this.id = meme.id
    this.name = meme.name
    this.description = meme.description
    this.comments = meme.comments.map(comment => new Comment(comment))
    Meme.allMemes.push(this)
  }

  static async fetchMemes() {
    try {
      let response = await fetch(`${API_URL}/memes`) // using fetch to make a GET request and retrieve all memes
      let jsObj = await response.json() // turn the JSON response into a JavaScript object
      for (let meme of jsObj) {
        let newMeme = new Meme(meme) // instantiate a new meme for each object into the response array
      }
      this.renderMemes() // invoke another class method to actually render these new memes
    } catch(err) {
      alert(err)
    }
  }

  static async renderMemes() { // for each meme object in the class array, invoke this instance method
    for (let meme of this.allMemes) {
      meme.renderMeme()
    }
  }

  async renderMeme() { // add content to each meme's card and corresponding modal
    let title = document.getElementById(`card${this.id}`).querySelector("h5")
    title.innerText = this.name

    let modalTitle = document.getElementById(`modal${this.id}`).querySelector("h4")
    modalTitle.innerText = this.name

    let description = document.getElementById(`modal${this.id}`).querySelector(".modal-body h5")
    description.innerText = this.description

    let modal = document.getElementById(`modal${this.id}`).querySelector(".modal-body")
    let form = document.getElementById(`modal${this.id}`).querySelector(".modal-body form")
    for (let comment of this.comments) {
      let p = document.createElement("p")
      p.innerText = comment.content
      modal.insertBefore(p, form) // add each comment right above the form
    }

    form.addEventListener("submit", this.addComment.bind(this)) // add an event
  }

  async addComment() {
    event.preventDefault()
    
    let proposedc = event.target.querySelector("textarea").value // grab proposed comment from form
    event.target.querySelector("textarea").value = "" // clear out the textarea field after doing so
    let meme_id = this.id

    if (!!proposedc) {
      try { // upon comment submission, make a POST request via fetch and add it to the modal
        let configObj = {
          method: "POST",
          headers: {"Content-Type": "application/json", "Accept": "application/json"},
          body: JSON.stringify( {comment: {proposedc, meme_id} } )
        }

        let response = await fetch(`${API_URL}/comments`, configObj)
        let jsObj = await response.json()

        // create the new comment object and add it to the modal, above the form
        let modal = document.getElementById(`modal${this.id}`).querySelector(".modal-body")
        let form = document.getElementById(`modal${this.id}`).querySelector(".modal-body form")
        let p = document.createElement("p")
        p.innerText = jsObj.content
        modal.insertBefore(p, form)

      } catch(err) {
        alert(err)
      }
    } // end if block

  } // end addComment method



}
