// Подключение расширений
const path = require('path');
const express = require('express');


/////////////////////////////////////////////// Обьявления
const port = 8000;

const app = express();

// Подключение express статики
app.use(express.static('static'));
app.use(express.static('node_modules/yzmodal'));
app.use(express.static('node_modules/angular'));
app.use(express.static('node_modules/angular-animate'));
app.use(express.static('node_modules/angular-material'));
app.use(express.static('node_modules/angular-messages'));
app.use(express.static('node_modules/angular-aria'));

// Привязка к порту 8000
app.listen(port, function() {
    console.log("Server running at http://127.0.0.1:" + port + "/");
});

/////////////////////////////////////////////// Подключение статичного сайта 
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});    

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/node_modules/modal-angularjs-experiment/index.js');
// });    

app.get('/getusers', function (req, res) {
    // registeredUsers.find(function (err, docs) {
    //     if (err) return console.error(err);
    //     docs = JSON.stringify(docs)
    //     res.write(docs);
    //     res.end();
    // });
    console.log("config.question");
    let config = require('./static/question.json');
    console.log(config.question);
    let docs = JSON.stringify(config);
    console.log(docs);
    res.write(docs);
    res.end();
});