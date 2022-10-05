import bcrypt from "bcryptjs";
import { setupGallery } from "./setupGallery.js";
import axios from "axios";

export function setupLogin(element) {
  //toggle main menu items
  function toggleMenu(displayUsername) {
    const displayName = document.getElementById("display-name");
    displayName.innerHTML = displayUsername;
    const favoritesLink = document.getElementById("favorites-btn");
    const uploadsLink = document.getElementById("uploads-btn");
    const loginLink = document.getElementById("login-btn");
    const logoutLink = document.getElementById("logout-btn");
    favoritesLink.classList.toggle("hide");
    uploadsLink.classList.toggle("hide");
    displayName.classList.toggle("hide");
    loginLink.classList.toggle("hide");
    logoutLink.classList.toggle("hide");
    setupGallery(document.querySelector("#page-content"));
  }
  //register user
  async function registerUser(inputUsername, inputPassword) {
    //check if there is any input
    if (inputUsername && inputPassword) {
      //try to get user from db
      const userExists = await axios.get(`auth/user/username/${inputUsername}`);
      console.log("userExists ", userExists.username);
      //check if user exists
      if (userExists.username) {
        const alertBox = document.getElementById("alert-box");
        alertBox.innerHTML = `<span style="color:red;">Failed, user exists already.</span>`;
        setTimeout(() => {
          alertBox.innerHTML = "";
        }, 1000);
      } else {
        //user doesnt exist , create one
        //encrypt password
        const passwordHashed = bcrypt.hashSync(inputPassword, 10);
        let body = {
          username: inputUsername,
          password: passwordHashed,
        };

        try {
          const registeredUser = await axios.post(`auth/register`, body);
          localStorage.setItem("userId", registeredUser.id);
          //show message in modal
          const modal = document.getElementById("modal");
          const alertBox = document.getElementById("alert-box");
          alertBox.innerHTML = `<span style="color:white;">User created successfully</span>`;
          setTimeout(() => {
            modal.style.display = "none";
            alertBox.innerHTML = "";
          }, 1000);
          //toggle main menu
          toggleMenu(registeredUser.username);
        } catch (error) {
          console.log("User regisrtation failed");
        }
      }
    } else {
      //no inputs
      const alertBox = document.getElementById("alert-box");
      alertBox.innerHTML = `<span style="color:red;">Insert something</span>`;
      setTimeout(() => {
        alertBox.innerHTML = "";
      }, 1000);
    }
  }

  //login user
  async function loginUser(inputUsername, inputPassword) {
    //check if there is input
    if (inputUsername && inputPassword) {
      //get user from db
      const response = await axios.get(`auth/user/username/${inputUsername}`);
      const userExists = response.data;
      console.log("userExists.username ", userExists.username);
      //if user exists, compare passwords
      if (userExists.username) {
        const isPasswordValid = bcrypt.compareSync(
          inputPassword,
          userExists.password
        );

        if (isPasswordValid) {
          console.log("userExists.username ", userExists.username);
          console.log("userExists.id ", userExists._id);
          localStorage.setItem("userId", userExists._id);
          //show message in modal
          const modal = document.getElementById("modal");
          const alertBox = document.getElementById("alert-box");
          alertBox.innerHTML = `<span style="color:white;">Login successful</span>`;
          setTimeout(() => {
            modal.style.display = "none";
            alertBox.innerHTML = "";
          }, 1000);
          toggleMenu(userExists.username);
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

  async function renewLogin() {
    //re-log in the logged in user after refresh
    const loggedInUserId = localStorage.getItem("userId");
    if (loggedInUserId) {
      const response = await axios.get(`auth/user/id/${loggedInUserId}`);
      const userExists = response.data;
      console.log("userExists.username ", userExists.username);
      //toggle main menu
      toggleMenu(userExists.username);
    } else {
      console.log("Nobody logged in");
    }
  }

  function logoutUser() {
    //delete user from localstorage, clear sessionstorage
    sessionStorage.clear();
    localStorage.removeItem("userId");
    toggleMenu();
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

  renewLogin();
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
