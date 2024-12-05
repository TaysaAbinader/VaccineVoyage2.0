import {getData} from './session.js';
const port = 8000
const game = getData();
game[0]["hint used"] = 1
console.log(game)

const guessBtn = document.querySelector("#button4")
guessBtn.addEventListener("click", evt => {
  guess()

})

const hintBtn = document.querySelector("#button5")
hintBtn.addEventListener("click", evt => {
  console.log(game[0]["hint used"])
  newHint(game[0]["hint used"],game[0]["current level"])
})

async function guess() {
  let hint_used = game[0]["hint used"]
  let guess = prompt("What's your guess?")
  let currentLevel = game[0]["current level"]
  let currentCountry = game[0]["countries"][currentLevel-1]["name"]
  const checkAnswer = await fetch (`http://127.0.0.1:${port}/answer_is_correct/${currentCountry}/${guess}`)
  const jsonAnswer  = await checkAnswer.json();
  alert(`${jsonAnswer.response}`);
  if(jsonAnswer.response === "Correct") {
    game[0]["current level"] ++
    document.querySelector("#hintBox ul").innerHTML = ""
    let levelBlock = document.getElementsByClassName("level_count")
    let level = document.querySelector("#level")
    level.innerHTML = `Level ${currentLevel+1}/7`
    if (currentLevel !== 7){
      levelBlock[currentLevel-1].style.fill = "#8AC926"
    }
    else {
      alert("You win")
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
    if (hint_used <= 6) {
    await pointCalculation("minus", "hint")}
    else if (hint_used >6) {
      await pointCalculation("minus", "mc")
    }
  }

}
async function newHint(hint_used,level){
  let country = game[0]["countries"][level-1]
  if (game[0].points >= 0){
  if (hint_used <= 6) {
    let hint = country["hints"][hint_used-1]
    let addHint = document.createElement("li")
    addHint.innerHTML = hint
    document.querySelector("#hintBox ul").appendChild(addHint)
    await pointCalculation("minus", "hints")
    game[0]["hint used"] ++
    return game[0]["hint used"]
  }else {
    let hint = await fetch (`http://127.0.0.1:${port}/multiple_choice/${country.name}`)
    let jsonHint = await hint.json()
    console.log(jsonHint)
    let addHint = document.createElement("li")
    addHint.innerHTML = `The country is among: ${jsonHint}`
    document.querySelector("#hintBox ul").appendChild(addHint)
    await pointCalculation("minus", "mc")
    hintBtn.disabled = true
    hintBtn.style.backgroundColor = "grey"
    game[0]["hint used"] = 1
    return game[0]["hint used"]
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
  document.querySelector("#points").innerHTML = game[0].points
  return game[0].points
}
async function miniGameRandomize(){
  let game=['hangman','trivia'];
  let randomizedGame=Math.floor(Math.random()*game.length);
  return game[randomizedGame]
}

let homeBtn = document.querySelector("#button1")
homeBtn.addEventListener("click", evt => {
  location.href = "home2.html"
})


function quit() {
  document.querySelectorAll("button").forEach(btn => btn.removeEventListener("click", quit))
  //document.getElementById("game-over").style.display = "block"
  //document.getElementById("try-again").addEventListener("click", evt => {
  // location.href('home.js')})
}