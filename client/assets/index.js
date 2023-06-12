let players = [];

const createPlayers = () => {
  const formQueryString = window.location.search;
  const playerNames = [...new URLSearchParams(formQueryString).values()];

  const playersPlaying = playerNames.map((name) => name.trim()).filter(Boolean);

  console.log(playersPlaying);
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

console.log(players);
