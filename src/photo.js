// const CLOUDINARY_API = "https://api.cloudinary.com/v1_1/dmzkwke97/mh/upload"
// const CLOUDINARY_UPLOAD_PRESET = "cdnbv63z/mh/upload"

// let imgPreview = document.getElementById('img-preview')
// let fileUpload = document.getElementById('file-upload')

// fileUpload.addEventListener('change', function(event){
//     let file = event.target.files[0]

//     let formData = new formData()
//     formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

//     axios({
//         url: CLOUDINARY_API,
//         method: 'post',
//         header: {
//             'Content-Type': 'application/x-ww-form-urlencoded',
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Headers': 'Origin',
//             'Access-Control-Allow-Credentials': true,
//         },
//         data: formData
//     }).then(function(res){
//         console.log(res)
//         imagePreview.src = res.data.source_url
//     }).catch(err => console.log(err))
// })

class Photo {
    constructor (img_src, caption) {
        this.img_src = img_src; 
        this.caption = caption;
    }

    // instance method to render obj to dom
}