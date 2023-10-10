const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const logger = require("./logger");
const app = express();
const grids = require("./grids.json");

app.use(cors());

app.use(express.json());
app.use(logger);

class GridSquare {
  constructor(index, question) {
    this.index = index;
    this.question = question;
  }
}

class Grid {
  constructor(name, grid) {
    this.name = name;
    this.grid = grid;
  }
}

const createGrid = (gridName) => {
  let gridSquares = [];
  for (i = 0; i < 64; i++) {
    let square = new GridSquare(i, null);
    gridSquares.push(square);
  }
  let grid = new Grid(gridName, gridSquares);
  grids.push(JSON.stringify(grid));
};

//createGrid("Blank Grid")

app.get("/grids/names", (req, res) => {
  let gridNames = [];
  for (i = 0; i < grids.length; i++) {
    gridNames.push(grids[i].name);
  }
  res.send(gridNames);
});

app.get("/grids/:id", (req, res) => {
  const gridName = req.params.id.toLowerCase();
  const grid = grids.find((element) => element.name.toLowerCase() == gridName);
  if (grid != undefined) {
    res.send(grid);
  } else {
    res.status(404).send();
  }
});

app.post("/grids", (req, res) => {
  const newGrid = req.body;
  grids.push(newGrid);
  res.status(201).send(newGrid);
});

app.get("/random", async (req, res) => {
  const triviaArr = [];
  try {
    for (let i = 0; i < 2; i++) {
      const resp = await fetch(
        `https://opentdb.com/api.php?amount=50&category=23&type=multiple`
      );
      triviaArr.push(...(await resp.json()).results);
    }
  } catch (error) {
    console.log(error);
  }

  const reconfiguredArr = [];
  for (let i = 0; i < triviaArr.length; i++) {
    const triviaObj = triviaArr[i];
    let question = triviaObj.question;
    let answers = triviaObj.incorrect_answers;
    let correctAnswer = triviaObj.correct_answer;
    answers.push(correctAnswer);
    answers.sort(() => Math.random() - 0.5);

    let correctAnswerIndex = 0;
    for (let j = 0; j < 4; j++) {
      if (answers[j] === correctAnswer) {
        correctAnswerIndex = j;
      } else {
        correctAnswerIndex = correctAnswerIndex;
      }
    }

    let reward = Math.ceil(Math.random() * 6);
    let penalty = Math.ceil(Math.random() * 6);

    reconfiguredArr.push({
      question,
      answers,
      correctAnswerIndex,
      reward,
      penalty,
    });
  }

  const boardData = {
    name: "random",
    grid: reconfiguredArr.slice(0,64),
  };

  if (reconfiguredArr.length) {
    res.send(boardData);
  } else {
    res.status(404).send();
  }
});

module.exports = app;
