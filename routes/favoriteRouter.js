const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

var authenticate = require('../middleware/authenticate')
const Favorites = require('../models/favorites')

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('promotion')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            for (var i=0; i<req.body.length; i++) {
                if (favorite.promotion.indexOf(req.body[i]._id) === -1) {
                    favorite.promotion.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('promotion')
                .then( favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            }, (err) => next(err)); 
        }
        else {
            for (var i=0; i<req.body.length; i++) {
                if (favorite.promotion.indexOf(req.body[i]._id) === -1) {
                    favorite.promotion.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('promotion')
                .then( favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));   
});
////////////////////////////////////////////////////////////////////////////////////////////////////
favoriteRouter.route('/:dishId')
.get(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({ user: req.user._id })
    .then( favorites => {
        if ( !favorites ){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            return res.json({'exists': false, 'favorites': favorites})
        } else {
            if ( favorites.promotion.indexOf( req.params.dishId ) < 0 ){
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                return res.json({'exists': false, 'favorites': favorites})
            } else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                return res.json({'exists': true, 'favorites': favorites})
            }
        }
    }, error => next(error))
    .catch( error => {
        next(error)
    })
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            if (favorite.promotion.indexOf(req.params.dishId) === -1) {
                favorite.promotion.push({ "_id": req.params.dishId });
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('promotion')
                    .then( favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                }, (err) => next(err))
            }
        }
        else {
            Favorites.create({"user": req.user._id, "promotion": [req.params.dishId]})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            index = favorite.promotion.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.promotion.splice(index, 1);
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('promotion')
                    .then( favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});
////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = favoriteRouter;