const API_KEY = "04c35731a5ee918f014970082a0088b1"
const URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1"
const imgURL = "https://image.tmdb.org/t/p/w1280"
const searchURL = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query="
const form = document.getElementById("search-form")
const query = document.getElementById("query")
const root = document.getElementById("root")
const loadmore = document.getElementById("loadmore")
let movies = [], page = 1, inSearchPage = false

// Sticky Navbar
document.addEventListener("DOMContentLoaded", function(){
  window.addEventListener('scroll', function() {
    (window.scrollY > 50) ?  $('.navbar').addClass('navbar-light bg-light') : $('.navbar').removeClass('navbar-light bg-light');
  });
});

// Fetch json data from URL
async function fetchData(URL) {
  try {
    const data = await fetch(URL).then((res) => res.json())
    return data
  } catch (error) {
    console.log(error.message)
    return null
  }
}

const fetchAndShowResults = async (URL) => {
  const data = await fetchData(URL)
  data && showResults(data.results)
}

const getSpecificPage = (page) => {
  const URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${page}`
  fetchAndShowResults(URL)
}

const movieCard = (movie) =>
  `<div class="col-md-3 col-sm-6 mt-2 mr-2">
    <div class="card">
      <img src="${movie.poster_path}" class="card-img-top" alt="${movie.original_title}">
      <div class="card-content">
        <div class="card-cont-header">
          <div class="cont-left">
            <h3 style="font-weight: 600">${movie.original_title}</h3>
            <span class="start">
              &#9733;
            <span class="rating">${movie.vote_average}</span>
            </span>
          </div>
          <div class="cont-right">
            <a href="detail.html?id=${movie.id}" target="_blank" class="more">Detail</a>
          </div>
        </div>
        <div class="describe">
        ${movie.overview}  
        </div>
      </div>
    </div>
  </div>`

const showResults = (items) => {
  let content = !inSearchPage ? root.innerHTML : ""
  if (items && items.length > 0) {
    items.map((item) => {
      let { id, poster_path, original_title, vote_average, overview } = item
      if (poster_path) {
        poster_path = imgURL + poster_path
      } else {
        poster_path = "https://fakeimg.pl/500x750/?text=Not+Found"
      }

      if (original_title.length > 15) {
        original_title = original_title.slice(0, 15) + "..."
      }

      if (!overview) {
        overview = "No overview yet..."
      }

      if (!vote_average) {
        vote_average = 0
      }

      const movieItem = {
        id,
        poster_path,
        original_title,
        vote_average,
        overview,
      }
      content += movieCard(movieItem)
    })
  } else {
    content += "<p>Something went wrong!</p>"
  }
  
  root.innerHTML = content 
}

const handleLoadMore = () => {
  getSpecificPage(++page)
}

const detectEndAndLoadMore = (e) => {
  let el = document.documentElement
  if (
    !inSearchPage &&
    el.scrollTop + el.clientHeight == el.scrollHeight
  ) {
    console.log("More!")
    handleLoadMore()
  }
}

form.addEventListener("submit", async (e) => {
  inSearchPage = true
  e.preventDefault()
  const searchTerm = query.value
  searchTerm && fetchAndShowResults(searchURL + searchTerm)
  query.value = searchTerm
  loadmore.style.display = "none"
})

loadmore.addEventListener("click", detectEndAndLoadMore)

function init() {
  inSearchPage = false
  fetchAndShowResults(URL)
}

init()