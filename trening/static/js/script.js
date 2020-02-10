/// Основной скрипт 

// Глобальные DOM елементы
const $registration = document.getElementById('registration');
const $news = document.getElementById('news');
const $home = document.getElementById('home');
const $entry = document.getElementById('entry');
const $user = document.getElementById('user');
const $edit = document.getElementById('edit');
const $exit = document.getElementById('exit');

const $add_form = document.getElementById('form-add');
const $enter_form = document.getElementById('form-enter');
const $exit_form_add = document.getElementById('exit_form_add');
const $exit_form_enter = document.getElementById('exit_form_enter');
const form_class = [$add_form, $enter_form];

const $elemError = document.createElement('div');

const $login_add = document.getElementById('login-field-add');
const $password_add = document.getElementById('password-field-add');
const $password_check = document.getElementById('password-field-check');

const $login_enter = document.getElementById('login-field-enter');
const $password_enter = document.getElementById('password-field-enter');

const $create_button = document.getElementById('create_button');
const $enter_button = document.getElementById('enter_button');

const $container = document.getElementById('container');

let $delImg;


// Работа с шаблоном формы
let $parent = document.getElementById('user_edit_form');
let $cloneEditForm = $parent.cloneNode(true);
$parent.remove();
$cloneEditForm.classList.toggle('hidden');

$parent = document.getElementById('comment_form');
let $cloneCommentForm = $parent.cloneNode(true);
$parent.remove();
$cloneCommentForm.classList.toggle('hidden');

// Страници на сайте
let pages = {
    'HomePage': OpenHomePage,
    'UserPage': OpenUserPage,
    'EditPage': OpenEditPage,
    'NewsPage': OpenNewsPage,
}

// Вызов
App();
document.addEventListener('baseChanged', App);


// Массив блоков URL
function CreateHashArray() {
    let hashAddress = location.hash.substring(1);
    let page = hashAddress.split('/');
    return page;
}

/////////////////////////// Перенапраления на страницы и состояния
function App() {
    RemoveUsersBloks();

    dataFunctions.AppState();

    if (userState.loggedInUser != "outside") {
        let page = CreateHashArray();
        if (!page[0]) {
            page[0] = 'HomePage';
        }
        $user.innerHTML = userState.loggedInUser;
        pages[page[0]]();
        if (page.indexOf("edit") > 0 && page[0] != 'HomePage') {
            CreateEditingForm(document.getElementById(page[2]));
        }
    } else {
        CreateUsersBlocks(objUser, 'User'); //////
        DB.getUsers().then(function (data) {
            for (let key in data) {
                CreateUserBlockAdd(data[key].login, "User")
            }
        });
        ShowLink($entry, $registration);
        HidenLink($exit, $home, $user, $edit, $news);
        window.location.hash = "";
        userState.loggedInUser = "outside";
        dataFunctions.AddNewData(userState, "AppState");
        $edit.href = "#EditPage";
    }
}

