window.onload = () => {
  loadBoardOptions();
};

document.getElementById("main-menu").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href='index.html';
});
document.getElementById("edit-page").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = 'edit-pages.html';
});

async function loadBoardOptions() {
  try {
    const gridData = await fetch(
      `https://historical-snakes-and-ladders-api.onrender.com/grids/names`
    );
    if (gridData.ok) {
      const data = await gridData.json();
      data.push("Random History Trivia");
      let boardMenu = document.querySelector("#boards");
      for (i = 1; i < data.length; i++) {
        const optionContainer = document.createElement("div");
        optionContainer.className = "board-option";

        let boardButton = document.createElement("input");
        boardButton.type = "radio";
        boardButton.name = "board-name";
        boardButton.value = data[i];
        boardButton.checked = true;
        boardButton.labels = data[i];
        optionContainer.appendChild(boardButton);

        let boardName = document.createElement("label");
        boardName.for = data[i];
        boardName.innerHTML = data[i];

        optionContainer.appendChild(boardName);

        boardMenu.appendChild(optionContainer);
      }
    }
  } catch (e) {
    console.log(e);
  }
}
