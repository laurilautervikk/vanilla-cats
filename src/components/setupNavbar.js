import { setupGallery } from "./setupGallery.js";
import { setupFavorites } from "./setupFavorites.js";
import { setupUploads } from "./setupUploads.js";
import { setupLogin } from "./setupLogin";

export function setupNavbar(element) {
  const navList = document.createElement("ul");
  navList.classList.add("nav--list");

  navList.innerHTML = /*html*/ `
  <li class="btn active" id="cats-btn"><a href="#">Cats</a></li>
  <li class="btn" id="favorites-btn"><a href="#">Favorites</a> </li>
  <li class="btn" id="uploads-btn"><a href="#">Uploads</a></li>
  <li class="btn" id="login-btn"><a href="#">Login</a></li>
  <li class="btn hide" id="logout-btn"><a href="#">Log out</a></li>
        `;

  element.appendChild(navList);

  const btns = navList.getElementsByClassName("btn");

  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      const current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }

  //event listeners for menu items
  const catsBtn = document.getElementById("cats-btn");
  catsBtn.addEventListener("click", function (event) {
    setupGallery(document.querySelector("#page-content"));
    event.preventDefault();
  });

  const favoritesBtn = document.getElementById("favorites-btn");
  favoritesBtn.addEventListener("click", function (event) {
    setupFavorites(document.querySelector("#page-content"));
    event.preventDefault();
  });

  const uploadsBtn = document.getElementById("uploads-btn");
  uploadsBtn.addEventListener("click", function (event) {
    setupUploads(document.querySelector("#page-content"));
    event.preventDefault();
  });
}
