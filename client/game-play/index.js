//get all dom elements involved in game logic
const gameMessageContainer = document.getElementById("game-message");
const boardGrid = document.getElementById("board-grid");
const boardNameContainer = document.getElementById("board-name");
const boardGridContainer = document.getElementById("board-grid-container");
const playerStatusTable = document.getElementById("player-status");
const diceButton = document.getElementById("dice");

/*
 * Game State Objects
 */
let boardInfo = {};
let boardName = "";
let players = [];
// a value from 0 to 3 dictating which player is next to throw
let currentPlayer = 0;

/*
 * Update game message div with a message
 */
function updateGameMessage(message) {
  //clear div first if any content is inside
  gameMessageContainer.innerHTML = "";
  const gameMessageDiv = document.createElement("div");
  gameMessageDiv.textContent = message;
  gameMessageContainer.appendChild(gameMessageDiv);
}

/*
 * Fetch grid data from server using the board name
 */
async function fetchGrid() {
  try {
    const gridData = await fetch(`http://localhost:3000/grids/${boardName}`);

    const data = await gridData.json();
    //remove all board info objects with out question data
    data.grid = data.grid.filter((boardInfoElem) => boardInfoElem.question);
    boardInfo = data;
  } catch (e) {
    console.log(e);
  }
}

/*
 * Initialise player data object array and board name and then run the fetch grid function
 */
function createPlayersAndBoard() {
  const formQueryString = window.location.search;
  const formValues = [...new URLSearchParams(formQueryString).values()];

  //get board name from form values
  boardName = formValues.shift();
  const playerNames = formValues;

  //remove white spaces and player name values that are empty
  const playersPlaying = playerNames.map((name) => name.trim()).filter(Boolean);

  for (let name of playersPlaying) {
    //player object format
    const playerObj = {
      name,
      currentSquare: 1,
      id: null,
    };
    players.push(playerObj);
  }

  fetchGrid();
}

/*
 * Take the id of a player piece and a square and places piece centered within table cell square
 */
function movePiece(pieceId, squareId) {
  // id of the div representing a player playing
  const pieceElem = document.getElementById(pieceId);
  // id of the div representing a square within the board
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
}

/*
 * Create player piece html elements and add them to the board
 */
async function createPlayerHTMLElements() {
  for (let i = 0; i < players.length; i++) {
    const playerId = `player${i}`;
    const playerObj = players[i];

    playerObj.id = playerId;
    const playerDiv = document.createElement("div");
    playerDiv.id = playerId;
    playerDiv.classList.add("board-piece");

    //add dedicated image to board piece div
    const boardPieceImage = document.createElement("img");
    boardPieceImage.src = `./../assets/images/board-pieces/${playerId}.png`;
    boardPieceImage.alt = `player ${i + 1}'s board piece`;

    playerDiv.appendChild(boardPieceImage);
    boardGridContainer.appendChild(playerDiv);

    movePiece(playerId, "square-1");
  }

  updateGameMessage(
    `"${players[currentPlayer].name}" click on the dice to throw it`
  );
}

/*
 * Update player status table
 */
function updatePlayerStatus() {
  //clear table first if any content is inside
  playerStatusTable.innerHTML = `
    <tr>
        <td>Piece</td>
        <td>Name</td>
        <td>Square</td>
    </tr>
  `;

  const playerRows = [];
  for (let playerObj of players) {
    //create row and table data elements
    const playerRow = document.createElement("tr");

    const pieceImageCell = document.createElement("td");
    const nameCell = document.createElement("td");
    const currentSquareCell = document.createElement("td");

    //add dedicated image to cell
    const boardPieceImage = document.createElement("img");
    boardPieceImage.src = `./../assets/images/board-pieces/${playerObj.id}.png`;
    boardPieceImage.alt = `${playerObj.name}'s board piece image`;
    pieceImageCell.appendChild(boardPieceImage);
    playerRow.appendChild(pieceImageCell);

    //add player name
    nameCell.textContent = playerObj.name;
    playerRow.appendChild(nameCell);

    //add player current square
    currentSquareCell.textContent = playerObj.currentSquare;
    playerRow.appendChild(currentSquareCell);

    playerRows.push(playerRow);
  }
  playerStatusTable.append(...playerRows);
}

async function displayGrid() {
  let imageURLs = null;
  try {
    const resp = await fetch(
      `https://pixabay.com/api/?key=37050288-77d40d58eba88db2fc7e995ef&q=historical&image_type=photo&per_page=64`
    );
    const imageInfoArr = (await resp.json()).hits;
    imageURLs = imageInfoArr.map((imageInfo) => imageInfo["previewURL"]);
  } catch (error) {
    console.log(error);
  }

  let cellCount = 1;
  for (let i = 0; i < 8; i++) {
    const gridRow = document.createElement("tr");
    for (let j = 0; j < 8; j++) {
      const cell = document.createElement("td");
      if (imageURLs)
        cell.style.backgroundImage = `linear-gradient(rgba(255,252,201, 0.7),rgba(255,252,201, 0.7)), url('${
          imageURLs[cellCount - 1]
        }')`;
      cell.innerHTML = `<div>${cellCount}</div>`;
      cell.id = "square-" + cellCount++;
      gridRow.appendChild(cell);
    }
    if (i % 2) gridRow.append(...Array.from(gridRow.childNodes).reverse());
    boardGrid.appendChild(gridRow);
  }
  createPlayersAndBoard();
  createPlayerHTMLElements();
  updatePlayerStatus();
  boardNameContainer.textContent = boardName;
}

displayGrid();

