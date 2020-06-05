const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Store = require("../models/store");
var authenticate = require("../middleware/authenticate");

const storeRouter = express.Router();

storeRouter.use(bodyParser.json());

storeRouter
    .route("/")
    .get((req, res, next) => {
        Store.find({})
            .populate("shelf")
            .then(
                (stores) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(stores);
                },
                (err) => next(err),
            )
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Store.create(req.body)
            .then(
                (store) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(store);
                },
                (err) => next(err),
            )
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /stores");
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Store.remove({})
            .then(
                (resp) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(resp);
                },
                (err) => next(err),
            )
            .catch((err) => next(err));
    });

storeRouter
    .route("/:storeId")
    .get((req, res, next) => {
        Store.find({ barcode: req.params.storeId})
            .populate("shelf")
            .then(
                (store) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(store);
                },
                (err) => next(err),
            )
            .catch((err) => next(err));
    })
    .post( authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /stores/" + req.params.storeId);
    })
    .put( authenticate.verifyAdmin, (req, res, next) => {
        Store.findByIdAndUpdate(
            req.params.storeId,
            {
                $set: req.body,
            },
            { new: true },
        )
            .then(
                (store) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(store);
                },
                (err) => next(err),
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyAdmin, (req, res, next) => {
        Store.findByIdAndRemove(req.params.storeId)
            .then(
                (resp) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(resp);
                },
                (err) => next(err),
            )
            .catch((err) => next(err));
    });

module.exports = storeRouter;
