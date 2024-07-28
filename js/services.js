
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
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (data.status === 401) {
    return [];
  }
  return data;
}

async function createTransaction(transaction) {
  const response = await fetch("http://localhost:8000/transactions/create_transaction.php", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
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
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
}

async function register(user) {
  const response = await fetch("http://localhost:8000/auth/register.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  return data;
}

async function login(user) {
  const response = await fetch("http://localhost:8000/auth/login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  return data;
}

async function getUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  const user = await fetch("http://localhost:8000/auth/get_user.php", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await user.json();
  if (data.status === 401) {
    localStorage.removeItem("token");
    return null;
  }
  return data;
}