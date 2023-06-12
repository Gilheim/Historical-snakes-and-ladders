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

app.get('/grids/:id', (req, res) => {
    const gridName = req.params.id.toLowerCase()
    const grid = grids.find((element) => element.name.toLowerCase() == gridName)
    if (grid != undefined) {
        res.send(grid)
    } else {
        res.status(404).send()
    }
})





module.exports = app