const BASEURL = "http://127.0.0.1:3000"
let showEntryForm = false
const entryForm = document.querySelector('.form')
const addEntryBtn = document.querySelector('#new-journal-entry')
const container = document.querySelector('.entry-form-container')
const divContainer = document.querySelector('#all-entries')
const performSearch = document.querySelector('.search-date__search-input')
let dropdown = document.getElementById('post-tags');
const onePost = document.getElementsByClassName('one-entry')
let replaceModalDiv = document.querySelector(".addPostToModal")
const tagLink = document.querySelector('#sortTags')



let journal = {posts: [], tags: [], postTags: []}

document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
    addTagLink();
})

    //////////////////////////////////////////////////
    // ADD TAG LINK TO SHOW TAGS
    
    function addTagLink(){
        let createTagLink = document.createElement('link')
        createTagLink.setAttribute = ("class", "link")
        createTagLink.innerText = 'Tags'
        taglink.append(createTagLink)
    }

    //////////////////////////////////////////////////
    // EVENT LISTENER FOR SHOW ENTRY FORM & POST FORM

    addEntryBtn.addEventListener('click', ()=> {
        showEntryForm = !showEntryForm
        if (showEntryForm) {
            entryForm.style.display = 'block'
            addEntryBtn.style.display = 'none'
            loadTagsIntoSelect()
            entryForm.addEventListener('submit',  e => {
                e.preventDefault()
                getIdsFromSelect(e)
                e.target.reset()
                showEntryForm = false
                entryForm.style.display = 'none'
                addEntryBtn.style.display = 'block'
            })
        } else {
            entryForm.style.display = 'none'
        }
    })

    function getIdsFromSelect(e){
        let itemList = document.getElementById("post-tags")
        let tagCollection = itemList.selectedOptions
        let selected = []
        for (i=0; i < tagCollection.length; i++){
            let tagsFromSelect = parseInt(tagCollection[i].value)
            selected.unshift(tagsFromSelect)
        }
        if (e.target.title.value != ''){
            postDistribute(e, selected)
        }
    }

    //////////////////////////////////////////////////////
    // GET DATA from data
    
    function loadPosts() {
        fetch(`${BASEURL}/posts`)
            .then(r => r.json())
            .then(posts => {
                for (post of posts){
                    let p = new Post(post.id, post.title, post.text, post.date)
                    p.displayPost()
                    journal.posts.push(p)
                }
                fetchPostTagsForPost()
            }) 
    }

    function fetchPostTagsForPost(){
        fetch(`${BASEURL}/post_tags`)
            .then(r => r.json())
            .then(postTags => {
                for (postTag of postTags){
                    let pt = new PostTag(postTag.id, postTag.post_id, postTag.tag_id)
                    journal.postTags.push(pt)
                }
                return fetch(`${BASEURL}/tags`)
                    .then(r => r.json())
                    .then(tags => {
                        for (tag of tags){
                            let t = new Tag(tag.id , tag.name)
                            journal.tags.push(t)
                        }
                    reduceTagIdsofPosts()
                    })
            })
    }

    function reduceTagIdsofPosts(){
        let postTags = journal.postTags
        reduceToHavePostIdsCombine = Object.values(postTags.reduce((a, c) => {
            (a[c.post_id] || (a[c.post_id] = Object.assign({}, c, {tag_id: []}))).tag_id.push(c.tag_id);
            return a;
        }, Object.create(null)));
        addTagsToRespectivePosts(reduceToHavePostIdsCombine)
    }   

    function addTagsToRespectivePosts(posttags){
        for (pt of posttags) {
            if (pt.tag_id.length > 1){
                for (let i = 0; i < pt.tag_id.length; i++){
                    displayTagsOnPosts(pt, pt.tag_id[i])
                }
            } else {
                displayTagsOnPosts(pt, pt.tag_id[0])
            }
        }
    }

    function displayTagsOnPosts(pt, tag_id){
        let tagName = journal.tags.find(tag => tag.id === tag_id).name
        for (let i = 0; i < divContainer.childElementCount; i++){
            if (pt.post_id === parseInt(divContainer.children[i].id)) {
                let postTagDiv = divContainer.children[i].firstElementChild

                let tagBtn = document.createElement('button')
                tagBtn.setAttribute('class', 'tagElements')
                tagBtn.type = 'button'
                tagBtn.innerText = `${tagName}`
                postTagDiv.append(tagBtn)
                
            }
        }
    }

    function addTag(post, tag){
        console.log('finale post', post)
        console.log('FINAL', tag)
    }
        
    ////////////////////////////////////////////////////
    // GET TAGS into Select Form from data

    function loadTagsIntoSelect() {
        dropdown.length = 0;
    
        let defaultOption = document.createElement('option');
        defaultOption.text = 'Add Tags';
    
        dropdown.add(defaultOption);
        dropdown.selectedIndex = 0;
        
        fetch(`${BASEURL}/tags`)  
        .then(  
            function(response) {  
                if (response.status !== 200) {  
                    console.warn('Looks like there was a problem. Status Code: ' + 
                    response.status);  
                    return;  
                }
                    response.json().then(function(data) {  
                        let option;
                    
                        for (let i = 0; i < data.length; i++) {
                            option = document.createElement('option');
                            option.text = data[i].name;
                            option.value = data[i].id;
                            option.id = data[i].name
                    
                            dropdown.add(option);
                        }    
                    }); 
            }  
        )  
        .catch(function(err) {  
            console.error('Fetch Error -', err);  
        });
    }

    //////////////////////////////////////////////////////
    // POSTing new Posts

    function postDistribute(e, tagsFromSelect){
        let postValues = [e.target.date.value, e.target.title.value, e.target.text.value]
        postEntry(postValues, tagsFromSelect)
    }

    function postEntry(postInfo, tagsFromSelect){
        const newPost = {
            date: postInfo[0],
            title: postInfo[1], 
            text: postInfo[2]
        }
        fetch(`${BASEURL}/posts`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(newPost),
        })
        .then(response => {
            return response.json()
        })
        .then(post => {
            // console.log(post)
            // debugger
            let p = new Post(post.id, post.title, post.text, post.date)
            journal.posts.push(p)
            p.displayPost()
            nowDoPostTags(tagsFromSelect, post.id)
        })    
        
        function nowDoPostTags(tagsFromSelect, id){
            tagsFromSelect.forEach(tag => {
                fetch(`${BASEURL}/post_tags`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        post_id: `${id}`,
                        tag_id: `${tag}`
                    }),
                })
                .then(response => {
                    return response.json()
                })
                .then(postTag => {
                    journal.postTags.push(postTag)
                    displayTagsOnPosts(postTag, tag)
                })
                .catch(resp => 
                    console.log({resp})
                );
            })
        }
    }

    //////////////////////////////////////////////////////
    // DELETE A POST

    function removeItem(e){
        let showForm = document.getElementsByClassName('postSettings')
        e.preventDefault
        const deleteId = e.target.parentElement.id
        fetch(`${BASEURL}/posts/${deleteId}`, {
            method: 'delete',
            headers: {'Content-Type': 'application/json'}
        })
            // .then(res => res.json())
            // .then(res => console.log(res))
        let findDivToDelete = document.querySelectorAll('.one-entry')
        for (let i = 0; i < findDivToDelete.length; i++) {
                if (findDivToDelete[i].id === deleteId) {
                    findDivToDelete[i].remove()
                    modalDIV.innerHTML = ""
                    modal.style.display = "none";
                }
            }
    }

    //////////////////////////////////////////////////////
    // EDIT A POST

    function editItem(e){
        e.preventDefault
        const editPost = {
            date: e.target.parentElement.children[1].innerText.split(" ")[1],
            title: e.target.parentElement.children[2].innerText, 
            text: e.target.parentElement.children[3].innerText,
        }
        const editId = parseInt(e.target.parentElement.id)
        // debugger
        fetch(`${BASEURL}/posts/${editId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(editPost),
        })
            .then(resp => resp.json())
            .then(updatedPost => {
                let editedPost = new Post(updatedPost.id, updatedPost.title, updatedPost.text, updatedPost.date, updatedPost.tag_id)
                replaceModalDiv.innerHTML = ""
                editedPost.showFullFormInModal()
                // editedPost.displayPost
        })
        // select the div, empty the HTML and then call the fetch again
    }

    ////////////////////////////////////////////////////////
    // SEARCH BY DATES OR BY TAGS

    performSearch.addEventListener('keyup', (e) => {
        let search = e.target.value.toLowerCase()
        if (search == "") {
            divContainer.innerText = ""
            journal = {posts: [], tags: [], postTags: []}
            loadPosts()
            // divContainer.innerHTML = loadPosts()

        } else {
            let results = filteredPosts(search)
            divContainer.innerHTML = ''
            showSearchedPosts(results);
        }
    })

    function filteredPosts(search){
        if (!!isNaN(search)) {
            let filteredTags = journal.tags.filter(tag => tag.name.toLowerCase().includes(search))
            let answerForTags = findPostGivenFilteredTags(filteredTags)
            // debugger
            postTagsForSearchedPost(answerForTags)

        } else {
            return journal.posts.filter(post => post.date.includes(search))
        } 
    }

    function findPostGivenFilteredTags(tags){
        // debugger
        for (let i=0; i < tags.length; i++){
            debugger
            let filteredTagsToFindPostOwner = journal.postTags.filter(pt => pt.tag_id.includes(tags[i]))
            return journal.posts.filter(post => post.id.includes(filteredTagsToFindPostOwner))
        }
        
    }

    function showSearchedPosts(posts) { 
        let individualPosts= []
        for (i=0; i < posts.length; i++) {
            individualPosts.push(posts[i].id)
            posts[i].displayPost()
   
            // let tagDiv = document.createElement('div')
            // tagDiv.setAttribute('class', 'tagContainer')
            // tagDiv.innerHTML = ''

            // let h4 = document.createElement('h4')
            // h4.setAttribute('class', 'divElements')
            // h4.innerText = `Date: ${posts[i].date}`
            // // h4.innerText = `Date: ${this.date}`

            // let h3 = document.createElement('h3')
            // h3.setAttribute('class', 'divElements')
            // h3.innerText = posts[i].title
            // // h3.innerText = this.title                  
                
                
            // let divCard = document.createElement('div')
            // divCard.setAttribute('class', 'one-entry')
            // divCard.append(tagDiv, h4, h3)
            // divContainer.append(divCard)
        }
        postTagsForSearchedPost(posts)
    }

    function postTagsForSearchedPost(individualPosts){
        debugger
        for (let i=0; i < individualPosts.length; i++){
            let posts = journal.postTags.filter(pt => pt.post_id.includes(individualPosts[i]))
        }
    }
