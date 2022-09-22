import axios from "axios";

export function setupGallery(element) {
  const page = document.getElementById("page-content");
  page.innerHTML = "";
  console.log("SET UP GALLERY DONE");
  async function toggleFavorite(cardDiv, image_id) {
    let sub_id = sessionStorage.getItem("userId");
    if (sub_id === null) {
      sub_id = "stranger";
    }
    console.log("sub id ", sub_id);
    const payload = {
      image_id: image_id,
      sub_id: sub_id,
    };

    //set favorite
    if (cardDiv.classList.contains("not-favorite")) {
      try {
        console.log("sub id at axios", sub_id);
        const response = await axios.post("/favourites", payload);
        console.log("post response ", response.data);
        if (response.data.message === "SUCCESS") {
          console.log("Favorite added");
          cardDiv.setAttribute("data-favorite", response.data.id);
          cardDiv.classList.remove("not-favorite");
          cardDiv.classList.add("is-favorite");
          //add id and favorite id to sessionStorage
          window.sessionStorage.setItem(image_id, response.data.id);
        } else {
          console.error("error ", error);
        }
      } catch (error) {
        console.error("error ", error);
      }
    } else {
      //delete favorite
      try {
        const response = await axios.delete(
          `/favourites/${cardDiv.dataset.favorite}`
        );
        console.log("delete response ", response.data);
        if (response.data.message === "SUCCESS") {
          console.log("Favorite removed");
          cardDiv.classList.remove("is-favorite");
          cardDiv.classList.add("not-favorite");
          //remove id and favorite id from local storage
          window.sessionStorage.removeItem(image_id);
        } else {
          console.error("error ", error);
        }
      } catch (error) {
        console.error("error ", error);
      }
    }
  }
  //draw gallery
  async function getCats() {
    try {
      const response = await axios.get("/images/search?limit=12&order=Desc");
      response.data.forEach((item) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card--container");

        //check from sessionStorage if item id is present, if so use the corresponding
        //favorite id for data-favorite value
        const cachedFavorite = window.sessionStorage.getItem(item.id);
        if (cachedFavorite) {
          cardDiv.classList.add("is-favorite");
          cardDiv.setAttribute("data-favorite", cachedFavorite);
        } else {
          cardDiv.classList.add("not-favorite");
          cardDiv.setAttribute("data-favorite", item.id);
        }
        cardDiv.id = item.id;
        cardDiv.innerHTML = /*html*/ `
        <img src="${item.url}" alt="cat" class="card--image"/>
        <button class="card--favorite-btn" id="favorite-btn-${item.id}"><i class="fa fa-fw fa-heart"></i></button>
        `;
        element.appendChild(cardDiv);
        const button = document.getElementById(`favorite-btn-${item.id}`);
        let sub_id = sessionStorage.getItem("userId");
        if (sub_id === null) {
          button.classList.add("hide");
        }
        button.addEventListener("click", function (event) {
          toggleFavorite(cardDiv, cardDiv.id);
          event.preventDefault();
        });
      });
    } catch (error) {
      console.error("error ", error);
    }
  }

  getCats();
}
