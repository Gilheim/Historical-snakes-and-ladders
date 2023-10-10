window.onload = () => {
  let realGridName = window.location.hash.substr(1) || "blank grid";
  fullEditForm(realGridName);
  createDropdownMenu();
};

const main = document.querySelector("main");

const editSquare = document.getElementsByName("squaretoedit")[0];

let realGrid;
async function fullEditForm(name) {
  fetchGrid(name);
  realGrid = await fetchGridData(name);

  const changeSquareColour = () => {
    const editSquare = document.getElementsByName("squaretoedit")[0];
    let squareIndex = parseInt(editSquare.value);
    if (editSquare.value == "") {
      for (i = 0; i < 64; i++) {
        let newSquare = document.querySelector(`#square-${i+1}`);
        if (realGrid.grid[i].question == null) {
          newSquare.className = "empty-square";
        } else {
          newSquare.className = "square-question";
        }
      }
    } else if (Number.isNaN(squareIndex) === false) {
      let realIndex = squareIndex;
      let square = document.querySelector(`#square-${realIndex}`);
      square.className = "edit-square";
      if (realGrid.grid[realIndex].question != null) {
        document.querySelector("#question-form").question.value =
          realGrid.grid[realIndex].question.question;
        document.querySelector("#question-form").answer1.value =
          realGrid.grid[realIndex].question.answers[0];
        document.querySelector("#question-form").answer2.value =
          realGrid.grid[realIndex].question.answers[1];
        document.querySelector("#question-form").answer3.value =
          realGrid.grid[realIndex].question.answers[2];
        document.querySelector("#question-form").answer4.value =
          realGrid.grid[realIndex].question.answers[3];
        let idx = realGrid.grid[realIndex].question.correctAnswerIndex;
        document.querySelector("#question-form").correctAnswer.value =
          realGrid.grid[realIndex].question.answers[idx];
        document.querySelector("#question-form").reward.value =
          realGrid.grid[realIndex].question.reward;
        document.querySelector("#question-form").penalty.value =
          realGrid.grid[realIndex].question.penalty;
      } else {
        document.querySelector("#question-form").question.value = "";
        document.querySelector("#question-form").answer1.value = "";
        document.querySelector("#question-form").answer2.value = "";
        document.querySelector("#question-form").answer3.value = "";
        document.querySelector("#question-form").answer4.value = "";
        document.querySelector("#question-form").correctAnswer.value = "";
        document.querySelector("#question-form").penalty.value = "";
        document.querySelector("#question-form").reward.value = "";
      }
      const allSquares = document.querySelectorAll("td");
      for (const square of allSquares) {
        const squareVal = +square.id.split("-")[1];
        if (realGrid.grid[squareVal - 1].question == null) {
          square.className = "empty-square";
        } else {
          square.className = "square-question";
        }
      }
    }
  };

  const createQuestion = (e) => {
    e.preventDefault();
    let questionText = e.target.question.value;
    let answers = [
      e.target.answer1.value,
      e.target.answer2.value,
      e.target.answer3.value,
      e.target.answer4.value,
    ];
    let correctAnswer = e.target.correctAnswer.value;
    let correctAnswerIndex = null;
    let squareNumberIndex = parseInt(e.target.squaretoedit.value) - 1;
    let rewardNumber = parseInt(e.target.reward.value);
    let penaltyNumber = parseInt(e.target.penalty.value);
    try {
      for (let i = 0; i < 4; i++) {
        if (correctAnswer === answers[i]) {
          correctAnswerIndex = i;
        }
      }
      if (correctAnswerIndex != null) {
        let question = new Question(
          questionText,
          answers,
          correctAnswerIndex,
          rewardNumber,
          penaltyNumber
        );
        for (let i = 0; i < realGrid.grid.length; i++) {
          if (squareNumberIndex === i) {
            realGrid.grid[i].question = question;
          }
        }
        questionForm.question.value = "";
        questionForm.answer1.value = "";
        questionForm.answer2.value = "";
        questionForm.answer3.value = "";
        questionForm.answer4.value = "";
        questionForm.correctAnswer.value = "";
        questionForm.squaretoedit.value = "";
        questionForm.penalty.value = "";
        questionForm.reward.value = "";
        changeSquareColour();
        alert("Question added");
      } else {
        throw "Error: One of the answers must match the correct answer";
      }
    } catch (e) {
      console.log(e)
      alert(e);
    }
  };

  function resetQuestion() {
    const squareNumInput =
      document.querySelector("#question-form").squaretoedit;
    const editSquareVal = squareNumInput.value;
    const editSquare = document.querySelector(`#square-${editSquareVal}`);

    realGrid.grid[editSquareVal - 1].question = null;
    editSquare.className = "empty-square";
  }

  async function createNewGrid() {
    const boardNameInput = document.querySelector("#board-name");
    if (!boardNameInput.value) {
      alert("Give your board a name before you can create a new board")
      return
    }

    const data = {
      name: boardNameInput.value,
      grid: realGrid.grid,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      "https://historical-snakes-and-ladders-api.onrender.com/grids",
      options
    );

    if (response.status == 201) {
      boardNameInput.value = "";
      alert("Grid added.");
      location.reload();
    }
  }

  const questionForm = document.querySelector("#question-form");
  questionForm.addEventListener("submit", createQuestion);
  questionForm.addEventListener("reset", resetQuestion);

  const saveButton = document.querySelector("#save-grid");
  saveButton.addEventListener("click", createNewGrid);

  const makeAGrid = () => {
    editSquare.value = "";
    generateRandomGrid();
  };

  const resetGrid = (e) => {
    if (!confirm("You're about to reset the grid")) return;
    for (let i = 0; i < 64; i++) {
      let newSquare = document.querySelector(`#square-${i+1}`);
      if (newSquare.className == "square-question") {
        realGrid.grid[i].question = null;
        newSquare.className = "empty-square";
      }
    }
  };

  const randomNumberNotUsed = () => {
    let arrNumbers = whichSquaresEmpty(realGrid, []);
    let randomIndex = Math.floor(Math.random() * arrNumbers.length);
    let randomNumber = arrNumbers[randomIndex];
    if (realGrid.grid[randomNumber].question == null) {
      return randomNumber;
    } else {
      return randomNumberNotUsed();
    }
  };

  const whichSquaresEmpty = (grid, arr) => {
    for (let i = 0; i < 64; i++) {
      if (grid.grid[i].question == null) {
        arr.push(i);
      }
    }
    return arr;
  };

  const checkEverySquare = () => {
    let filled = true;
    for (let i = 0; i < 64; i++) {
      if (realGrid.grid[i].question == null) {
        filled = false;
      }
    }
    return filled;
  };

  let randomGridButton = document.querySelector("#random-grid-generator");
  randomGridButton.addEventListener("click", makeAGrid);

  let resetGridButton = document.querySelector("#reset-grid");
  resetGridButton.addEventListener("click", resetGrid);

  async function generateRandomGrid() {
    if (!checkEverySquare()) {
      let numOfQuestions = Math.floor(Math.random() * 41) + 10;
      const questions = await fetch(
        `https://opentdb.com/api.php?amount=${numOfQuestions}&category=23&type=multiple`
      );
      if (questions.ok) {
        const questionData = await questions.json();
        for (let i = 0; i < questionData.results.length; i++) {
          let question = questionData.results[i].question;
          let answers = questionData.results[i].incorrect_answers;
          let correctAnswer = questionData.results[i].correct_answer;
          answers.push(correctAnswer);
          answers.sort();
          let correctAnswerIndex = -1;
          for (let j = 0; j < 4; j++) {
            if (answers[j] === correctAnswer) {
              correctAnswerIndex = j;
            }
          }
          if (correctAnswerIndex != -1) {
            let reward = Math.floor(Math.random() * 5) + 1;
            let penalty = Math.floor(Math.random() * 5) + 1;
            let actualQuestion = new Question(
              question,
              answers,
              correctAnswerIndex,
              reward,
              penalty
            );
            let randomNumber = randomNumberNotUsed();
            realGrid.grid[randomNumber].question = actualQuestion;
            changeSquareColour();
          }
        }
      }
    } else {
      alert("Grid is full!");
    }
  }

  // async function questionGenerator(arr) {
  //     if (!checkEverySquare()){
  //         const questions = await fetch('https://the-trivia-api.com/v2/questions')
  //         if (questions.ok){
  //             const questionData = await questions.json()

  //             const makeQuestionArray = (arr) => {
  //                 for(i=0; i< questionData.length; i++) {
  //                     if(questionData[i].category === "history"){
  //                         let question = questionData[i].question.text
  //                         let answers = questionData[i].incorrectAnswers
  //                         let correctAnswer = questionData[i].correctAnswer
  //                         answers.push(correctAnswer)
  //                         answers.sort()
  //                         let correctAnswerIndex = 0
  //                         for(j=0; j<4; j++){
  //                             if (answers[j] === correctAnswer){
  //                                 correctAnswerIndex = j
  //                             } else {
  //                                 correctAnswerIndex = correctAnswerIndex
  //                             }
  //                         }
  //                         let reward = Math.floor(Math.random()*5) + 1
  //                         let penalty = Math.floor(Math.random()*5) + 1
  //                         let actualQuestion = new Question(question,answers,correctAnswerIndex,reward,penalty)
  //                         arr.push(actualQuestion)
  //                         let randomNumber = randomNumberNotUsed()
  //                         realGrid.grid[randomNumber].question = actualQuestion
  //                         changeSquareColour()

  //                     } else {

  //                     }
  //                 }
  //                 if(arr.length < 48){
  //                     questionGenerator(arr)
  //                 }
  //             }
  //             makeQuestionArray(arr)
  //         }
  //     } else {

  //     }

  // }
}

