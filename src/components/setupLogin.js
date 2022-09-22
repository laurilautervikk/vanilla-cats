import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { setupGallery } from "./setupGallery.js";

export function setupLogin(element) {
  //register and login
  function registerUser(inputUsername, inputPassword) {
    if (inputUsername && inputPassword) {
      //check if LS has user object
      if (localStorage.hasOwnProperty("users")) {
        let users = JSON.parse(localStorage.getItem("users"));
        //iterate over usernames in LS
        let userExists = false;
        Object.keys(users).forEach(function (key) {
          if (inputUsername === users[key].username) {
            return (userExists = true);
          }
        });

        if (userExists === true) {
          const alertBox = document.getElementById("alert-box");
          alertBox.innerHTML = `<span style="color:red;">Failed, user exists already.</span>`;
          setTimeout(() => {
            alertBox.innerHTML = "";
          }, 1000);
        } else {
          //encrypt password
          const passwordHashed = bcrypt.hashSync(inputPassword, 10);
          let newUser = {
            id: uuidv4(),
            username: inputUsername,
            password: passwordHashed,
          };
          users.push(newUser);
          window.localStorage.setItem("users", JSON.stringify(users));
          sessionStorage.setItem("userId", newUser.id);
          //get modal
          const modal = document.getElementById("modal");
          //alert message
          const alertBox = document.getElementById("alert-box");
          alertBox.innerHTML = `<span style="color:white;">User created successfully</span>`;
          setTimeout(() => {
            modal.style.display = "none";
            alertBox.innerHTML = "";
          }, 1000);
          //toggle main menu
          const loginLink = document.getElementById("login-btn");
          const logoutLink = document.getElementById("logout-btn");
          loginLink.classList.toggle("hide");
          logoutLink.classList.toggle("hide");
          setupGallery(document.querySelector("#page-content"));
        }
      } else {
        let newUsers = [];
        window.localStorage.setItem("users", JSON.stringify(newUsers));
        registerUser(inputUsername, inputPassword);
      }
    } else {
      const alertBox = document.getElementById("alert-box");
      alertBox.innerHTML = `<span style="color:red;">Insert something</span>`;
      setTimeout(() => {
        alertBox.innerHTML = "";
      }, 1000);
    }
  }

  function loginUser(inputUsername, inputPassword) {
    if (inputUsername && inputPassword) {
      let users = JSON.parse(localStorage.getItem("users"));
      //iterate over usernames in LS
      let dataFromLS = {};
      Object.keys(users).forEach(function (key) {
        if (inputUsername === users[key].username) {
          dataFromLS = {
            id: users[key].id,
            username: users[key].username,
            password: users[key].password,
          };
          return dataFromLS;
        }
      });

      if (dataFromLS.username) {
        //check password
        const isPasswordValid = bcrypt.compareSync(
          inputPassword,
          dataFromLS.password
        );

        if (isPasswordValid) {
          sessionStorage.setItem("userId", dataFromLS.id);
          //get modal
          const modal = document.getElementById("modal");
          //alert message
          const alertBox = document.getElementById("alert-box");
          alertBox.innerHTML = `<span style="color:white;">Login successful</span>`;
          setTimeout(() => {
            modal.style.display = "none";
            alertBox.innerHTML = "";
          }, 1000);
          //toggle main menu
          const loginLink = document.getElementById("login-btn");
          const logoutLink = document.getElementById("logout-btn");
          loginLink.classList.toggle("hide");
          logoutLink.classList.toggle("hide");
          setupGallery(document.querySelector("#page-content"));
        } else {
          const alertBox = document.getElementById("alert-box");
          alertBox.innerHTML = `<span style="color:red;">Wrong password</span>`;
          setTimeout(() => {
            alertBox.innerHTML = "";
          }, 1000);
        }
      } else {
        const alertBox = document.getElementById("alert-box");
        alertBox.innerHTML = `<span style="color:red;">No user with that name</span>`;
        setTimeout(() => {
          alertBox.innerHTML = "";
        }, 1000);
      }
    } else {
      const alertBox = document.getElementById("alert-box");
      alertBox.innerHTML = `<span style="color:red;">Insert something</span>`;
      setTimeout(() => {
        alertBox.innerHTML = "";
      }, 1000);
    }
  }

  function logoutUser() {
    //delete user from sessionstorage
    sessionStorage.clear();
    //toggle main menu
    const loginLink = document.getElementById("login-btn");
    const logoutLink = document.getElementById("logout-btn");
    loginLink.classList.toggle("hide");
    logoutLink.classList.toggle("hide");
    setupGallery(document.querySelector("#page-content"));
  }

  function drawModal() {
    const modal = document.createElement("div");
    modal.classList.add("login--modal");
    modal.setAttribute("id", "modal");

    modal.innerHTML = /*html*/ `
          <div class="modal--content">
              <span class="close">&times;</span>
              <p id="login-message" class="hide">Or <span id="toggle-login">log in</span> instead</p>
              <p id="register-message" >Sign in or <span id="toggle-register">register</span> a new account</p>
              <input type="text" id="username" name="username" placeholder="Username" value="" required><br>
              <input type="password" id="password" name="password" placeholder="Password" value="" required><br><br>
              <button id="user-login-btn" type="button">Login</button>
              <button id="user-register-btn" class="hide" type="button">Register</button>
              <p id="alert-box"></p>
          </div>
          `;

    element.appendChild(modal);
    //modal behavior
    const btn = document.getElementById("login-btn");
    const span = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
      modal.style.display = "block";
    };
    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }

  drawModal();

  //toggle between login and register
  const toggleLogin = document.getElementById("toggle-login");
  toggleLogin.addEventListener("click", function (event) {
    const messageR = document.getElementById("register-message");
    const buttonR = document.getElementById("user-register-btn");
    messageR.classList.toggle("hide");
    buttonR.classList.toggle("hide");
    const messageL = document.getElementById("login-message");
    const buttonL = document.getElementById("user-login-btn");
    messageL.classList.toggle("hide");
    buttonL.classList.toggle("hide");

    event.preventDefault();
  });

  const toggleRegister = document.getElementById("toggle-register");
  toggleRegister.addEventListener("click", function (event) {
    const messageR = document.getElementById("register-message");
    const buttonR = document.getElementById("user-register-btn");
    messageR.classList.toggle("hide");
    buttonR.classList.toggle("hide");
    const messageL = document.getElementById("login-message");
    const buttonL = document.getElementById("user-login-btn");
    messageL.classList.toggle("hide");
    buttonL.classList.toggle("hide");
    event.preventDefault();
  });

  //event listener for login btn
  const loginBtn = document.getElementById("user-login-btn");
  loginBtn.addEventListener("click", function (event) {
    const inputUsername = document.getElementById("username").value;
    const inputPassword = document.getElementById("password").value;
    loginUser(inputUsername, inputPassword);
    event.preventDefault();
  });

  //event listener for login btn
  const registerBtn = document.getElementById("user-register-btn");
  registerBtn.addEventListener("click", function (event) {
    const inputUsername = document.getElementById("username").value;
    const inputPassword = document.getElementById("password").value;
    registerUser(inputUsername, inputPassword);
    event.preventDefault();
  });

  //event listener for login btn
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", function (event) {
    logoutUser();
    event.preventDefault();
  });
}
