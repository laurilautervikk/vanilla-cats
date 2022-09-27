import axios from "axios";

//TODO: Endless scroll, image loaders

export async function setupGallery(element) {
  //clear old content
  const page = document.getElementById("page-content");
  page.innerHTML = "";
  console.log("SET UP GALLERY DONE");
  //toggle favotite
  async function toggleFavorite(cardDiv, image_id) {
    let sub_id = localStorage.getItem("userId");
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

  //draw gallery
  async function getCats() {
    //get cats from APIlet
    const response = await axios.get("/images/search?limit=6&order=Desc");
    let cats = response.data;
    console.log("cats from API ", cats);
    //get cats and start to draw cardDiv

    //check if anybody lgged in
    const loggedInUserId = localStorage.getItem("userId");
    if (loggedInUserId) {
      //get favorites for logged in user
      let favorites = {};
      const params = {
        sub_id: loggedInUserId,
        order: "DESC",
      };
      const response = await axios.get("/favourites", { params });
      favorites = response.data;
      console.log("favs ", favorites);
      let favoriteList = [];
      for (let i = 0; i < favorites.length; i++) {
        favoriteList.push(favorites[i].image_id);
      }
      console.log("favList ", favoriteList);

      cats.forEach((item) => {
        //creat a cat card
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card--container");
        //set id for cardDiv
        cardDiv.id = item.id;
        cardDiv.innerHTML = /*html*/ `
        <img src="${item.url}" lowsrc="paw.svg" alt="cat" class="card--image"/>
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
        //check if id in favorite list, if so make button red
        if (favoriteList.includes(item.id)) {
          cardDiv.classList.add("is-favorite");
          for (let i = 0; i < favorites.length; i++) {
            if ((item.id = favorites[i].id)) {
              cardDiv.dataset.favorite = favorites[i].id;
            }
          }
        }
      });
    } else {
      //get cats from API for unauthorized user
    const response = await axios.get("/images/search?limit=6&order=Desc");
    let cats = response.data;
    console.log("cats from API ", cats);
    //get cats and start to draw cardDiv
    cats.forEach((item) => {
      //creat a cat card
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card--container");
      //set id for cardDiv
      cardDiv.id = item.id;
      cardDiv.innerHTML = /*html*/ `
      <img src="${item.url}" alt="cat" class="card--image"/>
      `;
      element.appendChild(cardDiv);
    });
    }
  }

  await getCats();
}
