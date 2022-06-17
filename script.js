"use strict";

// get all the elements
const loginBtn = document.querySelector(".login-btn");
const categoryPage = document.querySelector(".category-page");
const loginPage = document.querySelector(".login-page");
const startBtn = document.querySelector(".start-btn");
const contentPage = document.querySelector(".content-page");
const rule = document.querySelector(".rule");
const resultPage = document.querySelector(".result-page");
const exitLeaderPage = document.querySelector(".exit-btn");
const openLeaderPage = document.querySelector(".leaderBoard-btn");
const leaderBoardPage = document.querySelector(".leader-board-page ");
let nextBtn = document.querySelector(".next-btn");
let userNameInput = document.querySelector(".username");
let categoryDisplay = document.querySelector(".categories");
const spinner = document.querySelector(".spin1");
const spinner2 = document.querySelector(".spin2");
let questNumber = document.querySelector(".quest-number");
let question = document.querySelector(".question");
let allOptions = document.querySelectorAll(".answer");
let uncheckOption = document.querySelectorAll(".options");
let userScore = document.querySelector(".score");
let userHighScore = document.querySelector(".highscore");
let leaderStrips = document.querySelector(".strips");
let playAgainBtn = document.querySelector(".play-again");
let goHomeBtn = document.querySelector(".go-back");
let progressBar = document.querySelector("#progress");

// added eventlisteners to selected buttons
loginBtn.addEventListener("click", login);
startBtn.addEventListener("click", startTrivia);
nextBtn.addEventListener("click", submit);
exitLeaderPage.addEventListener("click", exitLeaderBoard);
openLeaderPage.addEventListener("click", viewLeaderBoard);
playAgainBtn.addEventListener("click", playAgain);
goHomeBtn.addEventListener("click", goBackHome);

// set global variables to be used in the program
let currentUser = undefined;
let selectedLevel = "";
let selectedCategory = {};
let questions = [];
let categories = []; //all the categories
let count = 0;
let currentQuestion = {};
let selectedOption = "";
let currentScore = 0;

function login() {
  //set input of username
  let userName = userNameInput.value.toLowerCase();

  if (userName === "") {
    alert("Please enter a name");
    return;
  }
  //store user into username
  let user = JSON.parse(localStorage.getItem(userName)) || undefined;
  // new user created
  if (user === undefined) {
    user = {
      name: userName,
      highScores: [],
    };
    localStorage.setItem(userName, JSON.stringify(user));
  }
  currentUser = user;

  fetchCategories();
  openTriviaSetup();
}

// add check event to select levels
let checkLevel = document.querySelectorAll(".levels");
for (let i = 0; i < checkLevel.length; i++) {
  checkLevel[i].onchange = (e) => {
    const parent = checkLevel[i].parentNode;
    if (e.target.checked) {
      selectedLevel = parent.children[1].innerText;
    }
  };
}

function startTrivia() {
  if (selectedLevel === "" || selectedCategory === {}) {
    alert("Complete actions");
  } else {
    fetchQuestions();
  }
}

async function fetchCategories() {
  //fetch frpm api url
  const response = await fetch("https://opentdb.com/api_category.php");
  const result = await response.json();
  if (result) {
    spinner.classList.remove("spinner-border");
  }
  //loop and set innerhtml of the category class
  categories = result.trivia_categories;
  categories.forEach((trivia_categories) => {
    categoryDisplay.innerHTML += `
      <div class="check">
        <input
          type="radio"
          id="${trivia_categories.id}"
          name="category "
          class="category d-none"
        />
        <label for="${trivia_categories.id}" class="text-center radio-bg me-2 mb-2 py-2 px-1"
          >${trivia_categories.name}</label
        >
      </div>
`;
  });
  addEventToCategories();
}

function addEventToCategories() {
  //add check event to selecting category
  let checkCategory = document.querySelectorAll(".category");
  for (let i = 0; i < checkCategory.length; i++) {
    checkCategory[i].onchange = (e) => {
      const parent = checkCategory[i].parentNode;
      if (e.target.checked) {
        selectedCategory.name = parent.children[1].innerText;
        selectedCategory.id = parent.children[1].getAttribute("for");
      }
    };
  }
}

async function fetchQuestions() {
  spinner2.classList.add("spinner-border");
  startBtn.classList.add("hidden");
  const response = await fetch(
    "https://opentdb.com/api.php?amount=10" +
      "&category=" +
      selectedCategory.id +
      "&difficulty=" +
      selectedLevel.toLowerCase() +
      "&type=multiple"
  );
  const res = await response.json();
  if (res) {
    startBtn.classList.remove("hidden");
    spinner2.classList.remove("spinner-border");
  }
  questions = res.results;
  // check that the questions in the category and level is greater than 0
  if (questions.length > 0) {
    openTrivia();
    nextQuestion();
  } else {
    alert("Sorry there are no questions in this level and category");
  }
}

function selectOption() {
  let checkedAnswer = document.querySelectorAll(".options");
  for (let i = 0; i < checkedAnswer.length; i++) {
    checkedAnswer[i].onchange = (e) => {
      const parent = checkedAnswer[i].parentNode;
      if (e.target.checked) {
        selectedOption = parent.children[1].children[1].innerText;
      }
    };
  }
}
selectOption();

function submitAnswer() {
  // check selected option is the right answer
  if (currentQuestion.correct_answer === selectedOption) currentScore++;
  userScore.innerText = `Score: ${currentScore}`;
  selectedOption = "";
}

