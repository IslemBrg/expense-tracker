const indexWalletHTML = `
    <h1 class="text-center">Expense Tracker</h1>
    <div class="container container1">
      <div class="header">
        <img src="https://i.ibb.co/jfScDTC/budget.png" alt="Expense Tracker" />
        <div class="balance-container">
          <h2>Your Balance</h2>
          <h2 id="balance" class="balance"> DT 0.00</h2>
        </div>
      </div>
      <div class="inc-exp-container">
        <div>
          <h4>Income</h4>
          <p id="money-plus" class="money plus">+ DT 0.00</p>
        </div>
        <div>
          <h4>Expenses</h4>
          <p id="money-minus" class="money minus">- DT 0.00</p>
        </div>
      </div>
      <h3>History</h3>
      <ul id="list" class="list"></ul>
      <h3>Add new transaction</h3>
      <form id="form" class="my-2">
        <div class="form-control my-2" style="height:20vh !important;">
          <label for="text">Description</label>
          <input type="text" id="text" placeholder="Enter description..." />
        </div>
        <div class="form-control my-2" style="height:20vh !important;">
          <label for="amount">Amount <br />
            <small>(-100 = expense, 100 = income)</small></label>
          <input type="number" id="amount" placeholder="Enter amount..." />
        </div>
        <button class="btn">Add transaction</button>
      </form>
    </div>
    <div class="notification-container" id="notification">
      <p>Please add a description and amount</p>
    </div>
`