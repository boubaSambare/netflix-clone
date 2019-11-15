const url = 'https://strive-school-testing-apis.herokuapp.com/api/movies/'
const autorization = btoa('user12:5s*f!thGyuC8xm&h')
const getInit = {
    headers: {
        'Authorization': `Basic ${autorization}`,
    },
}

const _$ = (element) => document.querySelector(element)

const addMovies = async () => {
    event.preventDefault()
    const movies = {
        name: _$('#movies-name').value,
        description: _$('#movies-desc').value,
        category: _$('#movies-category').value,
        imageUrl: _$('#movies-image').value,
    }
    console.log(movies)


    const postInit = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Basic ${autorization}`,
        },

        body: JSON.stringify(movies)
    }

    let request = await fetch(url, postInit)

    let reponse = await request.json()
    if (request.status === 200) alert('saved')
    await renderAdmin()
}

const deleteMovie = async function (id) {
    event.stopPropagation()
    event.preventDefault()
    const deleteInit = {
        method: 'DELETE',
        headers: {
            'Authorization': `Basic ${autorization}`,
        },
    }
    let request = await fetch(url + id, deleteInit)
    let reponse = await request.json()
    if (request.status === 200) {
        await renderAdmin()
    }
}
/**
 * function to get all category avaible 
 */

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
    for (category of categories) {
        let reponse = await fetch(url + category, getInit)
        let moviesByCategory = await reponse.json()
        movies.push(...moviesByCategory)
    }
    console.log(movies)
    return movies
}

/**
 * 
 * @param {object} movie 
 * function to build table to display movies list in back office page
 */

const productsListTemplate = function (movie) {
    return `
    <tr>
        <th scope="row">${movie._id}</th>
        <td>${movie.name}</td>
        <td>${movie.description}</td>
        <td>${movie.category}</td>
        <td> <img src="${movie.imageUrl}" width="40" style="height: auto;" alt=""></td>
        <td><a type="button" class="btn btn-warning" href="back-office.html?id=${movie._id}/" onclick="renderUpdateForm()">Edit</a></td>
        <td><a type="button" class="btn btn-danger"  href="#" onclick="deleteMovie('${movie._id}')">Delete</a></td>
    </tr>
    `
}

const editTemplate = function () {
    return `
            <h2>Update Movies</h2>
            <form onsubmit="updateMovies()">
                <div class="form-group">
                    <label for="formGroupExampleInput">Name</label>
                    <input type="text" class="form-control" id="movies-name" placeholder="name" required>
                </div>
                <div class="form-group">
                    <label for="formGroupExampleInput2">Description</label>
                    <textarea class="form-control" id="movies-desc" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="formGroupExampleInput2">Category</label>
                    <input type="text" class="form-control" id="movies-category" placeholder="Another input"
                        required>
                </div>
                <div class="form-group">
                    <label for="formGroupExampleInput2">Image</label>
                    <input type="url" class="form-control" id="movies-image" placeholder="Another input" required>
                </div>

                <button type="submit" class="btn btn-primary">Update</button>
        </div>
        </form>
    `
}

const renderUpdateForm = function () {
    event.preventDefault()
    const formElement = _$('.form-wrapper')
    formElement.innerHTML = ''

    formElement.innerHTML = editTemplate()
}


const renderAdmin = async function () {
    const wrapper = document.querySelector('#movies-list')
    let movies = await getAllMovies()
    wrapper.innerHTML = movies.map(element => {
        return productsListTemplate(element)
    }).join('')
}



window.onload = async () => {
    await renderAdmin()
}