'use strict';
let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
const word_list = ["morning","geography","apple", "oxygen", "penguin", "rainbow", "whisper", "vampire", "hunter", "christmas", "xelophone"]

let startBtn = document.createElement("button");
document.querySelector("#alphabet").appendChild(startBtn)
startBtn.innerHTML = "Start"
startBtn.addEventListener("click", function(){
  document.querySelector("#alphabet").removeChild(startBtn);
  Alp(preGame(word_list))})

let error = 0

function Alp(game) {
  console.log(game[1])
  for(let word of game[0]) {
    let space = document.createElement("h3");
    space.innerText = word;
    document.querySelector("#alphabet").appendChild(space)
  }
  let newDiv = document.createElement("div");
  newDiv.id = "btns"
  document.querySelector("#alphabet").appendChild(newDiv)
  for (let btn of alphabet) {
  let alphabetBtn = document.createElement("button");
  alphabetBtn.innerHTML = btn
    alphabetBtn.id = btn
  document.querySelector('#btns').appendChild(alphabetBtn);
}
  let errorTimes = document.createElement('p');
  errorTimes.innerText = error.toString();
  document.querySelector("#alphabet").appendChild(errorTimes)
   let buttons = document.querySelectorAll("#btns button");
    buttons.forEach(button => {
      button.addEventListener("click",  evt =>{
        if (game[1].includes(button.innerHTML)) {
          for (let a = 0; a <= game[1].length - 1; a++) {
            if (button.innerHTML === game[1][a]) {
              game[0][a] = game[1][a]
              document.getElementsByTagName("h3")[a].innerHTML = game[1][a]
            }
          }
        }
        else {
          console.log("Wrong");
          error++
          errorTimes.innerText = error.toString()

        }
        letterChosen(button.id)
        if (JSON.stringify(game[0]) === JSON.stringify(game[1]) && error <6) {
          document.querySelector('#alphabet').appendChild(document.createElement("h2")).innerHTML = "you win"
        }
        else if (JSON.stringify(game[0]) !== JSON.stringify(game[1]) && error >=6) {
          document.querySelector('#alphabet').appendChild(document.createElement("h2")).innerHTML = "you lost"
        }
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
function letterChosen (letter) {
  let allBtn = document.querySelectorAll("button")
  allBtn.forEach(btn => {
    if (btn.id === letter) {
      document.querySelector("#btns").removeChild(btn)
    }
  })

}
