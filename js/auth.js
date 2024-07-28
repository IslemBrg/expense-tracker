const registerName = document.getElementById("register-name");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const notification = document.getElementById("notification");

let currentUser = null

function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

async function loginUser(e) {
  e.preventDefault();
  const user = {
    email: loginEmail.value,
    password: loginPassword.value,
  };
  if (
    loginEmail.value.trim() === "" ||
    loginPassword.value.trim() === ""
  ) {
    showNotification();
  } else {
      console.log(user);
      const res = await login(user);
      if (res.status === 200) {
        localStorage.setItem("token", res.jwt);
        window.location.href = "/index.html";
      } else {
        alert(res.message);
      }
  }
}

async function registerUser(e) {
  e.preventDefault();
  if (
    registerName.value.trim() === "" ||
    registerEmail.value.trim() === "" ||
    registerPassword.value.trim() === ""
  ) {
    showNotification();
  } else {
    let user = {
      name: registerName.value,
      email: registerEmail.value,
      password: registerPassword.value,
    };
    console.log(user);
    const res = await register(user);
    if (res.status === 201) {
      window.location.href = "/login.html";
      registerEmail.value = "";
      registerPassword.value = "";
    } else {
      alert(res.message);
    }
  }
}

async function init() {
  createDatabase();
  currentUser = await getUser();
  console.log("currentUser", currentUser);
  
  
  const logout = new URLSearchParams(new URL(window.location.href).search).get("logout");
  if (logout && currentUser) {
    localStorage.removeItem("token");
  }
}

document.addEventListener("DOMContentLoaded", init);

document.getElementById("register-form")?.addEventListener("submit", registerUser);

document.getElementById("login-form")?.addEventListener("submit", loginUser);