///////////////////////// Фунции форм и видимости
function CallForm(form) {
    form_class.forEach(element => {
        if (element == form) {
            form.classList.toggle('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
    $elemError.remove();
}

function CallError(text, button) {
    $elemError.className = "error";
    $elemError.innerHTML = text;
    button.before($elemError);
}

function ClearFields(...field) {
    field.forEach(element => {
        element.value = "";
    });
}

function ShowLink(...elem) {
    for (let element of elem) element.classList.remove('hidden');
}

function HidenLink(...elem) {
    for (let element of elem) element.classList.add('hidden');
}

/////////////////////// Авторизация и Идентификация

// Регистрация (добавление) пользователя/лей
function Add() {
    DB.createUser(); /////////////////////////
}

function FormsSideEffect() {
    ClearFields($login_add, $password_add, $password_check, $login_enter, $password_enter);
    $elemError.remove();
}

// Вход пользователя
function Enter() {
    DB.checkUser();
}

////////////////////////// Страницы
function OpenNewsPage() {
    RemoveUsersBloks();
    UseLoginedHeader();
    let arr = [];
    GETrequest('/getAllImages').then(function (data) {
        for (let key in data) {
            arr.push({
                id: data[key]._id,
                period: data[key].period,
                date: data[key].date,
                path: data[key].path.substring(23),
                name: data[key].author.slice(0, data[key].author.length - 8),
                commentArr: data[key].comment
            });
        }
        if (arr.length == 0) {
            CreateReminderBlock("Нет свыжих новостей");
        }
    }).then(function () {
        let periodArr = arr.sort(function (a, b) {
            return b.period - a.period;
        });
        periodArr.forEach(function (img) {
            let block = document.createElement('div');
            block.className = "human-block color-none";
            block.id = img.id;
            block.innerHTML = "<div class='news-block' id='" + img.id + "_block'>" + "<div class='news-inf'>" + "<p>" + img.name + "</p>" +
                "<p>" + img.date + "</p>" + "</div>" + "<img class='news-img' src='" + img.path + "' alt='wooow'>" + "</img>" + "</div>";
            $container.appendChild(block);
            CreateImgCommentButton(block.id, document.getElementById(img.id + "_block"), "img");
            console.log(img);
            img.commentArr.forEach(function (comment) {
                console.log("comment");
                console.log(comment);
                CreateImgComment(comment.appurtenance, comment.authorComment, comment.comment, comment._id);
                FormSearch("comment");
            });


        });
        FormSearch("img");
    });
}

function CreateImgCommentButton(id, container, appurtenance) {
    let elem = document.createElement('button');
    elem.className = "comment";
    elem.id = id + "_comment";
    elem.innerHTML = "<a href='#NewsPage/comments/" + appurtenance + "/" + id + "' class='comment_button'>" + "Комментарий" + "</a>";
    container.appendChild(elem);
}

function FormSearch(appurtenance) {
    let page = CreateHashArray();
    if (page.indexOf("comments") > 0 && page.indexOf(appurtenance) > 0) {
        if (document.getElementById(page[3])) {
            CreateCommentForm(document.getElementById(page[3]));
        }
    }
}

function CreateCommentForm(humanBlock) {
    let page = CreateHashArray();
    const $form = document.getElementById("comment_form");
    if (!$form || !humanBlock.querySelector('#comment_form')) {
        humanBlock.appendChild($cloneCommentForm);
        let user = document.getElementById("user-comment");
        user.innerHTML = userState.loggedInUser + ":";
        let $comment = document.getElementById("comment-field");
        ClearFields($comment);
    }
}

function CreateImgComment(userImgId, author, content, commentId) {
    let container = document.getElementById(userImgId);
    let block = document.createElement('div');
    block.className = "comment-content";
    block.id = commentId;
    block.innerHTML = "<p>" + author + ": " + content + "</p>";
    container.appendChild(block);
    CreateImgCommentButton(commentId, document.getElementById(commentId), "comment")
    getCommentById(commentId).then(function (comments) { //////////////!!!
        comments.forEach(function (comment) {
            CreateCommentComment(comment.appurtenance, comment.authorComment, comment.comment, comment._id);
            FormSearch("comment");
        });
    });
}

function CreateCommentComment(userImgId, author, content, commentId) {
    let container = document.getElementById(userImgId);
    let block = document.createElement('div');
    block.className = "comment-comment";
    block.id = commentId;
    block.innerHTML = "<p>" + author + ": " + content + "</p>";
    container.appendChild(block);
}

function SubmitCommentForm(page) {
    /////////////////////////
    DB.addComment(page[3]);
    CloseForm(page[0]);
}

function OpenHomePage() {
    UseLoginedHeader();
    DB.getUsers().then(function (data) {
        for (let key in data) {
            if (!document.getElementById(data[key].login)) {
                CreateUserBlockAdd(data[key].login, "User")
                const $container = document.getElementById(data[key].login);
                CreateUsersEditing(data[key].login, $container, "HomePage");
            }
        }
        let page = CreateHashArray();
        if (page.indexOf("edit") > 0) {
            CreateEditingForm(document.getElementById(page[2]));
        }
    });
}

function OpenUserPage() {
    UseLoginedHeader();
    CreateUserBlockAdd(userState.loggedInUser, "Home for ");
    CreateUsersEditing(userState.loggedInUser, document.getElementById(userState.loggedInUser), "UserPage");
}

function OpenEditPage() {
    UseLoginedHeader();
    let page = CreateHashArray();
    let editUser = "/" + page[1] + "/" + page[2];
    if (page[2]) {
        $edit.href = "#EditPage" + editUser;
        CreateUserBlockAdd(page[2], "Edit: ");
        CreateUsersEditing(page[2], document.getElementById(page[2]), "EditPage");
    } else {
        CreateReminderBlock("Список пуст");
    }
}

// Авторизованный header 
function UseLoginedHeader() {
    ShowLink($exit, $home, $user, $edit, $news);
    HidenLink($entry, $registration);
}
// Удаление блоков при переходе между страницами 
function RemoveUsersBloks() {
    const $elements = document.querySelectorAll('.human-block');
    if ($elements) {
        for (let i = 0; i < $elements.length; i++) {
            $elements[i].remove();
        }
    }
}
///////////////////////////////////////// Работа с блоками и страницами 
function CreateUsersBlocks(humans, text) {
    for (let key in humans) {
        CreateUserBlockAdd(key, text);
    }
    CallForm();
    ClearFields($login_add, $password_add, $password_check, $login_enter, $password_enter);
}

function CreateUserBlockAdd(human, text) {
    let $elem = document.createElement('div');
    $elem.className = "human-block";
    $elem.id = human;
    let $elemInfDiv = document.createElement('div');
    $elemInfDiv.className = "user-inf";
    $elemInfDiv.id = human + "_inf_div";
    $elemInfDiv.innerHTML = "<p>" + text + " " + human + "</p>";
    let $elemAva = document.createElement('div');
    $elemAva.className = "user-ava";
    $elemAva.id = human + "_ava";
    DB.getUserById(human).then(function (user) {
        console.log(user);
        if (user.avatar) { /// get user 
            $elemAva.innerHTML = "<img class='ava' src='" + user.avatar + "' alt='wooow'>" + "</img>";
        } else {
            $elemAva.innerHTML = "<img class='ava' src='img/def_ava.png' alt='wooow'>" + "</img>";
        }
        CreateGallery(user._images, $elemInfDiv); //////////!!!
    });
    SelectUserInformation(human, $elemInfDiv);
    $elem.appendChild($elemAva);
    $elem.appendChild($elemInfDiv);
    $container.appendChild($elem);
}
//////////////////////////////////////////////!!!!!!!!!!!!!!!!1
function CreateGallery(imgs, container) {
    if (imgs[0]) {
        let block = document.createElement('div');
        block.className = "gallery";
        imgs.forEach(function (imgUrl) {
            if (imgUrl) {
                let url = imgUrl.path.substr(23);
                let imgBlock = document.createElement('div');
                imgBlock.className = "gallery-img-block";
                imgBlock.id = imgUrl._id + "-block";
                imgBlock.innerHTML = "<div class='gallery-pseudo-elements' id = '" + imgUrl._id + "-image'>" + "<button class='gallery-close' id = '" + imgUrl._id + "'>" + "</button>" + "</div>" + "<img class='gallery-img' src='" + url + "' alt='wooow'>" + "</img>";
                block.appendChild(imgBlock);
            }
        });
        container.appendChild(block);
    }
}

function DeleteGalleryImg(id) {
    let block = document.getElementById(id + "-block");
    block.remove();
    ObjInteractionImage.deleteImg(id);
}
/////////////////////////////////////////////////!!!!!!!!!!!!!!
// Пустая страница редактирования
function CreateReminderBlock(text) {
    let $elem = document.createElement('div');
    $elem.className = "human-block reminder-block";
    $elem.innerHTML = "<p>" + text + "</p>"
    $container.appendChild($elem);
}

// Выбор способа отображения 
function SelectUserInformation(human, parentBlock) {
    let $elemInf = document.createElement('p');
    $elemInf.id = human + "_inf";
    DB.getUserById(human).then(function (user) {
        if (user.name == "" && user.dob == "") {
            $elemInf = false;
        } else if (user.name != undefined && user.dob == undefined) {
            $elemInf.innerHTML = user.name;
        } else if (user.dob != undefined && user.name == undefined) {
            $elemInf.innerHTML = user.dob;
        } else if (user.name != undefined && user.dob != undefined) {
            $elemInf.innerHTML = user.name + "  " + user.dob;
        }
    });
    if ($elemInf) {
        parentBlock.appendChild($elemInf);
    }
}

// Создание шесетенок 
function CreateUsersEditing(userId, container, page) {
    let elem = document.createElement('div');
    elem.className = "edit";
    elem.innerHTML = "<a href='#" + page + "/edit/" + userId + "' id='" + userId + "_edit' class='edit_button'>" + "</a>";
    container.appendChild(elem);
}

// Создание форм редактирования пользователей
function CreateEditingForm(humanBlock) {
    let page = CreateHashArray()
    let editUser = "/" + page[1] + "/" + page[2];
    $edit.href = "#EditPage" + editUser;
    const $form = document.getElementById("user_edit_form");
    if (!$form || !humanBlock.querySelector('#user_edit_form')) {
        humanBlock.appendChild($cloneEditForm);
        let $name = document.getElementById("user-name-field");
        let $date = document.getElementById("user-date-field");
        ClearFields($name, $date);
        DB.getUserById(humanBlock.id).then(function (user) {
            if (user.name) {
                $name.value = user.name;
            }
            if (user.dob) {
                $date.value = user.dob;
            }
        });
    }
    ObjInteractionImage.avaImgСhange(document.getElementById('avatar'), 'avatar', page[2]);
    ObjInteractionImage.avaImgСhange(document.getElementById('user-images'), 'images', page[2]);
    //$("#user_edit_form").fadeIn(1000); //плавное появление
}

// Отправка формы редакт.
function SubmitUserForm(page) {
    /////////////////////////
    DB.updateUserInfo(page[2]);
    CloseForm(page[0]);
}

// Закрытие формы редакт.
function CloseForm(page, pageName) {
    if (pageName && pageName != "#NewsPage") {
        $edit.href = pageName;
    }
    window.location.hash = page;
}

function Exit() {
    ShowLink($entry, $registration);
    HidenLink($exit, $home, $user, $edit, $news);
    window.location.hash = "";
    userState.loggedInUser = "outside";
    dataFunctions.AddNewData(userState, "AppState");
}
