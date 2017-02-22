var express = require('express');
var router = express.Router();

// To have access to all multipart/
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({uploadDir: '/media/ive_data/videos/tmp'});

var path = require('path');

var fs = require('fs');

router.post('/cms/videos/upload', multipartyMiddleware, function (req, res) {
    console.log('upload-endpoint');

    // == File
    console.log(req.files);

    // == Name
    console.log(req.files.file.name);


    // .. move file somewhere then..
    res.sendStatus(200);
})

router.get('/cms', function (req, res) {
    path.resolve('public/cms/index.html')
})




module.exports = router;