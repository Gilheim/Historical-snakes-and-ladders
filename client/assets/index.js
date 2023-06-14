const gridButton = document.querySelector(".test");
gridButton.addEventListener("click", fullEditForm);
gridButton.name = "Blank Grid"

const section = document.querySelector("section")

async function fullEditForm() {
    fetchGrid()
    let realGrid = await fetchGridData()

    async function changeSquareColour() {
        let squareIndex = parseInt(editSquare.value)
        if(editSquare.value == ""){
            for(i=0; i<64; i++) {
                let newSquare = document.querySelector(`#square-${i}`)
                if(newSquare.className == "edit-square"){
                    if(realGrid.grid[i].question == null) {
                        newSquare.className = "empty-square"
                    } else {
                        newSquare.className = "square-question"
                    }               
                }
            }
        } else if(Number.isNaN(squareIndex) === false) {
            let realIndex = squareIndex - 1
            let square = document.querySelector(`#square-${realIndex}`)
            square.className = "edit-square"
            if(realGrid.grid[realIndex].question != null){
                document.querySelector("#questionform").question.value = realGrid.grid[realIndex].question.question
                document.querySelector("#questionform").answer1.value = realGrid.grid[realIndex].question.answers[0]
                document.querySelector("#questionform").answer2.value = realGrid.grid[realIndex].question.answers[1]
                document.querySelector("#questionform").answer3.value = realGrid.grid[realIndex].question.answers[2]
                document.querySelector("#questionform").answer4.value = realGrid.grid[realIndex].question.answers[3]
                let idx = realGrid.grid[realIndex].question.correctAnswerIndex
                document.querySelector("#questionform").correctAnswer.value = realGrid.grid[realIndex].question.answers[idx]
                document.querySelector("#questionform").reward.value = realGrid.grid[realIndex].question.reward
                document.querySelector("#questionform").penalty.value = realGrid.grid[realIndex].question.penalty   
            } else {
                document.querySelector("#questionform").question.value = ""
                document.querySelector("#questionform").answer1.value = ""
                document.querySelector("#questionform").answer2.value = ""
                document.querySelector("#questionform").answer3.value = ""
                document.querySelector("#questionform").answer4.value = ""
                document.querySelector("#questionform").correctAnswer.value = ""
                document.querySelector("#questionform").penalty.value = ""
                document.querySelector("#questionform").reward.value = ""
            }
            for(i=0; i<64; i++) {
                let newSquare = document.querySelector(`#square-${i}`)
                if(newSquare.className == "edit-square" && i != realIndex){
                    if(realGrid.grid[i].question == null) {
                        newSquare.className = "empty-square"
                    } else {
                        newSquare.className = "square-question"
                    }               
                }
            }
        } else {

        }
    }
    
    const createQuestion = (e) => {
    
        e.preventDefault()
        let questionText = e.target.question.value
        let answers = [e.target.answer1.value,e.target.answer2.value,e.target.answer3.value,e.target.answer4.value ]
        let correctAnswer = e.target.correctAnswer.value
        let correctAnswerIndex = null
        let squareNumberIndex = parseInt(e.target.squaretoedit.value) - 1
        let rewardNumber = parseInt(e.target.reward.value)
        let penaltyNumber = parseInt(e.target.penalty.value)
        try {
            for(i=0; i<4; i++){
                if (correctAnswer === answers[i]){
                    correctAnswerIndex = i
                }
            }
            if(correctAnswerIndex != null) {
                let question = new Question(questionText, answers, correctAnswerIndex, rewardNumber, penaltyNumber)
                for(i = 0; i< realGrid.grid.length; i++) {
                    if(squareNumberIndex === i){
                        realGrid.grid[i].question = question
                        console.log(realGrid)
                    }
                }
                e.target.question.value = ""
                e.target.answer1.value = ""
                e.target.answer2.value = ""
                e.target.answer3.value = ""
                e.target.answer4.value = ""
                e.target.correctAnswer.value = ""
                e.target.squaretoedit.value = ""
                e.target.penalty.value = ""
                e.target.reward.value = ""
                changeSquareColour()
                alert("Question added")
                
            } else {
                throw "Error: One of the answers must match the correct answer"
            }
        } catch (f) {
            alert(f)
        }
    
    }

    const resetQuestion = () => {
        for(i=0; i<64; i++) {
            let newSquare = document.querySelector(`#square-${i}`)
            if(newSquare.className == "edit-square"){  
                realGrid.grid[i].question = null
                newSquare.className = "empty-square"  
            }
        }
    }

    async function createNewGrid(e) {
        e.preventDefault()

        const data = {
            name: e.target.boardname.value.toLowerCase(),
            grid: realGrid.grid
        }
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        const response = await fetch("http://localhost:3000/grids", options);

        if (response.status == 201) {
            e.target.boardname.value = ''
            alert("Grid added.")
        }


    }
   
    const questionForm = document.querySelector("#questionform")
    questionForm.addEventListener("submit", createQuestion)
    questionForm.addEventListener("reset", resetQuestion)

    const gridForm = document.querySelector("#gridform")
    gridForm.addEventListener("submit", createNewGrid)

    let editSquare = document.getElementsByName("squaretoedit")[0]
    editSquare.addEventListener("keyup", changeSquareColour)
    
}

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

async function fetchGridData() {
    try {
        const gridData = await fetch(`http://localhost:3000/grids/${gridButton.name}`)
        if (gridData.ok) {
            const data = await gridData.json()
            return data
        } else {
            throw "Something went wrong with the API request"
        }
    } catch(e) {
        console.log(e)
    }
}

const displayGrid = (grid) => {
    const table = document.createElement("table")
    section.appendChild(table)
    for(i=7;i>= 0;i--){
        let row = document.createElement("tr")
        row.id = "row-" + i.toString()
        table.appendChild(row)
    }
    for(i = grid.grid.length - 1 ; i >= 0; i--){
        let td = document.createElement("td")
        td.textContent = grid.grid[i].index + 1
        td.id = "square-" + grid.grid[i].index
        if(grid.grid[i].question != null) {
            td.classList.add("square-question")
        } else {
            td.classList.add("empty-square")
        }
        let rowNumber = Math.floor(i/8)
            if(rowNumber%2 == 1){
                document.getElementById("row-" + rowNumber).append(td)
            } else {
                document.getElementById("row-" + rowNumber).prepend(td)
            }
    } 
}







class Question {
    constructor (question, answers, correctAnswerIndex, reward, penalty) {
        this.question = question,
        this.answers = answers,
        this.correctAnswerIndex = correctAnswerIndex
        this.reward = reward
        this.penalty = penalty
    }
}
