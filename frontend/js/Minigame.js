async function triviaQuestions() {
  try {
    const response = await fetch("https://the-trivia-api.com/v2/questions?limit=1&category=science&dificulty=easy");
    const result = await response.text();
    console.log(result)
    return JSON.parse(result);
  }
catch (error) {
    console.error("Error fetching question")
  }
}
triviaQuestions().then(data => {
  let question = data[0].question.text;
  let rightanswer = data[0].correctAnswer;
  let wronganswers = data[0].incorrectAnswers;

  const optionsList = [rightanswer, ...wronganswers].sort(() => Math.random() - 0.5); // Fixed line

  const h2 = document.getElementById("questiontext");
  h2.textContent = question;

  const options = document.getElementById("options");
  if (options) {
    options.innerHTML = ""; // Clear previous options
    for (let answer of optionsList) {
      const button = document.createElement("button");
      button.textContent = answer;
      button.addEventListener("click", () => {
        if (answer === rightanswer) {
          alert("Congratulations! You got it right!");
          trivia.close()
        } else {
          alert("Not yet! Try again!");
        }
      });
      options.appendChild(button);
    }
  }

  const trivia = document.getElementById("gamedialog");
  trivia.showModal();
});
