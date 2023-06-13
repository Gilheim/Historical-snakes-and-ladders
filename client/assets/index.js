const gridButton = document.querySelector(".test");
gridButton.addEventListener("click", fullEditForm);
gridButton.name = "Blank Grid"

const section = document.querySelector("section")

async function fullEditForm() {
    fetchGrid()
    let realGrid = await fetchGridData()

    async function changeSquareColour() {
        let squareIndex = parseInt(editSquare.value)
        if(editSquare.value == ""){
            for(i=0; i<64; i++) {
                let newSquare = document.querySelector(`#square-${i}`)
                if(newSquare.className == "edit-square"){
                    if(realGrid.grid[i].question == null) {
                        newSquare.className = "empty-square"
                    } else {
                        newSquare.className = "square-question"
                    }               
                }
            }
        } else if(Number.isNaN(squareIndex) === false) {
            let realIndex = squareIndex - 1
            let square = document.querySelector(`#square-${realIndex}`)
            square.className = "edit-square"
            if(realGrid.grid[realIndex].question != null){
                document.querySelector("#questionform").question.value = realGrid.grid[realIndex].question.question
                document.querySelector("#questionform").answer1.value = realGrid.grid[realIndex].question.answers[0]
                document.querySelector("#questionform").answer2.value = realGrid.grid[realIndex].question.answers[1]
                document.querySelector("#questionform").answer3.value = realGrid.grid[realIndex].question.answers[2]
                document.querySelector("#questionform").answer4.value = realGrid.grid[realIndex].question.answers[3]
                let idx = realGrid.grid[realIndex].question.correctAnswerIndex
                document.querySelector("#questionform").correctAnswer.value = realGrid.grid[realIndex].question.answers[idx]
                document.querySelector("#questionform").reward.value = realGrid.grid[realIndex].question.reward
                document.querySelector("#questionform").penalty.value = realGrid.grid[realIndex].question.penalty   
            } else {
                document.querySelector("#questionform").question.value = ""
                document.querySelector("#questionform").answer1.value = ""
                document.querySelector("#questionform").answer2.value = ""
                document.querySelector("#questionform").answer3.value = ""
                document.querySelector("#questionform").answer4.value = ""
                document.querySelector("#questionform").correctAnswer.value = ""
                document.querySelector("#questionform").penalty.value = ""
                document.querySelector("#questionform").reward.value = ""
            }
            for(i=0; i<64; i++) {
                let newSquare = document.querySelector(`#square-${i}`)
                if(newSquare.className == "edit-square" && i != realIndex){
                    if(realGrid.grid[i].question == null) {
                        newSquare.className = "empty-square"
                    } else {
                        newSquare.className = "square-question"
                    }               
                }
            }
        } else {

        }
    }
    
    const createQuestion = (e) => {
    
        e.preventDefault()
        let questionText = e.target.question.value
        let answers = [e.target.answer1.value,e.target.answer2.value,e.target.answer3.value,e.target.answer4.value ]
        let correctAnswer = e.target.correctAnswer.value
        let correctAnswerIndex = null
        let squareNumberIndex = parseInt(e.target.squaretoedit.value) - 1
        let rewardNumber = parseInt(e.target.reward.value)
        let penaltyNumber = parseInt(e.target.penalty.value)
        try {
            for(i=0; i<4; i++){
                if (correctAnswer === answers[i]){
                    correctAnswerIndex = i
                }
            }
            if(correctAnswerIndex != null) {
                let question = new Question(questionText, answers, correctAnswerIndex, rewardNumber, penaltyNumber)
                for(i = 0; i< realGrid.grid.length; i++) {
                    if(squareNumberIndex === i){
                        realGrid.grid[i].question = question
                        console.log(realGrid)
                    }
                }
                e.target.question.value = ""
                e.target.answer1.value = ""
                e.target.answer2.value = ""
                e.target.answer3.value = ""
                e.target.answer4.value = ""
                e.target.correctAnswer.value = ""
                e.target.squaretoedit.value = ""
                e.target.penalty.value = ""
                e.target.reward.value = ""
                changeSquareColour()
                alert("Question added")
                
            } else {
                throw "Error: One of the answers must match the correct answer"
            }
        } catch (f) {
            alert(f)
        }
    
    }

    const resetQuestion = () => {
        for(i=0; i<64; i++) {
            let newSquare = document.querySelector(`#square-${i}`)
            if(newSquare.className == "edit-square"){  
                realGrid.grid[i].question = null
                newSquare.className = "empty-square"  
            }
        }
    }

    async function createNewGrid(e) {
        e.preventDefault()

        const data = {
            name: e.target.boardname.value.toLowerCase(),
            grid: realGrid.grid
        }
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        const response = await fetch("http://localhost:3000/grids", options);

        if (response.status == 201) {
            e.target.boardname.value = ''
            alert("Grid added.")
        }


    }
   
    const questionForm = document.querySelector("#questionform")
    questionForm.addEventListener("submit", createQuestion)
    questionForm.addEventListener("reset", resetQuestion)

    const gridForm = document.querySelector("#gridform")
    gridForm.addEventListener("submit", createNewGrid)

    let editSquare = document.getElementsByName("squaretoedit")[0]
    editSquare.addEventListener("keyup", changeSquareColour)
    
}

