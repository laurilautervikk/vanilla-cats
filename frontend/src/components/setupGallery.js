import axios from "axios";
//import { socket } from "../main.js";
//TODO: Endless scroll, image loaders

export const socket = new WebSocket("ws://localhost:8080/");

//WS setup
socket.onopen = function () {
  console.log("WS Connection established at client side");
  socket.send("Client says: hello");
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
  console.log(`WS error: ${error.message}`);
};

export async function setupGallery(element) {
  //clear old content
  const page = document.getElementById("page-content");
  page.innerHTML = "";
  console.log("SETTING UP GALLERY");
  console.trace();

  function addFavoritesOnRemote(cardDivId) {
    let sub_id = localStorage.getItem("userId");
    const data = {
      user: sub_id,
      action: "add",
      elementId: cardDivId,
    };

    //socket.send("Client says: add favorite");

    socket.send(JSON.stringify(data));
  }

  function deleteFavoritesOnRemote(cardDivId) {
    let sub_id = localStorage.getItem("userId");
    const data = {
      user: sub_id,
      action: "delete",
      elementId: cardDivId,
    };
    //socket.send("Client says: delete favorite");
    socket.send(JSON.stringify(data));
  }

  //toggle favotite
  async function toggleFavorite(cardDiv, image_id) {
    let sub_id = localStorage.getItem("userId");
    const payload = {
      image_id: image_id,
      sub_id: sub_id,
    };
    console.log("payload ", payload);

    //set favorite
    if (cardDiv.classList.contains("is-favorite")) {
      //delete favorite
      try {
        const response = await axios.delete(
          `api/favourites/${cardDiv.dataset.favorite}`
        );
        if (response.data.message === "SUCCESS") {
          cardDiv.classList.toggle("is-favorite");
          deleteFavoritesOnRemote(cardDiv.id);
          console.log("cardDiv.id ", cardDiv.id);
        } else {
          console.error("error: delete favourite not successful");
        }
      } catch (error) {
        console.error("error: delete request failed");
      }
    } else {
      try {
        const response = await axios.post("api/favourites", payload);
        if (response.data.message === "SUCCESS") {
          console.log("Favorite added");
          cardDiv.setAttribute("data-favorite", response.data.id);
          cardDiv.classList.toggle("is-favorite");
          addFavoritesOnRemote(cardDiv.id);
          console.log("cardDiv.id ", cardDiv.id);
        } else {
          console.error("error: add favourite not successful");
        }
      } catch (error) {
        console.error("error: add favourite request failed");
      }
    }
  }

  //draw gallery
  let cats;
  async function drawCats() {
    await getCats();
    //check if anybody lgged in
    const loggedInUserId = localStorage.getItem("userId");
    console.log("loggedInUserId at GALLERY ", loggedInUserId);
    if (loggedInUserId) {
      console.log("SOEMBODY IS LOGGED IN");
      //get favorites for logged in user
      let favorites = {};
      const params = {
        sub_id: loggedInUserId,
        order: "DESC",
      };
      let favoriteList = [];
      try {
        const response = await axios.get("api/favourites", { params });
        favorites = response.data;
        //console.log("favs ", favorites);
        for (let i = 0; i < favorites.length; i++) {
          favoriteList.push(favorites[i].image_id);
        }
        //console.log("favList ", favoriteList);
      } catch (error) {
        console.log("favorites not available");
      }

      cats.forEach((item) => {
        //create a cat card
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

        if (button) {
          button.addEventListener("click", function (event) {
            toggleFavorite(cardDiv, cardDiv.id);
            event.preventDefault();
          });
        }

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
      //loop over data and draw cardDiv for non auth user
      await getCats();
      //console.log("cats at render ", cats);
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

  async function getCats() {
    //get backedup response first
    //let catsLocal = JSON.parse(localStorage.getItem("apiBackup"));
    //console.log("first let's get cats from backup ", catsLocal);
    try {
      //get cats from API if possible
      const response = await axios
        .get("api/images/search?limit=6&order=Desc")
        .catch((err) => {
          if (err.response.status === 500) {
            throw new Error(`${err.config.url} server error`);
          }
          throw err;
        });
      cats = response.data;
      //backup response if its successful
      if (0 in cats) {
        localStorage.setItem("apiBackup", JSON.stringify(cats));
      }
      //console.log("live data from API ", cats);
    } catch (error) {
      cats = catsLocal;
      console.log("Cats loaded from backup");
    }

    return cats;
  }

  socket.onmessage = function (event) {
    try {
      console.log(JSON.parse(event.data));
      const data = JSON.parse(event.data);
      if (data.user === localStorage.getItem("userId")) {
        const element = document.getElementById(data.elementId);
        element.classList.toggle("is-favorite");
      } else {
        console.log("WS no user Id match");
      }
    } catch {
      console.log("Message received: ", event.data);
    }
  };

  drawCats();
}
