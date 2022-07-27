document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('#ramen-menu')
    const img = document.querySelector('img.detail-image')
    const name = document.querySelector('h2.name')
    const restaurant = document.querySelector('h3.restaurant')
    const rating = document.querySelector('#rating-display')
    const comment = document.querySelector('#comment-display')
    const newRamen = document.querySelector('#new-ramen')
    const editRamen = document.querySelector('#edit-ramen')
    const deleteRamen = document.querySelector('button')


    fetchRamen('http://localhost:3000/ramens')
    .then(data => {
        data.forEach(ramen => addToRamenMenu(ramen));
        displayRamen(data[0])
    })
    .catch(err => console.log(err))

    newRamen.addEventListener('submit', (e) => {
        e.preventDefault()
        let body = {
            name: e.target['new-name'].value,
            restaurant: e.target['new-restaurant'].value,
            image: e.target['new-image'].value,
            rating: e.target['new-rating'].value,
            comment: e.target['new-comment'].value,
        }
        createRamen(body)
        .then(data => addToRamenMenu(data))
        .catch(err => console.log(err))
        newRamen.reset()
    })

    editRamen.addEventListener('submit', (e) => {
        e.preventDefault()
        let body = {
            rating: e.target['update-rating'].value,
            comment: e.target['update-comment'].value,
        }
        updateRamen(img.id, body)
        .then(data => displayRamen(data))
        .catch(err => console.log(err))
        editRamen.reset()
    })

    deleteRamen.addEventListener('click', () => {
        // console.log(document.querySelector(`#id_${img.id}`))
        removeRamen(img.id)
        document.querySelector(`#id_${img.id}`).remove()
        selectRamen(img.id - 1)
    })

    function addToRamenMenu(input) {
        const image = document.createElement('img')
        image.id = `id_${input.id}`
        image.src = input.image
        menu.append(image)

        image.addEventListener('click', () => selectRamen(input.id))
    }

    function displayRamen(selection) {
        img.id = selection.id
        img.src = selection.image
        img.alt = selection.name
        name.textContent = selection.name
        restaurant.textContent = selection.restaurant
        rating.textContent = selection.rating
        comment.textContent = selection.comment
    }

    function fetchRamen(url) {
        return fetch(url)
        .then(res => res.json())
    }

    function selectRamen(id) {
        fetchRamen(`http://localhost:3000/ramens/${id}`)
            .then(data => displayRamen(data))
            .catch(err => console.log(err))
    }

    function createRamen(body) {
        return fetch('http://localhost:3000/ramens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
    }

    function updateRamen(id, body) {
        return fetch(`http://localhost:3000/ramens/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
    }

    function removeRamen(id) {
        fetch(`http://localhost:3000/ramens/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(res => res.json())
    }
})