var express = require('express')
var router = express.Router()

/* GET home page. */
router.all('/', function (_req, res) {
	res.render('index', { title: 'Smart Shopping App' })
})

module.exports = router
