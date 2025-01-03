import {getData,setData} from './session.js';
import {Hangman, preGame} from '../../TriviaMinigame/hangman_game.js';
import {triviaQuestions} from '../../TriviaMinigame/Minigame.js';
import {onCorrectCountryFound} from "../../MapNavigation/Navigation.js"


//intializing variables
const port = 5002
const game = getData();
game[0]["hint used"] = 1
console.log(game)
let virusName = document.getElementById('virus_name');
virusName.innerHTML = game[0]["disease name"];
const firstCountry = game[0]["countries"][0]
let visitedCountry = []
let hint = firstCountry["hints"][0]

//hint box
let addHint = document.createElement("li")
addHint.innerHTML = hint
document.querySelector("#hintBox ul").appendChild(addHint)
game[0]["hint used"] = 2

//button event listeners
const guessBtn = document.querySelector("#button4")
guessBtn.addEventListener("click", evt => {
  guess()

})

const hintBtn = document.querySelector("#button5")
hintBtn.addEventListener("click", evt => {
  newHint(game[0]["hint used"],game[0]["current level"])
})

const quitBtn = document.querySelector("#quit")
quitBtn.addEventListener("click", async evt => {
  quit()
})

//minigames
const minigameBtn = document.querySelector("#button3")
let word_list = ["morning","geography","apple", "oxygen", "penguin", "rainbow", "whisper", "vampire", "hunter", "christmas", "xelophone"]

minigameBtn.addEventListener("click", async function playMini() {
  let minigame = randomizeGame()
  console.log(minigame)
  console.log(game)
  if (minigame === "hangman" && word_list !== []) {
    let playGame = await gameHangman(word_list, game[0]["points"]).then( result =>{
      if (result[1] === "win") {
        miniGamePoint()
      }
    })
  }
  else if (minigame === "trivia") {
    await gameTrivia().then( status => {
      if(status === "win") {
        miniGamePoint()
      }
    })
  }
})


//all functions
async function gameTrivia() {
  let mainGame = await triviaQuestions().then(data => {
    let dialogTrivia = document.querySelector("#trivia");
    let question = data[0].question.text;
    let rightanswer = data[0].correctAnswer;
    let wronganswers = data[0].incorrectAnswers;

    return new Promise(resolve => {
      const optionsList = [rightanswer, ...wronganswers].sort(
          () => Math.random() - 0.5);

      const h2 = document.getElementById("questiontext");
      h2.textContent = question;

      const options = document.getElementById("options");
      if (options) {
        options.innerHTML = "";
        for (let answer of optionsList) {
          const button = document.createElement("button");
          button.textContent = answer;
          button.addEventListener("click", () => {
            if (answer === rightanswer) {
              alert("Congratulations! You got it right!");
              miniGamePoint();
              dialogTrivia.close(); // Close before resolving
              resolve("win");

            } else {

              alert(`Not correct! The answer is ${rightanswer}`);

              dialogTrivia.close(); // Close before resolving
              resolve("lost");
            }
          });
          options.appendChild(button);
        }
      }

      dialogTrivia.showModal();
    });
  });
}

async function gameHangman(word_list,currentPoint) {
  let dialogHangMan = document.querySelector("#hangman")
  let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
  let word = preGame(word_list)
  let mainGamePoint = await Hangman(word,currentPoint)
  console.log("Hangman played, point:",mainGamePoint)
  word_list.splice(word_list.indexOf(word), 1)
  return [word_list, mainGamePoint]
}

