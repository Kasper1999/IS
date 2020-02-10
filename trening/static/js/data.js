let objUser;
let userState;

const dataFunctions = {
    'AppState': function () {
        if (localStorage.getItem("AppState") == undefined) {
            userState = {
                'loggedInUser': "outside",
            };
        } else {
            userState = JSON.parse(localStorage.getItem("AppState"));
        };
    },
    'AddNewData': function (obj, DataName) {
        let serialObj = JSON.stringify(obj); //сериализуем его
        localStorage.setItem(DataName, serialObj); //запишем его в хранилище по ключу 
        obj = JSON.parse(localStorage.getItem(DataName)) //спарсим его обратно объект;
    },
}

/////////////////////////////////////////////////////////////////////////////

// let baseChanged = new Event('baseChanged');  ///     БЕЗ ЭТОГО БЕЗ ПЕРЕЗАГР НЕ ОТРИСОВЫВАЕТСЯ НОВЫЙ ЗАРЕГ ПОЛЬЗОВАТЕЛЬ

let DB = {
    getUsers: getUsers,
    getUserById: getUserById,
    updateUserInfo: updateUserInfo,
    addComment: addComment,
    checkUser: checkUser,
    createUser: createUser
}

function getUsers() {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (state) {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr);
                resolve(JSON.parse(xhr.response))
            }
        }
        xhr.open("GET", '/getusers');
        xhr.send();
    })
};

function getUserById(userId) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (state) {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                let response = JSON.parse(xhr.response);
                resolve(response);
            }
        }
        xhr.open("GET", '/getuserbyid/' + userId);
        xhr.send();

    })
};

function checkUser() {
    let loginInfo = {};
    loginInfo.login = document.getElementById('login-field-enter').value;
    loginInfo.pass = document.getElementById('password-field-enter').value;
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    formData.append("loginInfo", JSON.stringify(loginInfo));
    xhr.onreadystatechange = function (state) {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let response = JSON.parse(xhr.response);
            if (response.status == 'error') {
                userState.loggedInUser = "outside";
                dataFunctions.AddNewData(userState, "AppState");
                CallError("Неверный логин или пароль", document.getElementById('enter'));
            } else {
                userState.loggedInUser = loginInfo.login;
                dataFunctions.AddNewData(userState, "AppState");
                location.hash = 'HomePage';
                FormsSideEffect();
                CallForm();
                FormsSideEffect();
            }
        }
    }
    xhr.open("POST", '/loginuser');
    xhr.send(formData);
};

function createUser() {
    let createInfo = {};
    createInfo.login = document.getElementById('login-field-add').value;
    createInfo.pass = document.getElementById('password-field-add').value;
    let confirmPass = document.getElementById('password-field-check').value;
    if (createInfo.login.value != "" && createInfo.pass.value != "") {
        if (createInfo.login.indexOf('@') >= 0 && createInfo.pass === confirmPass) {
            let xhr = new XMLHttpRequest();
            let formData = new FormData();
            formData.append("newUser", JSON.stringify(createInfo));
            console.log(formData);
            xhr.onreadystatechange = function (state) {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    let response = JSON.parse(xhr.response);
                    if (response.status == 'error') {
                        console.log(response.errorText);
                    } else {
                        // document.dispatchEvent(baseChanged);
                        CreateUserBlockAdd(createInfo.login, "User");
                        FormsSideEffect();
                    }
                }
            }
            xhr.open("POST", '/createnewuser');
            xhr.send(formData);
        } else {
            CallError("Некорректный логин или пароль", document.getElementById('add'));
        }
    } else {
        CallError("Введите логин и пароль", document.getElementById('add'));
        //localStorage.clear();
    }
};

function updateUserInfo(userId) {
    let newInfo = {};
    newInfo.name = document.getElementById('user-name-field').value;
    newInfo.dob = document.getElementById('user-date-field').value;
    console.log(newInfo);
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    formData.append("updateUser", JSON.stringify(newInfo));
    formData.append("userId", userId);

    xhr.onreadystatechange = function (state) {
        if (xhr.readyState == XMLHttpRequest.DONE) {}
    }
    SelectUserInformation(userId, document.getElementById(userId + "_inf_div"));
    xhr.open("POST", '/updateuserinfo');
    console.log(formData);
    xhr.send(formData);
}

///////////////////////////////////////////////////////////////////////////////////////

function addComment(Imgid) {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let createComment = {
        status: "img",
        appurtenance: Imgid,
        authorComment: userState.loggedInUser,
        comment: document.getElementById('comment-field').value
    }
    formData.append("newComment", JSON.stringify(createComment));
    xhr.onreadystatechange = function (state) {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            //document.dispatchEvent(baseChanged);   
        }
    }
    if (createComment.comment) {
        xhr.open("POST", '/addComment');
        xhr.send(formData);
    }
}

function getCommentById(userId) { //////////////////!!!
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (state) {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                let response = JSON.parse(xhr.response);
                resolve(response);
            }
        }
        xhr.open("GET", '/getCommentById/' + userId);
        xhr.send();
    })
};