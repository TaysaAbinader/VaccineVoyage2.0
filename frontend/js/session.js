export function setData(game) {

  try{
    sessionStorage.setItem('game', JSON.stringify(game));
  }catch(error) {
    console.log(error);
  }
}

export function getData() {
  try {
    const gameData = sessionStorage.getItem("game");
    return gameData ? JSON.parse(gameData) : null;
  } catch (error) {
    console.error("Error getting data from session storage:", error);
    return null;
  }
  }