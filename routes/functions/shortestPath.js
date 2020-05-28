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

    _shelvesFromDatabase = () => {
        let promiseArray = [];

        promiseArray.push(
            new Promise((res, rej) => {
                shelves
                    .find({})
                    .populate("neighbors.neighbor")
                    .then((res) => {
                        // console.log(res)
                        res.map((item) => {
                            this.Shelf.push({
                                name: item.name,
                                row: item.row,
                                column: item.column,
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
        // console.log(this.Shelf)
        let map = {};
        this.Shelf.map((item) => {
            // console.log(item)
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
        // console.log(list)
        const sortedList = this._sorting(list);
        // console.log(sortedList)
        const path = [];
        let i = 0;
        for (i = 0; i < sortedList.length - 1; i++) {
            path.push(route.path(sortedList[i].shelf, sortedList[i + 1].shelf));
        }
        // console.log(path)
        return path;
    };

    _drawLine = (path) => {
        const graph = [];
        path.map((item) => {
            item.map((item2) => {
                graph.push(this.Shelf.filter((shelf) => shelf.name === item2));
            });
        });
        let i = 0;
        for (i = 0; i < graph.length - 1; i++) {
            const x1 = graph[i][0].row;
            const y1 = graph[i][0].column;
            const x2 = graph[i + 1][0].row;
            const y2 = graph[i + 1][0].column;
            this.rc.line(x1 * 100, y1 * 100, x2 * 100, y2 * 100, {
                strokeWidth: 4,
                roughness: 0,
                stroke: "#dc3545",
            });
        }

        this._outPut(this.image);
    };

    _outPut = (image) => {
        let promiseArray = [];

        promiseArray.push(
            new Promise((resolve, reject) => {
                PImage.encodePNGToStream(image, fs.createWriteStream(`${__dirname}/public/images/img${this._id}.png`))
                    .then(() => {
                        console.log(`wrote out the png file to ${this._id}.png`);
                    })
                    .catch((e) => {
                        console.log("there was an error writing");
                    });

                setTimeout(() => {
                    resolve();
                }, 1000);
            }),
        );

        return Promise.all(promiseArray)
    };
};
