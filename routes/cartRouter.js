const express = require('express')
const bodyParser = require('body-parser')
// const mongoose = require("mongoose");

// Local Imports
const authenticate = require('../middleware/authenticate')
const Carts = require('../models/cart')

const cartRouter = express.Router()

cartRouter.use(bodyParser.json())

cartRouter
	.route('/')
	.get(authenticate.verifyUser, (req, res, next) => {
		if (req.user != null)
			Carts.find({ author: req.user._id })
				.populate('author')
				.populate('cartItems.product')
				.then(
					(carts) => {
						res.statusCode = 200
						res.setHeader('Content-Type', 'application/json')
						res.json(carts)
					},
					(err) => next(err)
				)
				.catch((err) => next(err))
		else {
			const err = new Error('Unauthorized')
			err.status = 403
			return next(err)
		}
	})
	.post(authenticate.verifyUser, (req, res, next) => {
		if (req.body != null) {
			req.body.author = req.user._id
			Carts.create(req.body)
				.then(
					(cart) => {
						Carts.findById(cart._id)
							.populate('author')
							.populate('product')
							.then((cart) => {
								res.statusCode = 200
								res.setHeader('Content-Type', 'application/json')
								res.json(cart)
							})
					},
					(err) => next(err)
				)
				.catch((err) => next(err))
		} else {
			const err = new Error('Cart not found in request body')
			err.status = 404
			return next(err)
		}
	})
	.put(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403
		res.end('PUT operation not supported on /carts/')
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		Carts.remove({})
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

cartRouter
	.route('/:cartId')
	.get(authenticate.verifyUser, (req, res, next) => {
		Carts.findById(req.params.cartId)
			.populate('author')
			.populate('product')
			.then(
				(cart) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(cart)
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.post(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403
		res.end('POST operation not supported on /carts/' + req.params.cartId)
	})
	.put(authenticate.verifyUser, (req, res, next) => {
		Carts.findById(req.params.cartId)
			.then(
				(cart) => {
					if (cart != null) {
						if (!cart.author.equals(req.user._id)) {
							var err = new Error('You are not authorized to update this cart!')
							err.status = 403
							return next(err)
						}
						req.body.author = req.user._id
						Carts.findByIdAndUpdate(
							req.params.cartId,
							{
								$set: req.body,
							},
							{ new: true }
						).then(
							(cart) => {
								Carts.findById(cart._id)
									.populate('author')
									.populate('product')
									.then((cart) => {
										res.statusCode = 200
										res.setHeader('Content-Type', 'application/json')
										res.json(cart)
									})
							},
							(err) => next(err)
						)
					} else {
						err = new Error('Cart ' + req.params.cartId + ' not found')
						err.status = 404
						return next(err)
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		Carts.findById(req.params.cartId)
			.then(
				(cart) => {
					if (cart != null) {
						if (!cart.author.equals(req.user._id)) {
							var err = new Error('You are not authorized to delete this cart!')
							err.status = 403
							return next(err)
						}
						Carts.findByIdAndRemove(req.params.cartId)
							.then(
								(resp) => {
									res.statusCode = 200
									res.setHeader('Content-Type', 'application/json')
									res.json(resp)
								},
								(err) => next(err)
							)
							.catch((err) => next(err))
					} else {
						err = new Error('Cart ' + req.params.cartId + ' not found')
						err.status = 404
						return next(err)
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	})

module.exports = cartRouter
