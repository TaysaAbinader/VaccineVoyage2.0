import {getData} from './session';
const game = getData('game');
let hint_used = 1

async function guess() {
  let guess = prompt("What's your guess?")
  const checkAnswer = await fetch (`http://127.0.0.1:5000/game_start/${game}/${game["current level"]}/${guess}`)
  const jsonAnswer  = await checkAnswer.json();
  alert(`${jsonAnswer.response}, now you have ${jsonAnswer.points} points`);
}
async function newHint(hint_used){
  if (hint_used <= 6) {
    let hint = await fetch (`http://127.0.0.1:5000/get_hint/${game}/${game["current level"]}`)
    const jsonHint = await hint.json()
    let addHint = document.createElement("li")
    addHint.innerHTML = jsonHint[hint_used]
    document.querySelector("#hintBox").appendChild(addHint)
    hint_used ++
  }else {
    let hint = await fetch (`http://127.0.0.1:5000/multiple_choice/${game}/${game["current level"]}`)
    let jsonHint = await hint.json()
    let addHint = document.createElement("li")
    addHint.innerHTML = jsonHint
    document.querySelector("#hintBox").appendChild(addHint)

  }
}
function quit() {}