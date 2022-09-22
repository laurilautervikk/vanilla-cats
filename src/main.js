import "./style.css";
import axios from "axios";
import { setupGallery } from "./components/setupGallery.js";
import { setupNavbar } from "./components/setupNavbar";
import { setupLogin } from "./components/setupLogin";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.headers.common["x-api-key"] = import.meta.env.VITE_API_KEY;
sessionStorage.clear();

document.querySelector("#app").innerHTML = /*html*/ `
  <div id="main-container" class="container">
    <nav class="nav">
        </nav>
      <div id="page-content">
        </div>
        <div id="modal-wrapper" data-active="true"></div>
    </div>
`;

setupNavbar(document.querySelector("nav"));
setupGallery(document.querySelector("#page-content"));
setupLogin(document.querySelector("#modal-wrapper"));
