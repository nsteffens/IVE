var express = require('express');
var router = express.Router();

router.get('/cms', function (req, res) {

    path.resolve('public/cms/index.html')
})

router.get('/cms/*', function(req,res){

    console.log("in");
    path.resolve('public/' + req.path);

})
module.exports = router;