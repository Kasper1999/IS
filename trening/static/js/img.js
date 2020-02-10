/// Работа с изображениями на стороне пользователя ъ

let ObjInteractionImage = {
    avaImgСhange: enterAvaImgСhange,
    avatar: downloadAvatar,
    images: downloadImages,
    deleteImg: deleteImage
}

function enterAvaImgСhange(input, method, user) {
    input.onchange = function (e) {
        ObjInteractionImage[method](input, user);
    }
}

function downloadAvatar(input, user) {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let photo = input.files[0];
    photo.name = user + "_avatar_";
    let format = photo.name.split('.');
    let path = "../img/ava/" + user + "-ava." + format[1];
    console.log(photo, user, path);
    formData.append("user", user);
    formData.append("photo", photo);
    formData.append("path", path);
    console.log(formData);
    xhr.open("POST", '/avatar');
    xhr.send(formData);
}

function downloadImages(input, user) {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let length = 0;
    let images = input.files;
    let pathAll = "";
    for (let i = 0; i < images.length; i++) {
        let path = "/img/user_img/" + user + "-img-" + images[i].name;
        pathAll += path + "|";
        formData.append("image_" + i, images[i]);
        length++;
    }
    console.log("images.length, user, pathAll");
    console.log(images.length, user);
    console.log(images);
    console.log(pathAll);

    let createImg = {
        "author": user,
        "path": pathAll
    }
    formData.append("newImg", JSON.stringify(createImg));
    formData.append("length", length);
    xhr.open("POST", '/images');
    xhr.send(formData);
}

function GETrequest(request_name) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (state) {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                // console.log(xhr);
                resolve(JSON.parse(xhr.response))
            }
        }
        xhr.open("GET", request_name);
        xhr.send();
    })
}

function deleteImage(id) {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    formData.append("id", id);
    xhr.open("POST", '/deleteImage');
    xhr.send(formData);
}


