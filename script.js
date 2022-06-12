"use strict";

const loginBtn = document.querySelector(".login-btn");
const categoryPage = document.querySelector(".category-page");
const loginPage = document.querySelector(".login-page");
const startBtn = document.querySelector(".start-btn");
const contentPage = document.querySelector(".content-page");
const nextBtn = document.querySelector(".next-btn");
const resultPage = document.querySelector(".result-page");
const exitLeaderPage = document.querySelector(".exit-btn");
const openLeaderPage = document.querySelector(".leaderBoard-btn");
const leaderBoardPage = document.querySelector(".leader-board-page ");
let userNameInput = document.querySelector(".username");
let categoryDisplay = document.querySelector(".categories");
let spinner = document.querySelector(".spin1");
let spinner2 = document.querySelector(".spin2");
let questNumber = document.querySelector(".quest-number");
let question = document.querySelector(".question");
let allOptions = document.querySelectorAll(".answer");
let uncheckOption = document.querySelectorAll(".options");
let userScore = document.querySelector(".score");
let userHighScore = document.querySelector(".highscore");
let leaderStrips = document.querySelector(".strips");

loginBtn.addEventListener("click", login);
startBtn.addEventListener("click", startTrivia);
nextBtn.addEventListener("click", submit);
exitLeaderPage.addEventListener("click", exitLeaderBoard);
openLeaderPage.addEventListener("click", viewLeaderBoard);

let currentUser = undefined;
let selectedLevel = "";
let selectedCategory = {};
let questions = [];
let categories = [];
let count = 0;
let currentQuestion = {};
let selectedOption = "";
let currentScore = 0;

function login() {
  let userName = userNameInput.value.toLowerCase();
  if (userName === "") {
    alert("Input Name");
    return;
  }
  let user = JSON.parse(localStorage.getItem(userName)) || undefined;
  if (user === undefined) {
    user = {
      name: userName,
      highScores: [],
    };
    localStorage.setItem(userName, JSON.stringify(user));
  }
  currentUser = user;

  openTriviaSetup();
}

let checkLevel = document.querySelectorAll(".levels");
for (let i = 0; i < checkLevel.length; i++) {
  checkLevel[i].onchange = (e) => {
    const parent = checkLevel[i].parentNode;
    if (e.target.checked) {
      selectedLevel = parent.children[1].innerText;
      console.log(selectedLevel);
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
  const response = await fetch("https://opentdb.com/api_category.php");
  const result = await response.json();
  console.log(result);
  if (result) {
    spinner.classList.remove("spinner-border");
  }
  categories = result.trivia_categories;
  categories.forEach((trivia_categories) => {
    categoryDisplay.innerHTML += `
      <div class="radio-bg me-2 mb-2 py-2 px-1">
        <input
          type="radio"
          id="${trivia_categories.id}"
          name="category"
          class="category"
        />
        <label for="${trivia_categories.id}" class="text-center"
          >${trivia_categories.name}</label
        >
      </div>
`;
  });
  addEventToCategories();
}

fetchCategories();

function addEventToCategories() {
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
  if (questions.length > 0) {
    openTrivia();
    nextQuestion();
  } else {
    alert("Sorry there are no questions in this level and category");
  }
  console.log(questions);
}

function selectOption() {
  let checkedAnswer = document.querySelectorAll(".options");
  for (let i = 0; i < checkedAnswer.length; i++) {
    checkedAnswer[i].onchange = (e) => {
      const parent = checkedAnswer[i].parentNode;
      if (e.target.checked) {
        selectedOption = parent.children[1].children[1].innerText;
        console.log(selectedOption);
      }
    };
  }
}
selectOption();

function submitAnswer() {
  if (currentQuestion.correct_answer === selectedOption) currentScore++;
  userScore.innerText = `Score: ${currentScore}`;
  selectedOption = "";
  console.log(currentScore);
}

function nextQuestion() {
  currentQuestion = questions[count];
  let options = currentQuestion.incorrect_answers;
  let index = Math.floor(Math.random() * 4);
  options.splice(index, 0, currentQuestion.correct_answer);
  questNumber.innerHTML = ` Question ${count + 1}/10`;
  question.innerHTML = `${currentQuestion.question.toUpperCase()}`;
  for (let i = 0; i < options.length; i++) {
    allOptions[i].children[1].innerText = options[i];
  }
  console.log(options);
  count++;
}

function submit() {
  if (selectedOption === "") {
    alert("Please select an option");
    return;
  }
  for (let i = 0; i < uncheckOption.length; i++) {
    uncheckOption[i].checked = false;
  }
  submitAnswer();
  if (count === questions.length) {
    setHighestScore();
    finish();
    return;
  }

  nextQuestion();
}

function setHighestScore() {
  let highestScore = 0;
  if (currentUser.highScores.length === 0) {
    currentUser.highScores.push({
      level: selectedLevel,
      category: selectedCategory.name,
      score: currentScore,
    });
    highestScore = currentScore;
  } else {
    let index = currentUser.highScores.findIndex(
      (x) => x.level === selectedLevel && x.category === selectedCategory.name
    );
    console.log("index", index);
    if (index > -1) {
      let highScore = currentUser.highScores[index];
      if (highScore.score < currentScore) {
        highScore.score = currentScore;
        highestScore = currentScore;
        currentUser.highScores.splice(index, 1, highScore);
      } else {
        userHighScore.innerText = `Highscore: ${highScore.score}`;
      }
    } else {
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
  localStorage.setItem(
    currentUser.name.toLowerCase(),
    JSON.stringify(currentUser)
  );

  updateLeaderBoard(highestScore);
}

function updateLeaderBoard(highestScore) {
  let key = `${selectedCategory.name} - ${selectedLevel}`;
  let leaderBoard = JSON.parse(localStorage.getItem(key)) || [];
  if (leaderBoard.length === 0) {
    leaderBoard.push({
      name: currentUser.name,
      score: highestScore,
    });
  } else {
    let index = leaderBoard.findIndex((x) => x.name === currentUser.name);
    if (index > -1) {
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
  let key = `${selectedCategory.name} - ${selectedLevel}`;
  let leaderBoard = JSON.parse(localStorage.getItem(key)) || [];
  console.log(leaderBoard);
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

function openTrivia() {
  categoryPage.classList.add("hidden");
  contentPage.classList.remove("hidden");
}

function finish() {
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
