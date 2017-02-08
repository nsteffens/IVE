var express = require('express');
var router = express.Router();

router.get('/cms', function (req, res) {

    path.resolve('public/cms/index.html')
})

module.exports = router;