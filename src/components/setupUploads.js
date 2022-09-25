import axios from "axios";

//TODO: well, a lot

export function setupUploads(element) {
  console.log("SETUP UPLOADS", element);
  const page = document.getElementById("page-content");
  page.innerHTML = `
    <br />
    <br />
    <h1>UPLOADS HERE</h1>
  `;
}
