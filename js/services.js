
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