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

loginBtn.addEventListener("click", login);
startBtn.addEventListener("click", openTrivia);
nextBtn.addEventListener("click", finish);
exitLeaderPage.addEventListener("click", exitLeaderBoard);
openLeaderPage.addEventListener("click", openLeaderBoard);

let currentUser = undefined;
let selectedLevel = "";
let selectedCategory = "";

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

let checkCategory = document.querySelectorAll(".category");
for (let i = 0; i < checkCategory.length; i++) {
  checkCategory[i].onchange = (e) => {
    const parent = checkCategory[i].parentNode;
    if (e.target.checked) {
      selectedCategory = parent.children[1].innerText;
      console.log(selectedCategory);
    }
  };
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
