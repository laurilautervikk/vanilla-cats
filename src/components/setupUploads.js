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
  <h3>Upload an image</h3>
  <form>
  <input type="file" id="image-input" accept="image/jpeg, image/png, image/jpg">
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
    let formData = new FormData();
    formData.append("sub_id", loggedInUserId);
    formData.append("file", imageInput.files[0]);

    console.log("formdata >> ", formData);

    try {
      await axios.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("upload OK");
      //do stuff
      //hide spinner
      document.getElementById("loader").style.display = "none";
      //clear preview
      document.querySelector("#display-image").style.backgroundImage = "";
      await getUploadedImages();
    } catch {
      console.log("FAILURE!!");
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
      await axios.delete(`/images/${image_id}`);
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
    const response = await axios.get("/images", { params });
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
