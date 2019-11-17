const url = 'https://strive-school-testing-apis.herokuapp.com/api/movies/'
const autorization = btoa('user12:5s*f!thGyuC8xm&h')
const getInit = {
    headers: {
        'Authorization': `Basic ${autorization}`,
    },
}

const _$ = (element) => document.querySelector(element)

const cleanForm = () => {
    let name = _$('#movies-name')
    let description = _$('#movies-desc')
    let category = _$('#movies-category')
    let imageUrl = _$('#movies-image')

    name.value = ''
    description.value = ''
    category.value = ''
    imageUrl.value = ''
    
    
}

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
    if (reponse.ok) cleanForm()
    cleanForm()
    await renderAdmin()
}
/**
 * 
 * @param {string} id 
 */
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
    for (let category of categories) {
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
    const {imageUrl, name, description, _id, category} = movie
    return `
    <tr>
        <th scope="row" id="update-id">${_id}</th>
        <td id="update-name">${name}</td>
        <td id="update-desc">${description}</td>
        <td id="update-category">${category}</td>
        <td> <img src="${imageUrl}" width="40" style="height: auto;" alt="" id="update-img"></td>
        <td><a type="button" class="btn btn-warning" href="#" onclick="renderUpdateForm(event)">Edit</a></td>
        <td><a type="button" class="btn btn-danger"  href="#" onclick="deleteMovie('${_id}')">Delete</a></td>
    </tr>
    `
}

/**
 * pre form to update movies
 */

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
                <input type="hidden" id="movies-id" name="custId" value="">

                <button type="submit" class="btn btn-primary">Update</button>
        </div>
        </form>
    `
}

/**
 * function to render value in the  update form
 * @param {Event} event 
 */
const renderUpdateForm = async function (event) {
    event.preventDefault()
    const table = event.currentTarget.parentNode.parentNode
    const formElement = _$('.form-wrapper')
    formElement.innerHTML = ''
    formElement.innerHTML = editTemplate()

    let name = _$('#movies-name')
    let description = _$('#movies-desc')
    let category = _$('#movies-category')
    let imageUrl = _$('#movies-image')
    let movieId = _$('#movies-id')


    name.value = table.querySelector('#update-name').textContent
    description.value = table.querySelector('#update-desc').textContent
    category.value = table.querySelector('#update-category').textContent
    imageUrl.value = table.querySelector('#update-img').src
    movieId.value = table.querySelector('#update-id').textContent
    


    await renderAdmin()
}
/**
 * function to update movies
 */
const updateMovies = async () => {
    event.preventDefault()
    const movies = {
        name: _$('#movies-name').value,
        description: _$('#movies-desc').value,
        category: _$('#movies-category').value,
        imageUrl: _$('#movies-image').value,
    }
    console.log(movies)
    // id movie in hidden input
    let movieId = _$('#movies-id').value

    const postInit = {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Basic ${autorization}`,
        },

        body: JSON.stringify(movies)
    }

    let request = await fetch(url + movieId, postInit)

    let reponse = await request.json()
    cleanForm()
    await renderAdmin()
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