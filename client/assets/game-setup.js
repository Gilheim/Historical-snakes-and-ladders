window.onload = () => {
    loadBoardOptions()
}




async function loadBoardOptions() {
    try {
        const gridData = await fetch(`http://localhost:3000/grids/names`)
        if (gridData.ok) {
            const data = await gridData.json()
            let boardMenu = document.querySelector(".boards")
            for(i = 1; i < data.length; i++){
                let boardButton = document.createElement("button")
                boardButton.textContent = data[i]
                boardMenu.appendChild(boardButton)

            }
            const buttons = document.querySelectorAll('.boards button');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    buttons.forEach(btn => btn.classList.remove('clicked'));
                    button.classList.add('clicked');
                });
            });
        } else {
            throw "Something went wrong with the API request"
        }
    } catch(e) {
        console.log(e)
    }
}