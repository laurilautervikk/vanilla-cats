import axios from "axios";

export function setupFavorites(element) {
  console.log("SETUP FAVORITES", element);
  const page = document.getElementById("page-content");
  page.innerHTML = `
    <br />
    <br />
    <h1>FAVORITES HERE</h1>
  `;
}
