const boardGrid = document.getElementById("board-grid");

// async function fetchGrid() {
//     try {
//         const gridData = await fetch(`http://localhost:3000/grids/${gridButton.name}`)
//         if (gridData.ok) {
//             const data = await gridData.json()
//             displayGrid(data)
//         } else {
//             throw "Something went wrong with the API request"
//         }
//     } catch(e) {
//         console.log(e)
//     }
// }

const displayGrid = () => {
  let cellCount = 1;
  for (let i = 0; i < 8; i++) {
    const gridRow = document.createElement("tr");
    for (let j = 0; j < 8; j++) {
      const cell = document.createElement("td");
      cell.id = "square-" + cellCount++;
      gridRow.appendChild(cell);
    }
    if (i % 2) gridRow.append(...Array.from(gridRow.childNodes).reverse());
    boardGrid.appendChild(gridRow);
  }
};

displayGrid();

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

    boardGrid.appendChild(playerDiv);

    movePiece(playerId, "square-1");

    playerDiv.classList.add("board-piece");
  }
};

createPlayerHTMLElements();

const playerStatusTable = document.getElementById("player-status");

const updatePlayerStatus = () => {
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
    const playerRow = document.createElement("tr");

    const pieceImageCell = document.createElement("td");
    const nameCell = document.createElement("td");
    const currentSquareCell = document.createElement("td");

    //add dedicated image to name div
    const boardPieceImage = document.createElement("img");
    boardPieceImage.src = `./assets/images/board-pieces/${playerObj.id}.svg`;
    boardPieceImage.alt = `${playerObj.name}'s board piece image`;
    pieceImageCell.appendChild(boardPieceImage);
    playerRow.appendChild(pieceImageCell);

    nameCell.textContent = playerObj.name;
    playerRow.appendChild(nameCell);

    currentSquareCell.textContent = playerObj.currentSquare;
    playerRow.appendChild(currentSquareCell);

    playerRows.push(playerRow);
  }
  playerStatusTable.append(...playerRows);
};

updatePlayerStatus();

const gameMessageContainer = document.getElementById("game-message");

const updateGameMessage = (message) => {
  //clear div first if any content is inside
  gameMessageContainer.innerHTML = "";
  const gameMessageDiv = document.createElement("div");
  gameMessageDiv.textContent = message;
  gameMessageContainer.appendChild(gameMessageDiv);
};

updateGameMessage();

const diceButton = document.getElementById("dice");

const throwDice = async () => {
  const randValue1to6 = Math.ceil(Math.random() * 6);

  diceButton.classList.add("dice-throw");
  diceButton.disabled = true;

  //create dice image element
  const image = document.createElement("img");
  image.src = `./assets/images/dice/${randValue1to6}.svg`;
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

  updateGameMessage(`${players[currentPlayer].name} threw a value of ${randValue1to6}`);

  // use recently updated current square of player to move player piece to the correct position on the board
  const pieceId = playerObj.id;
  const squareId = `square-${playerObj.currentSquare}`;
  movePiece(pieceId, squareId)

  await new Promise((resolve) => setTimeout(resolve, 3000));

  //update the current player next to throw the dice
  currentPlayer = (currentPlayer + 1) % players.length;

  updatePlayerStatus();
  updateGameMessage(`It's ${players[currentPlayer].name}'s turn to throw now`);

  diceButton.disabled = false;
};

diceButton.addEventListener("click", throwDice);
