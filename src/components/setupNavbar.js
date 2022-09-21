//import axios from "axios";

export function setupNavbar(element) {
  const navList = document.createElement("ul");
  navList.classList.add("nav--list");

  navList.innerHTML = /*html*/ `
  <li class="btn active"><a href="#">Cats</a></li>
  <li class="btn" ><a href="#">Favorites</a> </li>
  <li class="btn"><a href="#">Uploads</a></li>
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
}
