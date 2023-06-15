window.onload = () => {
    loadBoardOptions()
}

async function loadBoardOptions() {
    try {
        const gridData = await fetch(`http://localhost:3000/grids/names`)
        if (gridData.ok) {
            const data = await gridData.json()
            let boardMenu = document.querySelector(".boards")
            for (i = 1; i < data.length; i++){
                const optionContainer = document.createElement("div");
                optionContainer.id = "board-option";

                let boardButton = document.createElement("input")
                boardButton.type = "radio"
                boardButton.name = "board-name";
                boardButton.value = data[i]
                boardButton.checked = true;
                boardButton.labels = data[i];
                optionContainer.appendChild(boardButton)

                let boardName = document.createElement("label");
                boardName.for = data[i];
                boardName.innerHTML = data[i];

                optionContainer.appendChild(boardName);

                boardMenu.appendChild(optionContainer);
            }
        }
    } catch(e) {
        console.log(e)
    }
}
