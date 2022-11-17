const express = require('express')
const bodyParser = require('body-parser')
// const fs = require('fs')

// Local Imports
const authenticate = require('../middleware/authenticate')
// const Lists = require('../models/list')
// const Store = require('../models/store')
// const Map = require('./functions/shortestPath')

const shortestPathRouter = express.Router()

shortestPathRouter.use(bodyParser.json())

shortestPathRouter
	.route('/:listId')
	// .get((req, response, next) => {
	// 	const MAP = new Map(800, 600, req.params.listId)
	// 	let map = []
	// 	MAP._shelvesFromDatabase().then(() => {
	// 		// MAP._drawShelves();
	// 		map = MAP._plotShelvesOnGraph()
	// 		Lists.findById(req.params.listId)
	// 			.populate('author')
	// 			.then(
	// 				(list) => {
	// 					const itemNames = []
	// 					list.listItems.map((item) =>
	// 						itemNames.push(item.itemName)
	// 					)
	// 					Store.find({ name: { $in: itemNames } })
	// 						.populate('shelf')
	// 						.then((res) => {
	// 							let temp = []
	// 							res.map((ele) => {
	// 								if (!ele) {
	// 									/* empty */
	// 								} else {
	// 									temp.push({
	// 										name: ele.name,
	// 										shelf: ele.shelf.name,
	// 									})
	// 								}
	// 							})
	// 							if (temp.length == 0 && map.length == 0) {
	// 								console.log('Empty')
	// 							} else {
	// 								const shortestPath = MAP._findShortestPath(
	// 									map,
	// 									temp
	// 								)
	// 								MAP._drawShelves()
	// 								MAP._drawLine(shortestPath).then(() => {
	// 									fs.readFile(
	// 										`${__dirname}/functions/public/images/img${req.params.listId}.png`,
	// 										(err, content) => {
	// 											if (err) {
	// 												response.statusCode = 400
	// 												response.setHeader(
	// 													'Content-Type',
	// 													'application/json'
	// 												)
	// 												response.json(err)
	// 											} else {
	// 												response.statusCode = 200
	// 												response.setHeader(
	// 													'Content-type',
	// 													'image/png'
	// 												)
	// 												response.end(content)
	// 											}
	// 										}
	// 									)
	// 								})
	// 							}
	// 						})
	// 				},
	// 				(err) => next(err)
	// 			)
	// 			.catch((err) => next(err))
	// 	})
	// })
	.post(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403
		res.end(
			'POST operation not supported on /shortestPaths/' +
				req.params.shortestPathId
		)
	})
	.put(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403
		res.end(
			'PUT operation not supported on /shortestPaths/' +
				req.params.shortestPathId
		)
	})
	.delete(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403
		res.end(
			'DELETE operation not supported on /shortestPaths/' +
				req.params.shortestPathId
		)
	})

module.exports = shortestPathRouter
