import {getData} from './session.js';
const game = getData();
let hint_used = 1
console.log(game)
game[0]["countries"][level -1]["latitude"]

async function guess() {
  let guess = prompt("What's your guess?")
  const checkAnswer = await fetch (`http://127.0.0.1:${port}/game_start/${game}/${game["current level"]}/${guess}`)
  const jsonAnswer  = await checkAnswer.json();
  if(jsonAnswer.response === "Correct") {
    if (hint_used <= 6) {
    await pointCalculation("plus", "hint")}
    else if (hint_used >6) {
      await pointCalculation("plus", "mc")
    }
  } else if (jsonAnswer.response === "Incorrect") {
    if (hint_used <= 6) {
    await pointCalculation("minus", "hint")}
    else if (hint_used >6) {
      await pointCalculation("minus", "mc")
    }
  }
  alert(`${jsonAnswer.response}, now you have ${jsonAnswer.points} points`);
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
    game.points = (Math.floor(game.points) + Math.floor(game["current level"]*rate)).toString()
  }else if (operation === "minus") {
    game.points = (Math.floor(game.points) - Math.floor(game["current level"]*rate)).toString()
  }
  document.querySelector("#points").innerHTML = game.points
  return game.points
}


function quit() {
  document.querySelectorAll("button").forEach(btn => btn.removeEventListener("click", quit))
  //document.getElementById("game-over").style.display = "block"
  //document.getElementById("try-again").addEventListener("click", evt => {
  // location.href('home.js')})
}