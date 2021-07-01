let postSettings = false
const modal = document.getElementById("myModal")
const span = document.getElementsByClassName("close")[0];
let modalDIV = document.querySelector(".addPostToModal")



class Post {

    constructor(id, title, text, date){
        this.id = id
        this.title = title;
        this.text = text;
        this.date = date;
    };

    displayPost() {
        let tagDiv = document.createElement('div')
        tagDiv.setAttribute('class', 'tagContainer')
        tagDiv.innerHTML = ''

        let h4 = document.createElement('h4')
        h4.setAttribute('class', 'divElements')
        h4.innerText = `Date: ${this.date}`

        let h3 = document.createElement('h3')
        h3.setAttribute('class', 'divElements')
        h3.innerText = this.title

        let divCard = document.createElement('div')
        divCard.setAttribute('class', 'one-entry')
        divCard.setAttribute('id', this.id)
        divCard.id = this.id
        divCard.value = this.id
        divCard.append(tagDiv, h4, h3)
        divContainer.prepend(divCard)

        divCard.addEventListener('click', (e) => {
                modal.style.display = "block";
                if (e.target.classList.value === "divElements"){
                    let postNum = e.target.parentElement.value
                    modal.style.innerHTML = displayPostByID(postNum)
                } else if (e.target.classList.value === "tagElements"){
                    let postNum = e.target.parentElement.parentElement.value
                    modal.style.innerHTML = displayPostByID(postNum)
                } else if ((e.target.classList.value === 'tagContainer')){
                    let postNum = e.target.parentElement.value
                    modal.style.innerHTML = displayPostByID(postNum)
                } else {
                    let postNum = e.target.value
                    modal.style.innerHTML = displayPostByID(postNum)
                }
        });
    };

    showFullFormInModal() {
        let createSettingsDiv = document.createElement('div')
        createSettingsDiv.setAttribute('class', 'settings')
        createSettingsDiv.setAttribute('id', this.id)
        modalDIV.append(createSettingsDiv)

        let settingsBtn = document.createElement('button')
        settingsBtn.setAttribute('class', 'settingsBtn')
        settingsBtn.innerText = '...'
        createSettingsDiv.append(settingsBtn)
        settingsBtn.addEventListener('click', openSettings)

        let div = document.createElement('div')
        div.setAttribute('class', 'tagContainer')
        // div.innerHTML = 

        let h4 = document.createElement('h4')
        h4.setAttribute('class', 'divElements')
        h4.innerText = `Date: ${this.date}`
        

        let h3 = document.createElement('h3')
        h3.setAttribute('class', 'divElements')
        h3.setAttribute('contentEditable', 'false')
        h3.innerText = this.title

        let p = document.createElement('p')
        p.setAttribute('class', 'divElements')
        p.setAttribute('contentEditable', 'false')
        p.innerText = this.text

        let showCard = document.createElement('div')
        showCard.setAttribute('class', 'full-entry')
        showCard.setAttribute('id', this.id)
        showCard.append( div, h4, h3, p)
        modalDIV.append(showCard)
        
        fetchThoseTags(this.id)
    }
    
}

////////////////////////////////////////////////////
// GET POST FOR MODAL

displayPostByID = (postNum) => {
    // console.log(journal.postTags.filter(pt => pt.post_id === postNum))
    fetch(`${BASEURL}/posts/${postNum}`)
        .then(r => r.json())
        .then(post => {
            let p = new Post(post.id, post.title, post.text, post.date, post.tag_id)
            p.showFullFormInModal()
        })
}

//////////////////////////////////////////////////////////////////////
// FETCH TAGS FOR MODAL VIEW

    function fetchThoseTags(postID){
        let tagIDs = journal.postTags.filter(pt => pt.post_id === postID)
        for (let i = 0; i < tagIDs.length; i++){
            displayTagsOnModal(postID, tagIDs[i].tag_id)
        }
    }

    function displayTagsOnModal(postID, tagId){
        let tagName = journal.tags.find(tag => tag.id === tagId).name
        const tagsToModal = document.querySelector('.full-entry').firstElementChild
        // debugger

        let tagBtn = document.createElement('button')
        tagBtn.setAttribute('class', 'tagElements')
        tagBtn.type = 'button'
        tagBtn.innerText = `${tagName}`
        tagsToModal.append(tagBtn)
    }

///////////////////////////////////////////////////
// EXIT OUT OF MODAL

window.onclick = function(event) {
    if (event.target == modal) {
        modalDIV.innerHTML = ""
        modal.style.display = "none";
    }
    // displayPosts()
}

//////////////////////////////////////////////////////////
// MODAL SETTINGS BUTTON IS PRESSED, CHOOSE EDIT OR DELETE 

function openSettings(e){
    let editBtn = document.createElement('button')
    editBtn.innerText = 'edit'
    editBtn.setAttribute('tag', 'settingButtons')
    editBtn.addEventListener('click', letThemEdit)

    let deleteBtn = document.createElement('button')
    deleteBtn.innerText = 'delete'
    deleteBtn.setAttribute('tag', 'settingButtons')
    deleteBtn.addEventListener('click', removeItem)

    e.target.replaceWith(editBtn, deleteBtn)
}

/////////////////////////////////////////////////////////
// "EDIT FORM HERE" & SENDS TO FETCH PATCH 

function letThemEdit(e){
    let chooseElementToEdit = e.target.parentElement.nextElementSibling.children
    let turnContentEditableBooleanTitle = chooseElementToEdit[2].contentEditable = true 
    let turnContentEditableBooleanText = chooseElementToEdit[3].contentEditable = true
    const editPostId = e.target.parentElement.id

    let showForm = document.querySelector('.settings')
    let modalPostDiv = document.querySelector(".full-entry")

    let doneEditing = document.createElement('button')
    doneEditing.innerText = 'Done Editing'
    doneEditing.addEventListener('click', editItem)

    let note = document.createElement('h6')
    note.innerText = 'Edit Mode: Title & Text'
    showForm.replaceChildren(note)

    modalPostDiv.append(doneEditing)
}



