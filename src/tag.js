const addTagToContainer = document.querySelector('.tagContainer')

class Tag {

    constructor (id, name) {
        this.id = id,
        this.name = name
    }

    displayTag(){
        debugger
        let tagBtn = document.createElement('button')
        tagBtn.setAttribute('class', 'tagElements')
        tagBtn.innerText = `${this.name}`
        document.querySelector('.tagContainer').append(tagBtn)
    }
}
