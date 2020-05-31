const rough = require("roughjs");
const PImage = require("pureimage");
const fs = require("fs");
const Graph = require("node-dijkstra");
const shelves = require("../../models/shelf");

module.exports = class Map {
    constructor(x, y, _id) {
        this.image = PImage.make(x, y);
        this.rc = rough.canvas(this.image);
        this.rc.rectangle(0, 0, x, y, {
            fill: "#28a745",
            fillStyle: "solid",
            roughness: 0,
        });
        this.Shelf = [];
        this._id = _id;
    }

    _drawShelves = () => {
        this.rc.rectangle(20, 0, 80, 40, {
            fill: "#54B0F3",
            fillStyle: "solid",
            bowing: 2,
            strokeWidth: 2,
            stroke: "#38101C",
            roughness: 1,
        });
        this.rc.rectangle(400, 0, 80, 40, {
            fill: "#dc3545",
            fillStyle: "solid",
            bowing: 2,
            strokeWidth: 2,
            stroke: "#38101C",
            roughness: 1,
        });
        let i;
        for (i = 0; i < this.Shelf.length; i++) {
            let r1 = (this.Shelf[i].row - 1) * 100;
            let c1 = this.Shelf[i].column * 100;
            if (this.Shelf[i].isCorner === 0) {
                this.rc.rectangle(r1 + 20, c1, 60, 100, {
                    fill: "#70483C",
                    fillStyle: "solid",
                    bowing: 2,
                    strokeWidth: 2,
                    stroke: "#38101C",
                    roughness: 1,
                });
            }
            if (this.Shelf[i].isCorner === 1) {
                this.rc.rectangle(r1 + 20, c1 + 20, 60, 80, {
                    fill: "#70483C",
                    fillStyle: "solid",
                    bowing: 2,
                    strokeWidth: 2,
                    stroke: "#38101C",
                    roughness: 1,
                });
            }
            if (this.Shelf[i].isCorner === 2) {
                this.rc.rectangle(r1 + 20, c1, 60, 80, {
                    fill: "#70483C",
                    fillStyle: "solid",
                    bowing: 2,
                    strokeWidth: 2,
                    stroke: "#38101C",
                    roughness: 1,
                });
            }
        }
    };

    _shelvesFromDatabase = () => {
        let promiseArray = [];

        promiseArray.push(
            new Promise((res, rej) => {
                shelves
                    .find({})
                    .populate("neighbors.neighbor")
                    .then((res) => {
                        res.map((item) => {
                            this.Shelf.push({
                                name: item.name,
                                row: item.row,
                                column: item.column,
                                isCorner: item.isCorner,
                                neighbors: item.neighbors,
                            });
                        });
                    })
                    .catch((error) => console.log(error));

                setTimeout(() => {
                    res();
                }, 1000);
            }),
        );

        return Promise.all(promiseArray);
    };

    _plotShelvesOnGraph = () => {
        let map = {};
        this.Shelf.map((item) => {
            let temp = {};
            item.neighbors.map((item2) => {
                temp[item2.neighbor.name] = 1;
                map[item.name] = temp;
            });
        });
        return map;
    };

    _sorting = (list) => {
        var byShelf = list.slice(0);
        byShelf.sort((a, b) => {
            var x = a.shelf.toLowerCase();
            var y = b.shelf.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });

        return byShelf;
    };

    _findShortestPath = (map, list) => {
        const route = new Graph(map);
        const sortedList = this._sorting(list);
        const path = [];
        let i = 0;
        for (i = 0; i < sortedList.length - 1; i++) {
            path.push(route.path(sortedList[i].shelf, sortedList[i + 1].shelf));
        }
        return path;
    };

    _drawLine = (path) => {
        const graph = [];
        let j;
        let lastPoint;
        graph.push(this.Shelf.filter((shelf) => shelf.name === "A000"));
        for (j = 0; j < path.length; j++) {
            if (path[j] !== null) {
                path[j].map((item2) => {
                    graph.push(this.Shelf.filter((shelf) => shelf.name === item2));
                    lastPoint = item2;
                });
            }
        }
        graph.push(this.Shelf.filter((shelf) => shelf.name === lastPoint[0] + 1));
        graph.push(this.Shelf.filter((shelf) => shelf.name === "Z999"));
        let i;
        const points = [];
        for (i = 0; i < graph.length; i++) {
            let r1 = graph[i][0].row * 100;
            let c1 = graph[i][0].column * 100;

            let point = [];
            if (graph[i][0].isCorner === 2) {
                c1 += 100;
            }
            this.rc.circle(r1, c1, 10, {
                fill: "#38101C",
                fillStyle: "solid",
                roughness: 0,
            });
            point.push(r1, c1);
            points.push(point);
        }
        this.rc.linearPath(points, {
            stroke: "#dc3545",
            strokeWidth: 4,
            roughness: 0,
        });
        let promiseArray = [];

        promiseArray.push(
            new Promise((resolve, reject) => {
                this._outPut(this.image);

                setTimeout(() => {
                    resolve();
                }, 1000);
            }),
        );

        return Promise.all(promiseArray);
    };

    _outPut = (image) => {
        PImage.encodePNGToStream(image, fs.createWriteStream(`${__dirname}/public/images/img${this._id}.png`))
            .then(() => {
                console.log(`wrote out the png file to ${this._id}.png`);
            })
            .catch((e) => {
                console.log("there was an error writing");
            });
    };
};
