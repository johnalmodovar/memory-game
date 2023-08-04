"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

// vars for clicking cards
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
document.getElementById("score").textContent = score;

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple"
];

const colors = shuffle(COLORS); // colors but it's shuffled around

createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  // walking through the colors array and creating card div
  for (let color of colors) {
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card", color);
    cardDiv.addEventListener("click", handleCardClick);
    gameBoard.appendChild(cardDiv);

  }
}


/** Flip a card face-up. */

function flipCard(card) {
  card.style.backgroundImage = "none";
  card.style.backgroundColor = card.classList[1];
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.backgroundColor = "";
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  // if board is locked nothing happens
  if(lockBoard) return;

  // if evt target is the current card nothing happens
  if(this === firstCard) return;

  // flip current card
  flipCard(this);

  if(!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lockBoard = true;
    score++;
    document.getElementById("score").textContent = score;
    setTimeout(matchChecker, FOUND_MATCH_WAIT_MSECS);
  }
}

function matchChecker() {
  if(firstCard.classList[1] === secondCard.classList[1]) {
    firstCard.removeEventListener("click", handleCardClick);
    secondCard.removeEventListener("click", handleCardClick);
  } else {
    unFlipCard(firstCard);
    unFlipCard(secondCard);
  }
  resetBoard();
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// start button
function startGame() {
  let gameContainer = document.getElementById("game-container");
  gameContainer.style.display = "flex";

  let startButton = document.getElementById("start-button");
  startButton.style.display = "none";

  let restartButton = document.getElementById("restart-button");
  restartButton.style.display = "flex";
}

// restart button
function restartGame() {
  game.innerHTML = "";
  shuffle(COLORS);
  createCards(colors);
  score = 0;
  document.getElementById("score").textContent = score;
}