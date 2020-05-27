const express = require("express");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

// Local Imports
const authenticate = require("../middleware/authenticate");
const Lists = require("../models/list");
const Store = require("../models/store");

const listRouter = express.Router();

listRouter.use(bodyParser.json());

listRouter
    .route("/")
    .get(authenticate.verifyUser, (req, res, next) => {
        if (req.user != null)
            Lists.find({ author: req.user._id })
                .populate("author")
                .then(
                    (lists) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(lists);
                    },
                    (err) => next(err),
                )
                .catch((err) => next(err));
        else {
            err = new Error("Unauthorized");
            err.status = 403;
            return next(err);
        }
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        if (req.body != null) {
            req.body.author = req.user._id;
            const itemsFromUser = [];
            req.body.listItems.map((ele) => itemsFromUser.push(ele.itemName));
            let data = {};
            Store.find({ name: { $in: itemsFromUser } }, (err, docs) => {
                let temp = [];
                docs.map((ele) => {
                    if (!ele) {
                    } else {
                        temp.push({ itemName: ele.name, shelf: ele.shelf });
                    }
                });
                data = { name: req.body.name, listItems: temp, author: req.body.author };
                console.log(data)
                if (Object.entries(data).length == 0) {
                    console.log("Empty");
                } else {
                    Lists.create(data)
                        .then(
                            (list) => {
                                Lists.findById(list._id)
                                    .populate("author")
                                    .then((list) => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(list);
                                    });
                            },
                            (err) => next(err),
                        )
                        .catch((err) => next(err));
                }
            });
        } else {
            err = new Error("List not found in request body");
            err.status = 404;
            return next(err);
        }
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /lists/");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Lists.remove({})
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

listRouter
    .route("/:listId")
    .get((req, res, next) => {
        Lists.findById(req.params.listId)
            .populate("author")
            .then(
                (list) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(list);
                },
                (err) => next(err),
            )
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /lists/" + req.params.listId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Lists.findById(req.params.listId)
            .then(
                (list) => {
                    if (list != null) {
                        if (!list.author.equals(req.user._id)) {
                            var err = new Error("You are not authorized to update this list!");
                            err.status = 403;
                            return next(err);
                        }
                        req.body.author = req.user._id;
                        Lists.findByIdAndUpdate(
                            req.params.listId,
                            {
                                $set: req.body,
                            },
                            { new: true },
                        ).then(
                            (list) => {
                                Lists.findById(list._id)
                                    .populate("author")
                                    .then((list) => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(list);
                                    });
                            },
                            (err) => next(err),
                        );
                    } else {
                        err = new Error("List " + req.params.listId + " not found");
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err),
            )
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Lists.findById(req.params.listId)
            .then(
                (list) => {
                    if (list != null) {
                        if (!list.author.equals(req.user._id)) {
                            var err = new Error("You are not authorized to delete this list!");
                            err.status = 403;
                            return next(err);
                        }
                        Lists.findByIdAndRemove(req.params.listId)
                            .then(
                                (resp) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(resp);
                                },
                                (err) => next(err),
                            )
                            .catch((err) => next(err));
                    } else {
                        err = new Error("List " + req.params.listId + " not found");
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err),
            )
            .catch((err) => next(err));
    });

module.exports = listRouter;
