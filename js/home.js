const url = 'https://strive-school-testing-apis.herokuapp.com/api/movies/'
const autorization = btoa('user12:5s*f!thGyuC8xm&h')
const getInit = {
    headers: {
        'Authorization': `Basic ${autorization}`,
    },
}

const _$ = (element) => document.querySelector(element)

const getCategory = async () => {
    let request = await fetch(url, getInit)
    return await request.json()
}
/**
 * function to get all movies 
 */
const getAllMovies = async () => {
    let movies = []
    let categories = await getCategory()
    for (let category of categories) {
        let reponse = await fetch(url + category, getInit)
        let moviesByCategory = await reponse.json()
        movies.push(...moviesByCategory)
    }
    console.log(movies)
    return movies
}


const row = (category) => {
    console.log(category)
    return `
    <h2 class="text-white">  ${category.toUpperCase()}</h2>
    <div class="row ${category} my-4">
    
  </div>
    `
}

const movieTemplete = (movie) => {
    return `
    <div class="card  text-white col-md-4">
    <img src="${movie.imageUrl}" class="card-img" alt="...">
    <div class="card-img-overlay">
      <h5 class="card-title">${movie.name}</h5>
      <p class="card-text">${movie.description}</p>
    </div>
  </div>
    `
}

window.onload = async () => {
    const wrapperHome = _$('#wrapper')
    let categories = await getCategory()
    let allMovies = await getAllMovies()
    //created row for all catery
    wrapperHome.innerHTML= categories.map(element => row(element)).join('')
    // add all movies for each category
    for (let movie of allMovies) {
        //row target for truffy test
        let movieRow = _$('.'+movie.category)
       if(movieRow) {
           filteredMovies = allMovies.filter(element => element.category === movie.category)
           movieRow.innerHTML = filteredMovies.map(element => movieTemplete(element)).join('')
       }
}
}