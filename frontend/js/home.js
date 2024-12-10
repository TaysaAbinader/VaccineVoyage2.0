import {setData} from './session.js';
let port = 5002 //change this if the current port is occupied

document.querySelector("#start_button").addEventListener("click", async function() {
  let name = prompt("Welcome, what's the name of the virus?")
  const game = await gameStart(name)
  setData(game)
  location.href="../html/body.html"
  return game
})

document.querySelector("#tut_button").addEventListener("click", evt => {
  location.href="../html/tutorial.html"
})
async function gameStart(diseaseName) {
  try {
    const gameData = await fetch (`http://127.0.0.1:${port}/game_start/${diseaseName}`, {
      method: 'GET'})
    const jsonGameData = await gameData.json()
    console.log(jsonGameData)
    return jsonGameData
  } catch (error) {
    console.log(error.message)
  }

}