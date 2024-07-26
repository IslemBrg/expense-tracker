let balance = document.getElementById("balance");
let moneyPlus = document.getElementById("money-plus");
let moneyMinus = document.getElementById("money-minus");
let list = document.getElementById("list");
let text = document.getElementById("text");
let amount = document.getElementById("amount");
let notification = document.getElementById("notification");
let form = document.getElementById("form");
  
let transactions = []

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

async function init() {
    await createDatabase()
    list.innerHTML = "";
    transactions = await fetchTransactions();
    if (transactions.length > 0) {
      transactions.forEach(addTransactionDOM);
      updateValues();
    }
}

document.addEventListener('DOMContentLoaded', init);

form.addEventListener("submit", addTransaction);