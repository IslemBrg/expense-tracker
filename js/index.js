balance = document.getElementById("balance");
  moneyPlus = document.getElementById("money-plus");
  moneyMinus = document.getElementById("money-minus");
list = document.getElementById("list");
  

function addTransactionDOM(transaction) {
    console.log("trans 1",transaction);
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
    const transactions = await fetchTransactions();
    if (transactions.length > 0) {
      console.log("transactions", transactions);
      transactions.forEach(addTransactionDOM);
      updateValues();
    }
}

document.addEventListener('DOMContentLoaded', init);
