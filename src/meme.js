const API_URL = "http://localhost:3000"

class Meme {

  static allMemes = [] // class-level array to hold all meme objects
  static miniSearch = new MiniSearch({ fields: ['name', 'description'] })
  // using MiniSearch to create a search engine that will index the meme objects' names and descriptions

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

    this.collectSearchData()
    // after content and event listeners added to all memes, invoke collectSearchData() to index the memes
  }

  static async collectSearchData() {
    this.miniSearch.addAll(this.allMemes) // index the meme objects to be searched
    let searchForm = document.querySelector("form.d-flex")
    searchForm.addEventListener("submit", this.filter)
    // add an event listener for search action
  }

  static async filter() {
    event.preventDefault()
    let input = document.querySelector("form.d-flex input").value

    if (!!input) // only want to search if search field actually contains text
      let results = Meme.miniSearch.search(`${input}`, { prefix: true })
      let result_ids = results.map(result => result.id)
      let cards = document.querySelectorAll("div.card") // grab the node list of all cards

      for (let i = 0; i < cards.length; i++) {
        // for all cards:
        // if their h4 doesn't match any of the titles for the results in the array, then...
        // add a "d-none" class to their classlist
      }
    end

    // after returning the results, need to render the Show all memes button
      // use insertBefore to insert the button and a br tag after it

      // remove this button after it's clicked
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
