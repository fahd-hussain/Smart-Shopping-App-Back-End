const express = require('express')
const bodyParser = require('body-parser')

const shelves = require('../models/shelf')
var authenticate = require('../middleware/authenticate')

const shelfRouter = express.Router()

shelfRouter.use(bodyParser.json())

shelfRouter
	.route('/')
	.get((_req, res, next) => {
		shelves
			.find({})
			.populate('neighbors.neighbor')
			.then(
				(shelves) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(shelves)
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		shelves
			.create(req.body)
			.then(
				(shelf) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(shelf)
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		res.statusCode = 403
		res.end('PUT operation not supported on /shelves')
	})
	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			shelves
				.remove({})
				.then(
					(resp) => {
						res.statusCode = 200
						res.setHeader('Content-Type', 'application/json')
						res.json(resp)
					},
					(err) => next(err)
				)
				.catch((err) => next(err))
		}
	)

shelfRouter
	.route('/:shelfId')
	.get((req, res, next) => {
		shelves
			.findById(req.params.shelfId)
			.then(
				(shelf) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(shelf)
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		res.statusCode = 403
		res.end('POST operation not supported on /shelves/' + req.params.shelfId)
	})
	.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		shelves
			.findByIdAndUpdate(
				req.params.shelfId,
				{
					$set: req.body,
				},
				{ new: true }
			)
			.then(
				(shelf) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(shelf)
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			shelves
				.findByIdAndRemove(req.params.shelfId)
				.then(
					(resp) => {
						res.statusCode = 200
						res.setHeader('Content-Type', 'application/json')
						res.json(resp)
					},
					(err) => next(err)
				)
				.catch((err) => next(err))
		}
	)

module.exports = shelfRouter
