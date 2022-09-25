import { setupGallery } from "./setupGallery.js";
import { setupFavorites } from "./setupFavorites.js";
import { setupUploads } from "./setupUploads.js";
import { setupLogin } from "./setupLogin";

export function setupNavbar(element) {
  const navList = document.createElement("ul");
  navList.classList.add("nav--list");

  navList.innerHTML = /*html*/ `
  <li class="btn active" id="cats-btn"><a href="#"><span class="menu-icon"><i class="fa fa-fw fa-cat"></i></span><span class="menu-name">Cats</span></a></li>  
  <li class="btn hide" id="favorites-btn"><a href="#"><span class="menu-icon"><i class="fa fa-fw fa-heart"></i></span><span class="menu-name">Favorites</span></a> </li>
  <li class="btn hide" id="uploads-btn"><a href="#"><span class="menu-icon"><i class="fa fa-fw fa-cloud-upload"></i></span><span class="menu-name">Uploads</span></a></li>
  <li class="btn" id="login-btn"><a href="#"><span class="menu-icon"><i class="fa fa-fw fa-sign-in-alt"></i></span><span class="menu-name">Login</span></a></li>
  <li class="btn hide" id="logout-btn"><a href="#"><span class="menu-icon"><i class="fa fa-fw fa-sign-out"></i></span><span class="menu-name">Log out<span class="hide" id="display-name"></span></span></a></li>
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
