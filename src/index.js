let showEntryForm = false
const entryForm = document.querySelector('.form')
const addEntryBtn = document.querySelector('#new-journal-entry')
const container = document.querySelector('.entry-form-container')
const findDiv = document.querySelector('#all-entries')

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();



let posts = []


document.addEventListener("DOMContentLoaded", () => {

    
 // adding new post entries from submissions and API   
    function displayPost(post) {
        let h3 = document.createElement('h3')
        h3.innerText = post.title
        
        let p = document.createElement('p')
        p.innerText = post.text

        
        let btn = document.createElement('button')
        btn.innerText = 'delete'
        btn.dataset.id = post.id
        btn.addEventListener('click', removeItem)
        
        let divCard = document.createElement('div')
        divCard.setAttribute('class', 'one-entry')
        divCard.append(h3, p, btn)
        findDiv.append(divCard)
    };
    
    // handling posts from the API
    function displayPosts() {
        posts.forEach(post => {
            displayPost(post)
        })
    };

   
    
    // getting data from posts
    fetch('http://localhost:3000/posts')
    .then(r => r.json())
    .then(data => {
        posts = data
        displayPosts()
    })
    
    // deleting posts
    function removeItem(e){
        const id = e.target.dataset.id
        fetch(`http://localhost:3000/posts/${id}`, {
            method: 'delete',
            headers: {'Content-Type': 'application/json'}
        })
        e.target.parentElement.remove()
    }
    
    // SHOW ENTRY FORM
    addEntryBtn.addEventListener('click', ()=> {
        showEntryForm = !showEntryForm
        if (showEntryForm) {
            entryForm.style.display = 'block'
            entryForm.addEventListener('submit',  e => {
                e.preventDefault();
                postEntry(e)
                console.log(e)
                e.target.reset()
                // showDate()
                showEntryForm = false
                entryForm.style.display = 'none'
            })
        } else {
            entryForm.style.display = 'none'
        }
    })

    // upload file

    
    // getting values from form and then fetching it to store in API, then sent to show on page
    function postEntry(entry_info){
        console.log(entry_info)
        const newPost = {
            title: entry_info.target.title.value, 
            text: entry_info.target.text.value,
            // specialty: e.target.specialty.value
        }
        // console.log(newPost)
        fetch('http://localhost:3000/posts', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(newPost),
        })
        .then((response) => response.json())
        .then((data) => {
            displayPost(data)
        })
        .catch(resp => console.log(resp))
    }
    
    // function showDate(){
    //     today = mm + '/' + dd + '/' + yyyy;
    //     let h4 = document.createElement('h4')
    //     h4.innerText = document.write(today)
    //     entryForm.append(h4);
    // }
    
})

