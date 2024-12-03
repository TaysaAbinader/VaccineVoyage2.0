import {setData} from './session.js';
let port = 8000

document.querySelector("button").addEventListener("click", async function() {
  let name = prompt("Welcome, what's the name of the virus?")
  const game = await gameStart(name)
  setData(game)
  location.href="../html/body.html"
  return game
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