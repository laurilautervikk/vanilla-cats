import "./style.css";
import axios from "axios";
import { setupGallery } from "./components/setupGallery.js";
import { setupNavbar } from "./components/setupNavbar";
import { setupLogin } from "./components/setupLogin";
axios.defaults.baseURL = "http://localhost:5000/";

const socket = new WebSocket("ws://localhost:8080/");

socket.onopen = function (e) {
  console.log("WS Connection established");
  console.log("WS Sending to server");
  socket.send("My name is John");
};

socket.onmessage = function (event) {
  console.log(`WS Data received from server: ${event.data}`);
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(
      `WS Connection closed cleanly, code=${event.code} reason=${event.reason}`
    );
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log("WS Connection died");
  }
};

socket.onerror = function (error) {
  console.log(`WS ${error.message}`);
};

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

export default socket;
