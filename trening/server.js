// Подключение расширений
const path = require('path');
const express = require('express');
const formidable = require('formidable');
const sharp = require('sharp');
const fs = require('fs');
const mongoose = require('mongoose'); // !!!!! BD
// var http = require('http');

/////////////////////////////////////////////// Обьявления
const port = 8000;
const arrExtension = ['.jpg', '.jpeg', '.png'];
const app = express();

// Подключение express статики
app.use(express.static('static'));

// Привязка к порту 8000
app.listen(port, function () {
    console.log("Server running at http://127.0.0.1:" + port + "/");
});

/////////////////////////////////////////////// Подключение статичного сайта 
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/task.html');
});

////////////////////////// mongoosedb

mongoose.connect('mongodb://127.0.0.1:/DB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let DB = mongoose.connection;

DB.on('error', console.error.bind(console, 'connection error:'));

DB.once('open', function () {
    console.log('connection YES:');
    console.log("we're connected to DB!");

    let UserSchema = new mongoose.Schema({
        login: String,
        pass: String,
        name: String,
        dob: String,
        avatar: String,
        _images: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'imagesUsers'
        }]
    });

    let ImagesSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'registeredUsers'
        },
        author: String,
        path: String,
        date: String,
        period: Number,
        // comment: [String]
        comment: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'commentSchema'
        }],
    });

    let CommentSchema = new mongoose.Schema({
        for_img: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'imagesUsers'
        },
        status: String,
        appurtenance: String,
        authorComment: String,
        comment: String
    });

    const collectionsArray = [UserSchema, ImagesSchema, CommentSchema];

    collectionsArray.forEach(function (collection) {
        collection.methods.getId = function () {
            var thisId = this._id
            return JSON.stringify(thisId);
        }
    });

    let registeredUsers = mongoose.model('registeredUsers', UserSchema, 'users');
    let imagesUsers = mongoose.model('imagesUsers', ImagesSchema, 'images');
    let commentSchema = mongoose.model('commentSchema', CommentSchema);

    module.exports = {
        registeredUsers,
        imagesUsers,
        commentSchema
    }

    app.post('/createnewuser', function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields) {
            if (err) throw err;
            let newUser = new registeredUsers(JSON.parse(fields.newUser));
            new Promise(function (resolve, reject) {
                registeredUsers.find({
                    login: newUser.login
                }, function (err, docs) {
                    if (err) console.log(err);
                    if (docs.length > 0) {
                        resolve({
                            status: 'error',
                            errorText: 'those login already exists'
                        });
                    } else {
                        newUser.save(function (err, newUser) {
                            if (err) reject(err);
                            resolve({
                                status: 'OK',
                                userId: newUser.getId()
                            });
                        });
                    }
                });
            }).then(function (response) {
                response = JSON.stringify(response)
                res.write(response);
                res.end();
            }).catch(function (err) {
                console.error(err);
            });
        });
    });

    app.post('/loginuser', function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields) {
            if (err) throw err;
            let loginInfo = new registeredUsers(JSON.parse(fields.loginInfo));
            registeredUsers.findOne({
                login: loginInfo.login
            }, function (err, doc) {
                if (err) console.log(err);
                if (!doc) {
                    let response = JSON.stringify({
                        status: 'error',
                        errorText: 'there is no such user, please register'
                    })
                    res.write(response);
                    res.end();
                } else {
                    if (doc.pass == loginInfo.pass) {
                        let response = JSON.stringify({
                            status: 'OK'
                        })
                        res.write(response);
                        res.end();
                    } else {
                        let response = JSON.stringify({
                            status: 'error',
                            errorText: 'password is incorrect'
                        })
                        res.write(response);
                        res.end();
                    }
                }
            });
        });
    });

    // app.route('/getuserbyid/:userId')
    // .get()
    // .post()


    app.get('/getusers', function (req, res) {
        registeredUsers.find(function (err, docs) {
            if (err) return console.error(err);
            // console.log('/getusers');
            // console.log(docs);
            docs = JSON.stringify(docs)
            res.write(docs);
            res.end();
        });
    });

    app.get('/getuserbyid/:userId', function (req, res) {
        let form = new formidable.IncomingForm();
        let userId = req.params.userId;
        registeredUsers.findOne({
                login: userId
            })
            .populate('_images').exec((err, posts) => {
                if (err) console.log(err);
                res.json(posts);
                // console.log("Populated User ");
                // console.log(posts);
            })
    });

    app.post('/updateuserinfo', function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields) {
            if (err) throw err;
            let newInfo = JSON.parse(fields.updateUser);
            let userId = fields.userId;
            registeredUsers.findOne({
                login: userId
            }, function (err, doc) {
                for (key in newInfo) {
                    doc[key] = newInfo[key];
                }
                doc.save();
                // res.write();
                res.end();
            });
        });
    });

    // Ответ сервера на POST запрос обновления аватарки
    app.post('/avatar', function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            let newName = fields.user + '-ava.' + getExtension(files.photo.name);
            let path = files.photo.path;
            let newPath = __dirname + '/static/img/ava/' + newName;
            // удалять все предыдущ авы пользователя
            arrExtension.forEach(function (extension) {
                let filePath = './static/img/ava/' + fields.user + '-ava' + extension;
                fs.stat(filePath, function (err, stat) {
                    if (err == null) {
                        console.log('File exists ' + extension);
                        fs.unlinkSync(filePath);
                    } else if (err.code === 'ENOENT') {
                        // file does not exist
                        console.log('file does not exist ' + extension + ' ' + err.code);
                    } else {
                        console.log('Some other error: ', err.code);
                    }
                });
            });
            registeredUsers.findOne({
                login: fields.user
            }, function (err, doc) {
                doc.avatar = fields.path;
                doc.save();
            });
            // загрузка и обрезка новой аватарки 
            sharp(path)
                .resize(100, 100)
                .toFile(newPath, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        res.write(newName);
                        res.end();
                    }
                });
        });
    });


    app.post('/images', function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) throw err;
            let AllnewImg = JSON.parse(fields.newImg);
            let pathArr = AllnewImg.path.split('|');
            pathArr.pop();
            // взять юзера
            // счетчик сохр картинок с проверкой кол-ва файов = end достиг кол-вa
            for (let i = 0; i < fields.length; i++) {
                let newImg = new imagesUsers(AllnewImg);
                console.log(newImg);
                let longPath = "D:\\task\\trening/static" + pathArr[i];
                imagesUsers.find({
                    path: longPath
                }, function (err, docs) {
                    if (err) console.log(err);
                    if (docs.length > 0) {
                        console.log('already exists');
                    } else {
                        //
                        let dateArr = CreateDate();
                        newImg.period = dateArr[0];
                        // fun
                        newImg.date = dateArr[1];
                        let namd = "image_" + i;
                        let newName = pathArr[i];
                        let path = files[namd].path;
                        let newPath = __dirname + '/static' + newName;
                        res.write(newName);
                        newImg.path = newPath;
                        sharp(path)
                            .resize(200, 200)
                            .toFile(newPath, function (err) {
                                if (err) {
                                    throw err;
                                }
                            });
                        newImg.getId()
                        newImg.save(function (err, newImg) {
                            if (err) console.log("save " + err);
                        });
                        if (i == fields.length - 1) {
                            res.end();
                        }
                        console.log("newImg ", newImg);
                    }
                    registeredUsers.findOne({
                        login: newImg.author
                    }, function (err, doc) {
                        doc._images.push(mongoose.Types.ObjectId(newImg._id));
                        doc.save();
                        console.log("newImg doc ", doc);
                    });
                });
            }
        });
    });

    app.get('/getAllImages', function (req, res) {
        imagesUsers.find().populate('comment').exec((err, posts) => {
            if (err) return console.error(err);
            posts = JSON.stringify(posts)
            res.write(posts);
            res.end();
        });
        // imagesUsers.findOne({
        //     comment:"123"
        // }, function (err, doc) {
        //     doc.remove();
        // });
    });

    app.get('/getimages/:userId', function (req, res) {
        let form = new formidable.IncomingForm();
        let userId = req.params.userId;
        imagesUsers.find({
            author: userId
        }, function (err, docs) {
            if (err) return console.error(err);
            docs = JSON.stringify(docs)
            //docs.remove();
            res.write(docs);
            res.end();
        });
    });

    app.post('/deleteImage', function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            imagesUsers.findOne({
                _id: fields.id
            }, function (err, doc) {
                let filePath = "." + doc.path.substring(15);
                fs.stat(filePath, function (err, stat) {
                    if (err == null) {
                        console.log('File exists ' + filePath);
                        fs.unlinkSync(filePath);
                    } else if (err.code === 'ENOENT') {
                        // file does not exist
                        console.log('file does not exist ');
                    } else {
                        console.log('Some other error: ', err.code);
                    }
                });
                console.log('delete ' + doc);
                registeredUsers.findOne({
                    login: doc.author
                }, function (err, doc) {
                    console.log("doc._images");
                    console.log(doc._images);
                    doc._images.forEach(function (element) {
                        console.log(element)
                        if (element == fields.id) {
                            doc._images.splice(doc._images.indexOf(element), 1);
                            doc.save();
                        }
                    });
                    console.log("newImg doc ", doc);
                });
                if (doc) {
                    doc.remove();
                }
            });
        });
    });

    //////////////////////////////////////////////////////////

    app.post('/addComment', function (req, res) {
        // let form = new formidable.IncomingForm();
        // form.parse(req, function (err, fields) {
        //     if (err) throw err;
        //     imagesUsers.findOne({
        //         _id: fields.id
        //     }, function (err, doc) {
        //         doc.comment.push(fields.why + "-#@$^^$@#-" + fields.comment);
        //         console.log ("comments ");
        //         console.log (doc);
        //         doc.save();
        //         res.end();
        //     });
        // });

        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields) {
            if (err) throw err;
            let newComment = new commentSchema(JSON.parse(fields.newComment));
            commentSchema.find(function (err, docs) {
                if (err) console.log(err);
                newComment.getId()
                newComment.save(function (err, newComment) {
                    if (err) console.log("save " + err);
                });
                res.end();
                console.log("newComment ");
                console.log(newComment);
                imagesUsers.findOne({
                    _id: newComment.appurtenance
                }, function (err, doc) {
                    doc.comment.push(mongoose.Types.ObjectId(newComment._id));
                    doc.save();
                    console.log("imagesUsers newComment doc ", doc);
                });
                // imagesUsers.findOne({
                //     _id: newComment.appurtenance
                // })
                // .populate('comment').exec((err, posts) => {
                //     if (err) console.log(err);
                //     // res.json(posts);
                //     console.log("Populated comment ");
                //     console.log(posts);
                // });
            });
        });
    });

    app.get('/getCommentById/:userId', function (req, res) {
        let userId = req.params.userId;
        commentSchema.find({
            appurtenance: userId
        }, function (err, doc) {
            if (err) console.log(err);
            res.json(doc);
            //res.end();
            //  doc.remove();
        });
    });
});

////////////////////////// + functions

// определение расширения файла 
function getExtension(filename) {
    let ext = path.extname(filename || '').split('.');
    return ext[ext.length - 1];
}

function CreateDate() {
    let currentdate = new Date();
    let datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + "  " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();
    let dateArr = [currentdate, datetime]
    return dateArr;
}
