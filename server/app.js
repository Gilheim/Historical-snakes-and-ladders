const express = require('express');
const cors = require('cors');
const logger = require("./logger");
const app = express();
const grids = require("./grids.json")

app.use(cors())

app.use(express.json())
app.use(logger);

class GridSquare {
    constructor(index, question) {
        this.index = index 
        this.question = question
    }
}

class Grid {
    constructor(name, grid){
        this.name = name 
        this.grid = grid
    }
}

const createGrid = (gridName) => {
    let gridSquares = []
    for(i=0; i<64; i++){
        let square = new GridSquare(i,null)
        gridSquares.push(square)
    }
    let grid = new Grid(gridName, gridSquares)
    grids.push(JSON.stringify(grid))
}

//createGrid("Blank Grid")

app.get('/grids/names', (req,res) => {
    let gridNames = []
    for(i=0;i<grids.length;i++){
        gridNames.push(grids[i].name)
    }
    res.send(gridNames)
})

app.get('/grids/:id', (req, res) => {
    const gridName = req.params.id.toLowerCase()
    const grid = grids.find((element) => element.name.toLowerCase() == gridName)
    if (grid != undefined) {
        res.send(grid)
    } else {
        res.status(404).send()
    }
})

app.post("/grids", (req, res) => {
    const newGrid = req.body
    grids.push(newGrid)
    res.status(201).send(newGrid);
})





module.exports = app