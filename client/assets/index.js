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