async function fetchGrid() {
    try {
        const gridData = await fetch(`http://localhost:3000/grids/${gridButton.name}`)
        if (gridData.ok) {
            const data = await gridData.json()
            displayGrid(data)
        } else {
            throw "Something went wrong with the API request"
        }
    } catch(e) {
        console.log(e)
    }
}

async function fetchGridData() {
    try {
        const gridData = await fetch(`http://localhost:3000/grids/${gridButton.name}`)
        if (gridData.ok) {
            const data = await gridData.json()
            return data
        } else {
            throw "Something went wrong with the API request"
        }
    } catch(e) {
        console.log(e)
    }
}

const displayGrid = (grid) => {
    const table = document.createElement("table")
    section.appendChild(table)
    for(i=7;i>= 0;i--){
        let row = document.createElement("tr")
        row.id = "row-" + i.toString()
        table.appendChild(row)
    }
    for(i = grid.grid.length - 1 ; i >= 0; i--){
        let td = document.createElement("td")
        td.textContent = grid.grid[i].index + 1
        td.id = "square-" + grid.grid[i].index
        if(grid.grid[i].question != null) {
            td.classList.add("square-question")
        } else {
            td.classList.add("empty-square")
        }
        let rowNumber = Math.floor(i/8)
            if(rowNumber%2 == 1){
                document.getElementById("row-" + rowNumber).append(td)
            } else {
                document.getElementById("row-" + rowNumber).prepend(td)
            }
    } 
}







class Question {
    constructor (question, answers, correctAnswerIndex, reward, penalty) {
        this.question = question,
        this.answers = answers,
        this.correctAnswerIndex = correctAnswerIndex
        this.reward = reward
        this.penalty = penalty
    }
}













let players = [];
// a value from 0 to 3 dictating which player is next to throw
let currentPlayer = 0;

const createPlayers = () => {
  const formQueryString = window.location.search;
  const playerNames = [...new URLSearchParams(formQueryString).values()];

  //remove white spaces and player name values that are empty
  const playersPlaying = playerNames.map((name) => name.trim()).filter(Boolean);

  for (let name of playersPlaying) {
    //player object format
    const playerObj = {
      name,
      currentSquare: 0,
    };
    players.push(playerObj);
  }
};

createPlayers();

const boardGrid = document.getElementById("board-grid");

/**
 * Takes the id of a player piece and a square and places piece centered within square
 *
 * @param {string} pieceId - id of the div representing a player playing
 * @param {string} squareElem - id of the div representing a square within the board
 */
const movePiece = (pieceId, squareId) => {
  const pieceElem = document.getElementById(pieceId);
  const squareElem = document.getElementById(squareId);

  const squareCenterPosInGrid = {};
  squareCenterPosInGrid.xPos =
    squareElem.offsetLeft + squareElem.offsetWidth / 2;
  squareCenterPosInGrid.yPos =
    squareElem.offsetTop + squareElem.offsetHeight / 2;

  pieceElem.style.left =
    squareCenterPosInGrid.xPos - pieceElem.offsetWidth / 2 + "px";
  pieceElem.style.top =
    squareCenterPosInGrid.yPos - pieceElem.offsetHeight / 2 + "px";
};

const createPlayerHTMLElements = () => {
  for (let i = 0; i < players.length; i++) {
    const playerId = `player${i}`;
    const playerObj = players[i];

    playerObj.id = playerId;
    const playerDiv = document.createElement("div");
    playerDiv.id = playerId;

    playerDiv.classList.add("board-piece");

    boardGrid.appendChild(playerDiv);

    movePiece(playerId, "square-1");
  }
};

createPlayerHTMLElements();

// console.log(players);

const diceButton = document.getElementById("dice");
const diceThrowInfo = document.getElementById("dice-throw-info");

const throwDice = async () => {
  const randValue1to6 = Math.ceil(Math.random() * 6);

  diceButton.classList.add("dice-throw");
  diceButton.disabled = true;
  diceThrowInfo.dataset.thrown = true;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  //change dice image mid-throw
  diceButton.innerHTML = "";
  const image = document.createElement("img");
  image.src = `./assets/images/dice/${randValue1to6}.svg`;
  image.alt = `value of ${randValue1to6} on die`;
  diceButton.appendChild(image);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  diceButton.classList.remove("dice-throw");
  diceButton.disabled = false;
  diceThrowInfo.dataset.thrown = false;

  diceThrowInfo.textContent = `"${players[currentPlayer].name}" threw a value of ${randValue1to6}`;

  //update current players position on the grid using random value
  const playerObj = players[currentPlayer];
  playerObj.currentSquare += randValue1to6;

  // use recently updated current square of player to move player piece to the correct position on the board
  const pieceId = playerObj.id;
  const squareId = `square-${playerObj.currentSquare}`;
  movePiece(pieceId, squareId)

  //update the current player next to throw the dice
  currentPlayer = (currentPlayer + 1) % players.length;
};

diceButton.addEventListener("click", throwDice);