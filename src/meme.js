// const API_URL = "http://localhost:3000"
const API_URL = "https://mimeme.herokuapp.com"
const cards = document.querySelectorAll("div.card") // the node list of all cards

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

  static renderMemes() { // for each meme object in the class array, invoke this instance method
    for (let meme of this.allMemes) {
      meme.renderMeme()
    }

    // after content and event listeners added to all memes, invoke collectSearchData() to index the memes for searches
    this.collectSearchData()
  }

  renderMeme() { // add content to each meme's card and corresponding modal
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
  } // end renderMeme method

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

  static collectSearchData() {
    this.miniSearch.addAll(this.allMemes) // index the meme objects to be searched
    let searchForm = document.querySelector("form.d-flex")
    // add event listener to render all cards when search field is cleared out
    searchForm.addEventListener("keyup", this.clearSearch.bind(this))
    // and another for normal searches
    searchForm.addEventListener("submit", this.filter.bind(this))
  }

// if the search bar is empty after keyup, render all cards and remove unnecessary elements
  static clearSearch() {
    if (!document.querySelector("form.d-flex input").value) {
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("d-none")
      }

      if (!!document.querySelector("p.text-center")) {
        document.querySelector("p.text-center").remove()
      }
    } // end if block
  } // end clearSearch method

  static filter() {
    event.preventDefault()
    let input = document.querySelector("form.d-flex input").value

    if (!!input) {  // only want to search if search field actually contains text
      let results1 = Meme.miniSearch.search(`${input}`, { prefix: true }) // for prefix match
      let result_ids = results1.map(result => result.id)
      if (result_ids.length === 0) { // for typo match if no prefix matches
        let results2 = Meme.miniSearch.search(`${input}`, { fuzzy: 0.3 })
        result_ids = results2.map(result => result.id)
      }

      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("d-none") // reset display for all cards in case some are hidden
        if (!!document.querySelector("p.text-center")) { // remove no results message if still displayed
          document.querySelector("p.text-center").remove()
        }

        if ( !result_ids.includes( parseInt(cards[i].id.split("d")[1]) ) ) {
          cards[i].classList.add("d-none") // if a card doesn't match user's search, hide it again
        }
      }

    } // end if block

    // if every card is hidden -- meaning no results found -- display this message (if not already displayed)
    if ( Array.from(cards).every(e => e.classList.contains("d-none")) ) {
      if (!document.querySelector("p.text-center")) {
        let p = document.createElement("p")
        p.classList.add("text-center")
        p.innerText = "No results found. Try searching again."
        document.querySelector("#end").after(p)
      }
    }

  } // end filter method


} // end Meme class
