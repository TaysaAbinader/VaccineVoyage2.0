import {setData} from './session.js';
let port = 8000

document.querySelector("#start_button").addEventListener("click", async function() {
  let name = prompt("Welcome, what's the name of the virus?")
  const game = await gameStart(name)
  setData(game)
  location.href="../html/body.html"
  return game
})