//guess function to collect player's guess then compare using backend function answer_is_correct
async function guess() {
  let hint_used = game[0]["hint used"]
  let guess = prompt("What's your guess?")
  let currentLevel = game[0]["current level"]
  let currentCountry = game[0]["countries"][currentLevel-1]["name"]
  const checkAnswer = await fetch (`http://127.0.0.1:${port}/answer_is_correct/${currentCountry}/${guess}`)
  const jsonAnswer  = await checkAnswer.json();
  alert(`${jsonAnswer.response}`);
  if(jsonAnswer.response === "Correct") {
    await onCorrectCountryFound(currentCountry)

    visitedCountry.push(currentCountry)
    if (currentLevel === 7) {
      let levelBlock = document.getElementsByClassName("level_count")
      levelBlock[currentLevel-1].style.fill = "#8AC926"
      alert("You win, your game is saved")

      quit()
    }
    game[0]["hint used"] = 2
    game[0]["current level"] = game[0]["current level"] +1
    currentLevel = game[0]["current level"]
    console.log(game[0]["current level"])

    document.querySelector("#hintBox ul").innerHTML = ""

    let tracker = document.querySelectorAll(".used")
    for (let i = 1; i < tracker.length; i++) {
      tracker[i].style.color = "white"
    }

    let levelBlock = document.getElementsByClassName("level_count")
    let level = document.querySelector("#level")
    level.innerHTML = `Level ${currentLevel}/7`
    if (currentLevel < 8){
      levelBlock[currentLevel-2].style.fill = "#8AC926"
       let nextHint = game[0]["countries"][currentLevel -1]["hints"][0]
      let addHint = document.createElement("li")
      addHint.innerHTML = nextHint
      document.querySelector("#hintBox ul").appendChild(addHint)
    }

      if (hintBtn.disabled === true) {
        hintBtn.disabled = false
        hintBtn.style.backgroundColor = "#FF595E"
  }
    if (hint_used <= 6) {
      if (hint_used === 1) {
        await pointCalculation("plus","mc")
        console.log(game[0].points, game[0]["current_level"])
      }
      else if (hint_used > 1){
    await pointCalculation("plus", "hint")}}
  } else if (jsonAnswer.response === "Incorrect") {
    if (game[0]["points"] >= 0) {
    if (hint_used <= 6) {
    await pointCalculation("minus", "hint")}
    else if (hint_used >6) {
      await pointCalculation("minus", "mc")
    }
    }
    else {
      alert("Oh no, you ran out of all points. You can play again")
      quit()
    }
  }

}
async function newHint(hint_used,level){
  let country = game[0]["countries"][level-1]
  if (game[0].points >= 0){
  if (hint_used <= 6) {
    let hint = country["hints"][hint_used-1]
    document.querySelector("#hintBox ul").innerHTML = ""
    let addHint = document.createElement("li")
    addHint.innerHTML = hint
    document.querySelector("#hintBox ul").appendChild(addHint)
    await pointCalculation("minus", "hints")
    let tracker = document.querySelectorAll(".used")[hint_used-1]
    tracker.style.color = "#008DD5"
    game[0]["hint used"] ++
    return game[0]["hint used"]
  }else {
    let hint = await fetch (`http://127.0.0.1:${port}/multiple_choice/${country.name}`)
    let jsonHint = await hint.json()
    document.querySelector("#hintBox ul").innerHTML = ""
    console.log(jsonHint)
    let addHint = document.createElement("li")
    addHint.innerHTML = `The country is among: ${jsonHint}`
    document.querySelector("#hintBox ul").appendChild(addHint)
    await pointCalculation("minus", "mc")
    hintBtn.disabled = true
    hintBtn.style.backgroundColor = "grey"
    let tracker = document.querySelectorAll(".used")[6]
    tracker.style.color = "#008DD5"
    game[0]["hint used"] = 1
    return game[0]["hint used"]
    }}
  else {
    alert("You ran out of points. Play minigame for more points or try guessing!")
    }


}
async function pointCalculation(operation,type) {
  let rate = 10
  if (type === "mc") {
    rate = 15}

  if (operation === "plus") {
    game[0].points = (Math.floor(game[0].points) + Math.floor(game[0]["current level"]*rate))
  }else if (operation === "minus") {
    game[0].points = (Math.floor(game[0].points) - Math.floor(game[0]["current level"]*rate))
  }
  document.querySelector("#points").innerHTML = game[0].points
  return game[0].points

}

async function miniGamePoint() {
  console.log(game[0].points)
  game[0].points = game[0].points +100
  console.log(game[0].points)
  document.querySelector("#points").innerHTML = game[0].points
  return game[0].points
}


function randomizeGame(){
  let game=['hangman','trivia'];
  let randomizedGame=Math.floor(Math.random()*game.length);
  return game[randomizedGame]
}

async function saveGame(currentLevel) {
  const data = {
    disease_name: game[0]["disease name"],
    visited_countries: game[0]["countries"][game[0]["current level"]-2]["name"],
    current_level: game[0]["current level"] -1
  };

  const save = await fetch(`http://127.0.0.1:${port}/save_game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

}

function quit() {
  let allBtns = document.querySelectorAll("button")
  allBtns.disabled = true
  const gameOver = document.querySelector("#game_over")
  const heading = document.createElement("h1")
  heading.innerText = "Game Over"
  const retrybtn = document.createElement("button")
  retrybtn.innerHTML = "Retry"
  gameOver.appendChild(heading)
  gameOver.appendChild(retrybtn)

  saveGame(visitedCountry)

  retrybtn.addEventListener("click", evt => {
    location.href = "../html/home.html"
  })
  gameOver.showModal()

}

