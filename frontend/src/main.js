import "./style.css";
import axios from "axios";
import { setupGallery } from "./components/setupGallery.js";
import { setupNavbar } from "./components/setupNavbar";
import { setupLogin } from "./components/setupLogin";

axios.defaults.baseURL = "http://localhost:5000/";

document.querySelector("#app").innerHTML = /*html*/ `
  <div id="main-container" class="container">
    <nav class="nav">
        </nav>
      <div id="page-content">
        </div>
        <div id="modal-wrapper" data-active="true"></div>
    </div>
`;

async function setupApp() {
  console.log("0");
  setupNavbar(document.querySelector("nav"));
  console.log("1");
  setupLogin(document.querySelector("#modal-wrapper"));
  console.log("2");
  await setupGallery(document.querySelector("#page-content"));
  console.log("3");
}

setupApp();
