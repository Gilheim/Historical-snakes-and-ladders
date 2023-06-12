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

  // updateBoard()
};

diceButton.addEventListener("click", throwDice);
