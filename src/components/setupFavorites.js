import axios from "axios";

//TODO: implement image loader

export function setupFavorites(element) {
  //clear old content
  const page = document.getElementById("page-content");
  page.innerHTML = "";
  console.log("SETUP FAVORITES DONE");

  //toggle favotite
  async function toggleFavorite(cardDiv, image_id) {
    let sub_id = localStorage.getItem("userId");
    console.log("sub_id ", sub_id);
    const payload = {
      image_id: image_id,
      sub_id: sub_id,
    };

    //set favorite
    if (cardDiv.classList.contains("is-favorite")) {
      //delete favorite
      try {
        const response = await axios.delete(
          `/favourites/${cardDiv.dataset.favorite}`
        );
        if (response.data.message === "SUCCESS") {
          cardDiv.classList.toggle("is-favorite");
          cardDiv.remove();
        } else {
          console.error("error ", error);
        }
      } catch (error) {
        console.error("error ", error);
      }
    } else {
      try {
        const response = await axios.post("/favourites", payload);
        if (response.data.message === "SUCCESS") {
          console.log("Favorite added");
          cardDiv.setAttribute("data-favorite", response.data.id);
          cardDiv.classList.toggle("is-favorite");
        } else {
          console.error("error ", error);
        }
      } catch (error) {
        console.error("error ", error);
      }
    }
  }

  //draw favorites
  async function getFavorites() {
    try {
      //get favorites for logged in user
      const loggedInUserId = localStorage.getItem("userId");
      let favorites = {};
      const params = {
        sub_id: loggedInUserId,
        order: "DESC",
      };
      const response = await axios.get("/favourites", { params });
      favorites = response.data;
      console.log("favs ", favorites);

      favorites.forEach((item) => {
        //creat a cat card
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card--container");
        cardDiv.classList.add("is-favorite");
        //set id for cardDiv
        cardDiv.id = item.id;
        cardDiv.innerHTML = /*html*/ `
        <img src="${item.image.url}" lowsrc="paw.svg" alt="cat" class="card--image"/>
        <button class="card--favorite-btn" id="favorite-btn-${item.id}">
        <i class="fa fa-fw fa-heart"></i></button>
        `;
        cardDiv.dataset.favorite = item.id;
        element.appendChild(cardDiv);
        const button = document.getElementById(`favorite-btn-${item.id}`);
        button.addEventListener("click", function (event) {
          toggleFavorite(cardDiv, cardDiv.id);
          event.preventDefault();
        });
        //make button red
      });
    } catch (error) {
      console.error("error ", error);
    }
  }

  getFavorites();
}