function nextQuestion() {
  updateProgressBar(count);

  currentQuestion = questions[count];
  let questionLength = questions.length;
  let options = [...currentQuestion.incorrect_answers];
  // randomly place correct and incorrect answers at different positions
  let index = Math.floor(Math.random() * 4);
  options.splice(index, 0, currentQuestion.correct_answer);
  questNumber.innerHTML = ` Question ${count + 1}/${questionLength}`;
  question.innerHTML = `${currentQuestion.question.toUpperCase()}`;
  // display options
  for (let i = 0; i < options.length; i++) {
    allOptions[i].children[1].innerText = options[i];
  }
  count++;
}

function updateProgressBar(count) {
  let questionLength = questions.length;
  let progressInPercent = (count / questionLength) * 100;
  progressBar.style.width = `${progressInPercent}%`;
}

function submit() {
  if (selectedOption === "") {
    alert("Please select an option");
    return;
  }
  // return next checked option unchecked
  for (let i = 0; i < uncheckOption.length; i++) {
    uncheckOption[i].checked = false;
  }
  submitAnswer();

  if (count === questions.length) {
    setHighestScore();
    finish();
    nextBtn.innerText = `Next`;
    return;
  }

  nextQuestion();
  if (count === questions.length) {
    nextBtn.innerText = `Finish`;
  }
}

function setHighestScore() {
  // initialize highest score
  let highestScore = 0;
  // sets highscore for the new level and category
  if (currentUser.highScores.length === 0) {
    currentUser.highScores.push({
      level: selectedLevel,
      category: selectedCategory.name,
      score: currentScore,
    });
    highestScore = currentScore;
  } else {
    // checks the user has played same level and category
    let index = currentUser.highScores.findIndex(
      (x) => x.level === selectedLevel && x.category === selectedCategory.name
    );
    // if highscore already exists in level and category?
    if (index > -1) {
      let highScore = currentUser.highScores[index]; //user currentscore at that level and category

      // check if the currentscore is greater than highscore, update
      if (currentScore > highScore.score) {
        highScore.score = currentScore;
        highestScore = currentScore;
        currentUser.highScores.splice(index, 1, highScore);
      } else {
        userHighScore.innerText = `Highscore: ${highScore.score}`;
      }
    } else {
      //else highscore doesnt exist in that level and category
      currentUser.highScores.push({
        level: selectedLevel,
        category: selectedCategory.name,
        score: currentScore,
      });
      highestScore = currentScore;
    }
  }

  if (highestScore === 0) return;

  userHighScore.innerText = `Highscore: ${highestScore}`;
  //save highscore into localStorage of current user
  localStorage.setItem(
    currentUser.name.toLowerCase(),
    JSON.stringify(currentUser)
  );

  updateLeaderBoard(highestScore);
}

function updateLeaderBoard(highestScore) {
  let key = `${selectedCategory.name} - ${selectedLevel}`;
  let leaderBoard = JSON.parse(localStorage.getItem(key)) || [];
  // if user high score never existed
  if (leaderBoard.length === 0) {
    leaderBoard.push({
      name: currentUser.name,
      score: highestScore,
    });
  } else {
    // user highscore exists
    let index = leaderBoard.findIndex((x) => x.name === currentUser.name);
    if (index > -1) {
      // take the user and find its score set it to the highest score gotten from the sethighest score function
      let highScoreData = leaderBoard[index];
      highScoreData.score = highestScore;
      leaderBoard.splice(index, 1, highScoreData);
    } else {
      leaderBoard.push({
        name: currentUser.name,
        score: highestScore,
      });
    }
  }
  localStorage.setItem(key, JSON.stringify(leaderBoard));
}

function viewLeaderBoard() {
  leaderStrips.innerHTML = "";
  let key = `${selectedCategory.name} - ${selectedLevel}`;
  let leaderBoard = JSON.parse(localStorage.getItem(key)) || [];
  for (let i = 0; i < leaderBoard.length; i++) {
    leaderStrips.innerHTML += `
       <div
          class="d-flex leader-strip p-3 bg-white mb-3 align-items-center justify-content-between"
        ><span class="d-flex">
          <p class="mb-0 me-3">${i + 1}</p>
          <i class="bi bi-person-square me-3"></i>
          <p class="mb-0 me-3">${leaderBoard[i].name}</p>
        </span>
        <span class="d-flex">
          <img src="/assets/trophy-fill.svg" alt="" />
          <p class="mb-0 ms-3">${leaderBoard[i].score}</p>
        </span>
        </div>
`;
  }
  openLeaderBoard();
}

function openTriviaSetup() {
  categoryPage.classList.remove("hidden");
  loginPage.classList.add("hidden");
}

function playAgain() {
  resultPage.classList.add("hidden");
  contentPage.classList.remove("hidden");
  rule.classList.remove("hidden");
  count = 0;
  currentScore = 0;

  nextQuestion();
}

function goBackHome() {
  resultPage.classList.add("hidden");
  categoryPage.classList.remove("hidden");
  questions = [];
  categories = [];
  currentQuestion = {};
  selectedOption = "";
  count = 0;
  currentScore = 0;
}

function openTrivia() {
  rule.classList.remove("hidden");
  categoryPage.classList.add("hidden");
  contentPage.classList.remove("hidden");
}

function finish() {
  rule.classList.add("hidden");
  contentPage.classList.add("hidden");
  resultPage.classList.remove("hidden");
}

function exitLeaderBoard() {
  leaderBoardPage.classList.add("hidden");
  resultPage.classList.remove("hidden");
}

function openLeaderBoard() {
  leaderBoardPage.classList.remove("hidden");
  resultPage.classList.add("hidden");
}
