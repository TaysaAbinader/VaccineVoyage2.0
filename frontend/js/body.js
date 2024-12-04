import {getData} from './session.js';
const port = 8000
const game = getData();
let hint_used = 1
console.log(game)

const guessBtn = document.querySelector("#button4")
guessBtn.addEventListener("click", evt => {
  guess()
})

async function guess() {
  let guess = prompt("What's your guess?")
  let currentLevel = game[0]["current level"]
  let currentCountry = game[0]["countries"][currentLevel-1]["name"]
  const checkAnswer = await fetch (`http://127.0.0.1:${port}/answer_is_correct/${currentCountry}/${guess}`)
  const jsonAnswer  = await checkAnswer.json();
  if(jsonAnswer.response === "Correct") {
    game[0]["current level"] ++
    if (hint_used <= 6) {
      if (hint_used === 1) {
        await pointCalculation("plus","mc")
        console.log(game[0].points, game[0]["current_level"])
      }
      else if (hint_used > 1){
    await pointCalculation("plus", "hint")}}
  } else if (jsonAnswer.response === "Incorrect") {
    if (hint_used > 6) {
    await pointCalculation("minus", "hint")}
    else if (hint_used >6) {
      await pointCalculation("minus", "mc")
    }
  }
  alert(`${jsonAnswer.response}`);
}
async function newHint(hint_used){
  let point = game["points"]
  if (point >= 0){
  if (hint_used <= 6) {
    let hint = await fetch (`http://127.0.0.1:${port}/get_hint/${game}/${game["current level"]}`)
    const jsonHint = await hint.json()
    let addHint = document.createElement("li")
    addHint.innerHTML = jsonHint[hint_used]
    document.querySelector("#hintBox").appendChild(addHint)
    await pointCalculation("minus", "hints")
    hint_used ++
  }else {
    let hint = await fetch (`http://127.0.0.1:${port}/multiple_choice/${game}/${game["current level"]}`)
    let jsonHint = await hint.json()
    let addHint = document.createElement("li")
    addHint.innerHTML = jsonHint
    document.querySelector("#hintBox").appendChild(addHint)
    await pointCalculation("minus", "mc")
    }}
  else {
    quit()
    }


}
async function pointCalculation(operation,type) {
  let rate = 10
  if (type === "mc") {
    rate = 15}

  if (operation === "plus") {
    game[0].points = (Math.floor(game[0].points) + Math.floor(game[0]["current level"]*rate)).toString()
  }else if (operation === "minus") {
    game[0].points = (Math.floor(game[0].points) - Math.floor(game[0]["current level"]*rate)).toString()
  }
  document.querySelector("#points").innerHTML = game.points
  return game[0].points
}
async function miniGameRandomize(){
  let game=['hangman','trivia'];
  let randomizedGame=Math.floor(Math.random()*game.length);
  return game[randomizedGame]
}


function quit() {
  document.querySelectorAll("button").forEach(btn => btn.removeEventListener("click", quit))
  //document.getElementById("game-over").style.display = "block"
  //document.getElementById("try-again").addEventListener("click", evt => {
  // location.href('home.js')})
}