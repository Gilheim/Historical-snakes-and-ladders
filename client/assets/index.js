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
    console.log(grid.grid.length)
    for(i=0; i< grid.grid.length; i++){
        const button = document.createElement("button")
        button.textContent = grid.grid[i].index + 1
        body.appendChild(button)
        
    }
    
}