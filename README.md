# Historical Snakes and Ladders Game


# Description
As the name suggests this project has created a history themed snakes and ladders game. The players, in this case the school children playing, will have access to an interactive board with questions, that will test their history knowledge and reward correct answers.

For teachers, this project also allows you to modify and create your own game boards for your students to play on, with the ability to put in custom questions, or indeed load random general history ones should you so choose, wherever on the board you want to.


# Resources
This project requires the use of three APIs; the pixabay image API (https://pixabay.com/api/docs/), the open trivia database API (https://opentdb.com/), and our own backend grid API, which has installation and running instructions below.


# Installation
1. Navigate to ../snakesandladders/server in your terminal.
2. Run "npm init -y" and "npm install" to install npm in the server directory.
3. Install cors, express, and dotenv using "npm install cors", "npm install express", and "npm install dotenv" respectively.
4. Cors allows the obtaining of content from the API and the other two are required for running the backend API server.
5. In the package.json file ensure there are the following lines of code present: 
 "scripts": {
      "start": "node index.js",
      "dev": "nodemon index.js"
  }
6. You should now be able to run the server using npm run dev, if this fails check to make sure you are still in ../snakesandladders/server.