async function fetchGrid(name) {
  try {
    const gridData = await fetch(
      `https://historical-snakes-and-ladders-api.onrender.com/grids/${name}`
    );
    if (gridData.ok) {
      const data = await gridData.json();
      displayGrid(data);
    } else {
      throw "Something went wrong with the API request";
    }
  } catch (e) {
    console.log(e);
  }
}

async function fetchGridData(name) {
  try {
    const gridData = await fetch(
      `https://historical-snakes-and-ladders-api.onrender.com/grids/${name}`
    );
    if (gridData.ok) {
      const data = await gridData.json();
      return data;
    } else {
      throw "Something went wrong with the API request";
    }
  } catch (e) {
    console.log(e);
  }
}

function fillInputsForSquareNum(squareNum) {
  const index = squareNum - 1;
  const alreadyHasData = !!realGrid.grid[index].question;
  if (alreadyHasData) {
    document.querySelector("#question-form").question.value =
      realGrid.grid[index].question.question;
    document.querySelector("#question-form").answer1.value =
      realGrid.grid[index].question.answers[0];
    document.querySelector("#question-form").answer2.value =
      realGrid.grid[index].question.answers[1];
    document.querySelector("#question-form").answer3.value =
      realGrid.grid[index].question.answers[2];
    document.querySelector("#question-form").answer4.value =
      realGrid.grid[index].question.answers[3];
    let idx = realGrid.grid[index].question.correctAnswerIndex;
    document.querySelector("#question-form").correctAnswer.value =
      realGrid.grid[index].question.answers[idx];
    document.querySelector("#question-form").reward.value =
      realGrid.grid[index].question.reward;
    document.querySelector("#question-form").penalty.value =
      realGrid.grid[index].question.penalty;
  }
}

