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
const leaderBoard = document.querySelector(".leader-board-page ");
let userNameInput = document.querySelector(".username");
let categoryDisplay = document.querySelector(".categories");
let spinner = document.querySelector(".spin1");
let spinner2 = document.querySelector(".spin2");
let questNumber = document.querySelector(".quest-number");
let question = document.querySelector(".question");
let allOptions = document.querySelectorAll(".options");

loginBtn.addEventListener("click", login);
startBtn.addEventListener("click", startTrivia);
nextBtn.addEventListener("click", nextQuestion);
exitLeaderPage.addEventListener("click", exitLeaderBoard);
openLeaderPage.addEventListener("click", openLeaderBoard);

let currentUser = undefined;
let selectedLevel = "";
let selectedCategory = {};
let questions = [];
let categories = [];
let count = 0;

function login() {
  const userName = userNameInput.value.toLowerCase();
  if (userName === "") {
    alert("Input Name");
    return;
  }
  let user = JSON.parse(localStorage.getItem(userName)) || undefined;
  console.log(user);
  if (user === undefined) {
    user = {
      name: userName,
    };
    console.log(JSON.stringify(user));
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
        console.log(selectedCategory);
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

function nextQuestion() {
  if (count === questions.length) {
    finish();
    return;
  }
  let currentQuestion = questions[count];
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
  leaderBoard.classList.add("hidden");
  resultPage.classList.remove("hidden");
}

function openLeaderBoard() {
  leaderBoard.classList.remove("hidden");
  resultPage.classList.add("hidden");
}
