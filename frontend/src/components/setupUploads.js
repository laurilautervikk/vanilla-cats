import axios from "axios";

//TODO: upload logic, delete logic

export async function setupUploads(element) {
  //clear old content
  console.log("SETUP UPLOADS DONE");
  const page = document.getElementById("page-content");
  page.innerHTML = "";
  //add upload container
  const uploadContainer = document.createElement("div");
  page.appendChild(uploadContainer);
  //get user id
  const loggedInUserId = localStorage.getItem("userId");

  // UPLOAD LOGIC HERE
  // create form
  page.innerHTML = /*html*/ `
  <div class="upload-div">
      <h3 id="message">Upload an image</h3>
          <form action="/api/images/upload" method="POST" enctype="multipart/form-data">
          <input type="file" id="image-input" name="file" accept="image/jpeg, image/png, image/jpg">
          </form>
          <br>
          <div class="upload-image-div">
            <div id="display-image">
            <div id="loader" class="lds-ring"><div></div><div></div><div></div><div></div></div>
          </div>
      </div>
  </div>
  `;
  document.getElementById("loader").style.display = "none";
  const imageInput = document.querySelector("#image-input");

  async function uploadImage() {
    document.getElementById("loader").style.display = "block";
    //collect formadata
    let formData = new FormData();
    formData.append("sub_id", loggedInUserId);
    formData.append("file", imageInput.files[0]);
    //display formdata
    console.log("formData from front ", formData);
    console.log("file from input ", imageInput.files[0]);

    try {
      const upload = await axios.post("api/images/upload", formData);
      console.log("upload ", upload.body);
      //hide spinner
      document.getElementById("loader").style.display = "none";
      //clear preview
      document.querySelector("#display-image").style.backgroundImage = "";
      await getUploadedImages();
      console.log("Upload SUCCESS at FE");
      imageInput.value = "";
      //display message
      const message = document.getElementById("message");
      message.innerHTML = `<span style="color:green;">Upload Successful</span>`;
      setTimeout(() => {
        message.innerHTML = "Upload an image";
      }, 2000);
    } catch {
      console.log("Upload FAILED at FE");
      //hide spinner
      document.getElementById("loader").style.display = "none";
      //clear preview
      document.querySelector("#display-image").style.backgroundImage = "";
      imageInput.value = "";
      //display message
      const message = document.getElementById("message");
      message.innerHTML = `<span style="color:red;">No cats found on the image</span>`;
      setTimeout(() => {
        message.innerHTML = "Upload an image";
      }, 2000);
    }
  }

  imageInput.addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const uploaded_image = reader.result;
      document.querySelector(
        "#display-image"
      ).style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(imageInput.files[0]);
    uploadImage();
  });

  //toggle favotite
  async function deleteUpload(cardDiv, image_id) {
    //delete image
    try {
      await axios.delete(`api/images/${image_id}`);
      cardDiv.remove();
      await getUploadedImages();
    } catch (error) {
      console.error("error uploading image");
    }
  }

  async function getUploadedImages() {
    //remove old content
    const divsToRemove = document.querySelectorAll(".card--container");
    for (let i = 0; i < divsToRemove.length; i++) {
      divsToRemove[i].remove();
    }

    //get uploads for logged in user
    let uploadedImages = {};
    const params = {
      sub_id: loggedInUserId,
      order: "DESC",
      limit: 100,
    };
    const response = await axios.get("api/images", { params });
    uploadedImages = response.data;
    console.log("uploadedImages ", uploadedImages);

    uploadedImages.forEach((item) => {
      //creat a cat card
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card--container");
      //set id for cardDiv
      cardDiv.id = item.id;
      cardDiv.innerHTML = /*html*/ `
        <img src="${item.url}" alt="cat" class="card--image"/>
        <button class="card--delete-btn" id="delete-btn-${item.id}">
        <i class="fa fa-fw fa-trash"></i></button>
        `;
      element.appendChild(cardDiv);
      const button = document.getElementById(`delete-btn-${item.id}`);
      button.addEventListener("click", function (event) {
        deleteUpload(cardDiv, cardDiv.id);
        event.preventDefault();
      });
    });
  }

  await getUploadedImages();
}
