import { v4 as uuidv4 } from "uuid";
//import sha256 from 'crypto-js/sha256';

export function setupLogin(element) {
  //register and login
  function registerUser(username, password) {
    if (username && password) {
      console.log("inputs ok");
      //check if LS has user object

      if (localStorage.hasOwnProperty("users")) {
        let users = JSON.parse(localStorage.getItem("users"));
        console.log("users.username from LS ", users.username); //must iterate over usernames
        console.log("current username ", username);
        if (users.username === username) {
          console.log("error: user exists already, or inputs empty");
        } else {
          console.log("username is new");
          //const passwordHashed  = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
          let newUser = {
            id: uuidv4(),
            username: username,
            password: password,
          };
          users.push(newUser);
          window.localStorage.setItem("users", JSON.stringify(newUser));
          console.log("user object ", users);
          sessionStorage.setItem("userId", newUser.id);
          //close modal
          const modal = document.getElementById("modal");
          modal.style.display = "none";
          //toggle main menu
          const loginLink = document.getElementById("login-btn");
          const logoutLink = document.getElementById("logout-btn");
          loginLink.classList.toggle("hide");
          logoutLink.classList.toggle("hide");
        }
      } else {
        console.log("no user obj in LS, will create one");
        let newUsers = [{
          id: uuidv4(),
          username: username,
          password: password,
        }];
        window.localStorage.setItem("users", JSON.stringify(newUsers));
      }
    }
  }

  function loginUser(username, password) {
    //check if username has value
    //check if username in local storage
    //check if password matches
    //save username to sessionstorage
    //close modal
    //fix UI
  }

  function logoutUser() {
    //delete user from sessionstorage
    sessionStorage.clear();
    //toggle main menu
    const loginLink = document.getElementById("login-btn");
    const logoutLink = document.getElementById("logout-btn");
    loginLink.classList.toggle("hide");
    logoutLink.classList.toggle("hide");

    console.log("user logged out");
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
              <input required type="text" id="username" name="username" placeholder="Username" value=""><br>
              <input required type="password" id="password" name="password" placeholder="Password" value=""><br><br>
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
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    loginUser(username, password);
    console.log("login clicked");
    event.preventDefault();
  });

  //event listener for login btn
  const registerBtn = document.getElementById("user-register-btn");
  registerBtn.addEventListener("click", function (event) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log("username at click", username);
    registerUser(username, password);
    console.log("register clicked");
    event.preventDefault();
  });

  //event listener for login btn
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", function (event) {
    logoutUser();
    console.log("logout clicked");
    event.preventDefault();
  });
}
