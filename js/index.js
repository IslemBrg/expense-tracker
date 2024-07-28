let balance = document.getElementById("balance");
let moneyPlus = document.getElementById("money-plus");
let moneyMinus = document.getElementById("money-minus");
let list = document.getElementById("list");
let text = document.getElementById("text");
let amount = document.getElementById("amount");
let notification = document.getElementById("notification");
let form = document.getElementById("form");

let currentUser = null;

let transactions = [];

function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

async function addTransaction(e) {
  e.preventDefault();
  console.log(e);
  if (text.value.trim() === "" || amount.value.trim() === "") {
    showNotification();
  } else {
    const transaction = {
      text: text.value,
      amount: +amount.value,
    };

    await createTransaction(transaction);
    await init();
    text.value = "";
    amount.value = "";
  }
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(sign === "+" ? "plus" : "minus");
  item.innerHTML = `
          ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span
          ><button class="delete-btn" onclick="removeTransaction(${
            transaction.id
          })"><i class="fa fa-trash-o" style="font-size:25px"></i></button>
    `;
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2);
  const income = amounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => (accumulator += value), 0) * -1
  ).toFixed(2);
  balance.innerText = ` DT ${total}`;
  moneyPlus.innerText = ` DT ${income}`;
  moneyMinus.innerText = ` DT ${expense}`;
}

async function removeTransaction(id) {
  console.log(id);
  await deleteTransaction(id);
  init();
}

function indexButtons() {
  const indexButtonsArea = document.getElementById("index-buttons-area");
  if (!indexButtonsArea) return;

  if (!currentUser) {
    indexButtonsArea.innerHTML = `
      <div>
            <a href="register.html" class="slider-link">
              Get Started
            </a>
          </div>
          <div>
            <a href="login.html" class="slider-link">
              Login
            </a>
          </div>
    `;
  }
}

function navButton() {
  const navButton = document.getElementById("nav-right");
  const navAppItem = document.getElementById("nav-app-item");
  if (!navButton || !navAppItem) return;

  if (currentUser) {
    navButton.innerHTML = `
      <div>
            <a href="login.html?logout=1" class="slider-link">
              Logout
            </a>
          </div>
    `;
    navAppItem.innerHTML = `
      <a class="nav-link" href="Application.html">Application </a>
    `;
  } else {
    navButton.innerHTML = `
      <div>
            <a href="login.html" class="slider-link">
              Login
            </a>
          </div>
    `;
  }
}

function populateIndexWallet() {
  const indexWalletContainer = document.getElementById("index-wallet-container");
  if (!indexWalletContainer) return;
  indexWalletContainer.innerHTML = indexWalletHTML;
  balance = document.getElementById("balance");
  moneyPlus = document.getElementById("money-plus");
  moneyMinus = document.getElementById("money-minus");
  list = document.getElementById("list");
  text = document.getElementById("text");
  amount = document.getElementById("amount");
  notification = document.getElementById("notification");
  form = document.getElementById("form");
}

// Init
async function init() {
  createDatabase();
  currentUser = await getUser();
  indexButtons();
  navButton();
  if (currentUser) {
    populateIndexWallet();
    if(form) form.addEventListener("submit", addTransaction);
    list.innerHTML = "";
    transactions = await fetchTransactions();
    if (transactions.length > 0) {
      transactions.forEach(addTransactionDOM);
      updateValues();
    }
  }
}

document.addEventListener("DOMContentLoaded", init);