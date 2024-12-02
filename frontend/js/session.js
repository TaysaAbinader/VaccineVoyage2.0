export function setData(game) {
  sessionStorage.setItem("game", JSON.stringify(game));
}

export function getData() {
  const gameData = sessionStorage.getItem("game");
return gameData ? JSON.parse(gameData) : null
  }