function formatSquareBeingModified(e) {
  e.preventDefault();
  const squareNumInput = document.querySelector("#question-form").squaretoedit;
  const allSquares = document.querySelectorAll("td");

  const squareNumValue = squareNumInput.value;
  for (const square of allSquares) {
    const squareNum = square.id.split("-")[1];

    square.style.borderColor =
      +squareNum === +squareNumValue ? "goldenrod" : "#362419";
  }

  fillInputsForSquareNum(squareNumValue);
}
document
  .querySelector("#question-form")
  .squaretoedit.addEventListener("change", formatSquareBeingModified);

function changeSquareBeingModified(e) {
  e.preventDefault();
  const squareElem = e.target;
  const clickedSquareNum = squareElem.id.split("-")[1];
  const squareNumInput = document.querySelector("#question-form").squaretoedit;
  squareNumInput.value = clickedSquareNum;
}

const boardContainer = document.getElementById("board-grid-container");

function displayGrid(grid) {
  const table = document.createElement("table");
  boardContainer.appendChild(table);
  for (i = 7; i >= 0; i--) {
    let row = document.createElement("tr");
    row.id = "row-" + i.toString();
    table.appendChild(row);
  }
  for (i = grid.grid.length - 1; i >= 0; i--) {
    let td = document.createElement("td");
    td.innerHTML = `<div>${grid.grid[i].index + 1}</div>`;
    td.id = "square-" + (grid.grid[i].index + 1);
    td.addEventListener("click", changeSquareBeingModified);
    td.addEventListener("click", formatSquareBeingModified);
    if (grid.grid[i].question != null) {
      td.classList.add("square-question");
    } else {
      td.classList.add("empty-square");
    }
    let rowNumber = Math.floor(i / 8);
    if (rowNumber % 2 == 1) {
      document.getElementById("row-" + rowNumber).append(td);
    } else {
      document.getElementById("row-" + rowNumber).prepend(td);
    }
  }
}

class Question {
  constructor(question, answers, correctAnswerIndex, reward, penalty) {
    (this.question = question),
      (this.answers = answers),
      (this.correctAnswerIndex = correctAnswerIndex);
    this.reward = reward;
    this.penalty = penalty;
  }
}

const dropdownMenu = document.getElementById("board-select");
dropdownMenu.addEventListener("change", (e) => {
  e.preventDefault();
  window.location.hash = e.target.value;
  location.reload();
});

async function createDropdownMenu() {
  try {
    const gridData = await fetch(
      `https://historical-snakes-and-ladders-api.onrender.com/grids/names`
    );
    if (gridData.ok) {
      const boardNames = await gridData.json();
      const currentBoard = window.location.hash.slice(1).replace("%20", " ");

      for (const name of boardNames) {
        let option = document.createElement("option");
        option.value = name;
        option.innerHTML = name;
        if (currentBoard == name) {
          option.selected = true;
        }
        dropdownMenu.appendChild(option);
      }
    } else {
      throw "Something went wrong with the API request";
    }
  } catch (e) {
    console.log(e);
  }
}

const mainMenuButton = document.querySelector("#main-menu");
mainMenuButton.addEventListener("click", () => window.location = "index.html");

