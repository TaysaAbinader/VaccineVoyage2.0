export {Hangman, preGame, letterChosen}
'use strict';
let exclude = []
async function Hangman(game,currentPoint) {
  let alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"]
  const word_list = [
    "morning",
    "geography",
    "apple",
    "oxygen",
    "penguin",
    "rainbow",
    "whisper",
    "vampire",
    "hunter",
    "christmas",
    "xelophone"]

  let dialogHangMan = document.querySelector("#hangman")
  let startBtn = document.createElement("button");
  let error = 0
  dialogHangMan.appendChild(startBtn)
  startBtn.innerHTML = "Start"
  dialogHangMan.showModal()
  return new Promise(resolve => {
    startBtn.addEventListener("click", async function() {
      dialogHangMan.removeChild(startBtn);
      console.log(game[1])
      let guessSpace = document.createElement("article")
      guessSpace.id = "guess"
      dialogHangMan.appendChild(guessSpace)
      for (let word of game[0]) {
        let space = document.createElement("h3");
        space.innerText = word;
        space.id = game.indexOf(word)
        document.querySelector("#guess").appendChild(space)
      }
      let alphabetSpace = document.createElement("article")
      alphabetSpace.id = "alphabet"
      dialogHangMan.appendChild(alphabetSpace)
      let newDiv = document.createElement("div");
      alphabetSpace.appendChild(newDiv)
      for (let btn of alphabet) {
        let alphabetBtn = document.createElement("button");
        alphabetBtn.innerHTML = btn
        alphabetBtn.id = btn
        newDiv.appendChild(alphabetBtn);
      }
      let errorTimes = document.createElement('p');
      errorTimes.innerText = `You have used ${error.toString()}/6 attempts`;
      document.querySelector("#alphabet").appendChild(errorTimes)
      let buttons = document.querySelectorAll("#alphabet button");
      buttons.forEach(button => {
        button.addEventListener("click", evt => {
          letterChosen(button);
          if (game[1].includes(button.innerHTML)) {
            for (let a = 0; a <= game[1].length - 1; a++) {
              if (button.innerHTML === game[1][a]) {
                game[0][a] = game[1][a]
                document.getElementsByTagName("h3")[a].innerHTML = game[1][a]
              }
            }
          } else {
            console.log("Wrong");
            error++
            errorTimes.innerText = `You have used ${error.toString()}/6 attempts`

          }
          if (JSON.stringify(game[0]) === JSON.stringify(game[1]) && error <
              6) {
            alert("you win")
            dialogHangMan.innerHTML = ""
            resolve("win")
            dialogHangMan.close()
          } else if (JSON.stringify(game[0]) !== JSON.stringify(game[1]) &&
              error >= 6) {
            alert(`You lost, the answer is ${game[1]}`)
            dialogHangMan.innerHTML = ""
            resolve("lost")
            dialogHangMan.close()
          }
        })
      })
    })
  })
}

function preGame(word_list){
  let challenge = word_list[Math.floor(Math.random() * word_list.length)];
  let guess = []
  let correct_word = []
  let game = []
  for (let i = 0; i < challenge.length; i++) {
    correct_word.push(challenge[i])
    guess.push("_")
  }
  game =[guess, correct_word]
  return game
}
function letterChosen(buttonElement) {
  buttonElement.disabled= true;
  buttonElement.style.backgroundColor = "grey"
}
