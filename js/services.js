
async function createDatabase() {
    await fetch("http://localhost:8000/database/create_table.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  
  async function fetchTransactions() {
    const response = await fetch("http://localhost:8000/transactions/fetch_transactions.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
}
  
async function createTransaction(transaction) {
    const response = await fetch("http://localhost:8000/transactions/create_transaction.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    const data = await response.json();
    return data;
}
  
async function deleteTransaction(id) {
    const response = await fetch(
      `http://localhost:8000/transactions/delete_transaction.php?id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  }