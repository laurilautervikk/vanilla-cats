import "./style.css";
import axios from "axios";
import { setupGallery } from "./components/setupGallery.js";
import { setupNavbar } from "./components/setupNavbar";
import { setupLogin } from "./components/setupLogin";

axios.defaults.baseURL = "http://localhost:5000/";

sessionStorage.clear();

//TODO: implement spinners for loading images

document.querySelector("#app").innerHTML = /*html*/ `
  <div id="main-container" class="container">
    <nav class="nav">
        </nav>
      <div id="page-content">
        </div>
        <div id="modal-wrapper" data-active="true"></div>
    </div>
`;
setupGallery(document.querySelector("#page-content"));
setupNavbar(document.querySelector("nav"));
setupLogin(document.querySelector("#modal-wrapper"));
