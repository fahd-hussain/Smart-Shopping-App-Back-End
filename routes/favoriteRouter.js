const express = require('express')
const bodyParser = require('body-parser')

const Favorites = require('../models/favorites')
var authenticate = require('../middleware/authenticate')

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

favoriteRouter
	.route('/')
	.get(authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id })
			.populate('user')
			.populate('promotion')
			.then(
				(favorites) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(favorites)
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.post(authenticate.verifyUser, (req, res, next) => {
		console.log(req.body._id)
		Favorites.findOne({ user: req.user._id })
			.populate('user')
			.populate('promotion')
			.then(
				(favorite) => {
					if (favorite) {
						if (favorite.promotion.indexOf(req.body._id) === -1) {
							favorite.promotion.push(req.body._id)
							// console.log(favorite.promotion);
						}
						favorite.save().then(
							(favorite) => {
								console.log('Favorite Created ', favorite)
								res.statusCode = 200
								res.setHeader(
									'Content-Type',
									'application/json'
								)
								res.json(favorite)
							},
							(err) => next(err)
						)
					} else {
						Favorites.create({
							user: req.user._id,
							promotion: req.body,
						}).then(
							(favorite) => {
								console.log('Favorite is Created ', favorite)
								res.statusCode = 200
								res.setHeader(
									'Content-Type',
									'application/json'
								)
								res.json(favorite)
							},
							(err) => next(err)
						)
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.put(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403
		res.end('PUT operation not supported on /favorites')
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		Favorites.findOneAndRemove({ user: req.user._id })
			.populate('user')
			.populate('promotion')
			.then(
				(resp) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(resp)
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})

favoriteRouter
	.route('/:promoId')
	.get(authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id })
			.populate('user')
			.populate('promotion')
			.then(
				(favorites) => {
					if (!favorites) {
						res.statusCode = 200
						res.setHeader('Content-Type', 'application/json')
						return res.json({ exists: false, favorites: favorites })
					} else {
						if (
							favorites.promotion.indexOf(req.params.promoId) < 0
						) {
							res.statusCode = 200
							res.setHeader('Content-Type', 'application/json')
							return res.json({
								exists: false,
								favorites: favorites,
							})
						} else {
							res.statusCode = 200
							res.setHeader('Content-Type', 'application/json')
							return res.json({
								exists: true,
								favorites: favorites,
							})
						}
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.post(authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id })
			.populate('user')
			.populate('promotion')
			.then(
				(favorite) => {
					if (favorite) {
						if (
							favorite.promotion.indexOf(req.params.promoId) ===
							-1
						) {
							favorite.promotion.push(req.params.promoId)
							favorite.save().then(
								(favorite) => {
									console.log('Favorite Created ', favorite)
									res.statusCode = 200
									res.setHeader(
										'Content-Type',
										'application/json'
									)
									res.json(favorite)
								},
								(err) => next(err)
							)
						}
					} else {
						Favorites.create({
							user: req.user._id,
							promotion: [req.params.promoId],
						}).then(
							(favorite) => {
								console.log('Favorite Created ', favorite)
								res.statusCode = 200
								res.setHeader(
									'Content-Type',
									'application/json'
								)
								res.json(favorite)
							},
							(err) => next(err)
						)
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.put(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403
		res.end(
			'PUT operation not supported on /favorites/' + req.params.promoId
		)
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id })
			.populate('user')
			.populate('promotion')
			.then(
				(favorite) => {
					if (favorite) {
						const isFound = (element) =>
							String(element._id) === req.params.promoId

						const index = favorite.promotion.findIndex(isFound)
						if (index >= 0) {
							favorite.promotion.splice(index, 1)
							favorite.save().then(
								(favorite) => {
									Favorites.findById(favorite._id)
										.populate('user')
										.populate('promotion')
										.then((favorite) => {
											console.log(
												'Favorite Promotion Deleted!',
												favorite
											)
											res.statusCode = 200
											res.setHeader(
												'Content-Type',
												'application/json'
											)
											res.json(favorite)
										})
								},
								(err) => next(err)
							)
						} else {
							const err = new Error(
								'Promotion ' + req.params.promoId + ' not found'
							)
							err.status = 404
							return next(err)
						}
					} else {
						const err = new Error('Favorites not found')
						err.status = 404
						return next(err)
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})

module.exports = favoriteRouter
