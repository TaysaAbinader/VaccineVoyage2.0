import {getData,setData} from '../frontend/js/session.js';
let game = getData()
let contBtn = document.querySelector('#cont_button');
contBtn.addEventListener('click', evt => {
  setData(game)
  location.href = "body.html";
  return game
})