async function throwDice() {
  const randValue1to6 = Math.ceil(Math.random() * 6);

  diceButton.classList.add("dice-throw");
  diceButton.disabled = true;

  //create dice image element
  const image = document.createElement("img");
  image.src = `./../assets/images/dice/${randValue1to6}.svg`;
  image.alt = `value of ${randValue1to6} on die`;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  //change dice image mid-throw
  diceButton.innerHTML = "";
  diceButton.appendChild(image);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  diceButton.classList.remove("dice-throw");

  //update current players position on the grid using random value
  const playerObj = players[currentPlayer];
  playerObj.currentSquare += randValue1to6;
  if (playerObj.currentSquare > 64) playerObj.currentSquare = 64;
  updateGameMessage(
    `${players[currentPlayer].name} threw a value of ${randValue1to6}`
  );

  // use recently updated current square of player to move player piece to the correct position on the board
  const pieceId = playerObj.id;
  const squareId = `square-${playerObj.currentSquare}`;
  movePiece(pieceId, squareId);

  await new Promise((resolve) => setTimeout(resolve, 2500));

  checkAndLoadQuestion();
  updatePlayerStatus();
}

diceButton.addEventListener("click", throwDice);

function checkAndLoadQuestion() {
  const playerObj = players[currentPlayer];
  const playerCurrentSquare = playerObj.currentSquare;
  const boardInfoElems = boardInfo.grid;

  const boardInfoElem = boardInfoElems.find(
    (boardInfoElem) => boardInfoElem.index === playerCurrentSquare - 1
  );

  if (!boardInfoElem) {
    //update the current player next to throw the dice
    currentPlayer = (currentPlayer + 1) % players.length;
    updateGameMessage(
      `It's ${players[currentPlayer].name}'s turn to throw now`
    );
    diceButton.disabled = false;
    console.log(currentPlayer);
    return;
  }

  const questionObj = boardInfoElem.question;
  createQuestionPopUp(questionObj);
}

const pageBody = document.body;

function createQuestionPopUp(questionObj) {
  const backdrop = document.createElement("div");
  backdrop.id = "question-backdrop";

  const questionOuterContainer = document.createElement("main");
  questionOuterContainer.id = "question-outer-container";

  const questionInnerContainer = document.createElement("div");
  questionInnerContainer.id = "question-inner-container";

  questionOuterContainer.append(questionInnerContainer);
  backdrop.append(questionOuterContainer);

  const question = document.createElement("div");
  question.id = "question";
  question.innerHTML = `<h1>${questionObj.question}</h1>`;
  questionInnerContainer.appendChild(question);

  const answersContainer = document.createElement("div");
  answersContainer.id = "answers-container";

  answersContainer.addEventListener("click", async (e) => {
    checkAnswer(e, questionObj);
  });

  for (let answer of questionObj.answers) {
    const questionAnswer = document.createElement("button");
    questionAnswer.id = "answer-button";
    questionAnswer.textContent = answer;
    answersContainer.appendChild(questionAnswer);
  }

  questionInnerContainer.appendChild(answersContainer);

  const questionInfo = document.createElement("table");
  questionInfo.id = "question-info";
  questionInfo.innerHTML = `
    <tr>
        <th>Reward</th>
        <th>Penalty</th>
    </tr>
    <tr>
        <td>Move Forward ${questionObj.reward} Square${
    questionObj.reward > 1 ? "s" : ""
  }</td>
        <td>Move Backward ${questionObj.penalty} Square${
    questionObj.penalty > 1 ? "s" : ""
  }</td>
    </tr>
  `;

  questionInnerContainer.appendChild(questionInfo);

  pageBody.appendChild(backdrop);
}

async function checkAnswer(event, questionObj) {
  const button = event.target;
  if (button.tagName !== "BUTTON") return;

  const answerValue = button.innerHTML;
  const answerIndex = questionObj.answers.findIndex(
    (answer) => answer === answerValue
  );

  const answersContainer = button.parentElement;
  const allAnswers = Array.from(answersContainer.children);
  allAnswers.forEach((answer, index) => {
    answer.style.borderColor =
      index == questionObj.correctAnswerIndex ? "green" : "red";
    answer.disabled = true;
  });

  const playerObj = players[currentPlayer];

  if (answerIndex == questionObj.correctAnswerIndex) {
    const reward = questionObj.reward;
    playerObj.currentSquare += reward;
    if (playerObj.currentSquare > 64) playerObj.currentSquare = 64;
    updateGameMessage(
      `${players[currentPlayer].name}'s answer was correct. ${
        players[currentPlayer].name
      } progresses by ${reward} square${reward > 1 ? "s" : ""}`
    );
  } else {
    const penalty = questionObj.penalty;
    playerObj.currentSquare -= penalty;
    if (playerObj.currentSquare < 1) playerObj.currentSquare = 1;
    updateGameMessage(
      `${players[currentPlayer].name}'s answer was incorrect. ${
        players[currentPlayer].name
      } regresses by ${penalty} square${penalty > 1 ? "s" : ""}`
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  //remove question prompt from screen
  document.getElementById("question-backdrop").remove();

  const pieceId = playerObj.id;
  const squareId = `square-${playerObj.currentSquare}`;
  movePiece(pieceId, squareId);

  await new Promise((resolve) => setTimeout(resolve, 2500));

  //update the current player next to throw the dice
  currentPlayer = (currentPlayer + 1) % players.length;

  updatePlayerStatus();
  updateGameMessage(`It's ${players[currentPlayer].name}'s turn to throw now`);

  checkForWinner();
  diceButton.disabled = false;
}

async function checkForWinner() {
  const player = players[currentPlayer];
  if (player.currentSquare >= 64) {
    updateGameMessage(`${player.name} has won ${boardName}`);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    window.location.href = "/client/game-setup.html";
  }
}
