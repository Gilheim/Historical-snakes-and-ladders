const gridButton = document.querySelector(".test");
gridButton.addEventListener("click", fetchGrid);
gridButton.name = "Blank Grid"

const body = document.querySelector("body")

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

const displayGrid = (grid) => {
    const table = document.createElement("table")
    body.appendChild(table)
    for(i=7;i>= 0;i--){
        let row = document.createElement("tr")
        row.id = "row " + i.toString()
        table.appendChild(row)
    }
    for(i = grid.grid.length - 1 ; i >= 0; i--){
        let td = document.createElement("td")
        td.textContent = grid.grid[i].index + 1
        let rowNumber = Math.floor(i/8)
        if(rowNumber%2 == 1){
            document.getElementById("row " + rowNumber).append(td)
        } else {
            document.getElementById("row " + rowNumber).prepend(td)
        }
        
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
      currentSquare: 1,
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

    //add dedicated image to board piece div
    const boardPieceImage = document.createElement("img");
    boardPieceImage.src = `./assets/images/board-pieces/${playerId}.svg`;
    boardPieceImage.alt = `player ${i + 1}'s board piece`;
    playerDiv.appendChild(boardPieceImage);

    playerDiv.classList.add("board-piece");

    boardGrid.appendChild(playerDiv);

    movePiece(playerId, "square-1");
  }
};

createPlayerHTMLElements();

const gameStatusDiv = document.getElementById("game-status");
const updateGameStatus = () => {
  //clear div first if any content is inside
  gameStatusDiv.innerHTML = "";

  const playerContainers = [];
  for (let playerObj of players) {
    
    const playerContainer = document.createElement('div');
    const nameContainer = document.createElement('div');

    //add dedicated image to name div
    const boardPieceImage = document.createElement("img");
    boardPieceImage.src = `./assets/images/board-pieces/${playerObj.id}.svg`;
    boardPieceImage.alt = `${playerObj.id}'s board piece symbol`;

    nameContainer.appendChild(boardPieceImage);

    const nameDiv = document.createElement('h2');
    nameDiv.textContent = playerObj.name;

    nameContainer.appendChild(nameDiv);

    playerContainer.appendChild(nameContainer);

    const currentSquareDiv = document.createElement('div');
    currentSquareDiv.textContent = playerObj.currentSquare;

    playerContainer.appendChild(currentSquareDiv);

    playerContainers.push(playerContainer);
  }

  playerContainers.forEach((playerContainer) => gameStatusDiv.appendChild(playerContainer));

  const gamePromptDiv = document.createElement("div");
  const gameMessage = `It's ${players[currentPlayer].name}" turn to throw now`;
  gamePromptDiv.textContent = gameMessage;

  gameStatusDiv.appendChild(gamePromptDiv);
}

updateGameStatus();
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

  diceThrowInfo.textContent = `${players[currentPlayer].name} threw a value of ${randValue1to6}`;

  //update current players position on the grid using random value
  const playerObj = players[currentPlayer];
  playerObj.currentSquare += randValue1to6;

  // use recently updated current square of player to move player piece to the correct position on the board
  const pieceId = playerObj.id;
  const squareId = `square-${playerObj.currentSquare}`;
  // movePiece(pieceId, squareId)

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  //update the current player next to throw the dice
  currentPlayer = (currentPlayer + 1) % players.length;

  updateGameStatus();
};

diceButton.addEventListener("click", throwDice);
