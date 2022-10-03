const axios = require("axios").default; //remove later
const bodyParser = require("body-parser"); //?
const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;
axios.defaults.baseURL = process.env.BASE_URL;
axios.defaults.headers.common["x-api-key"] = process.env.API_VALUE;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//GET endpoints
//get images //WORKS needle
router.get("/images/search", async (req, res) => {
  try {
    console.log("at try");
    console.log(url.parse(req.url, true).query);
    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
      },
    };
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query,
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}/images/search?${params}`,
      requestHeaders
    );
    const data = apiRes.body;
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}/images/search?${params}`);
    }
    res.status(200).json(data);
  } catch {
    console.log("at error");
    res.status(500).json({ error: "error get images" });
  }
});

//get favorites //BROKEN axios
router.get("/favourites", async (req, res) => {
  try {
    console.log(url.parse(req.url, true).query);
    console.log(JSON.stringify(req.headers));

    const params = new URLSearchParams({
      ...url.parse(req.url, true).query,
    });
    const apiResponse = await axios.get(`/favourites?${params}`);
    const data = apiResponse.data;

    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "get error" });
  }
});

//get uploads  //WORKS needle
router.get("/images", async (req, res) => {
  try {
    console.log(url.parse(req.url, true).query);
    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
      },
    };
    console.log(requestHeaders);
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query,
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}/images?${params}`,
      requestHeaders
    );
    const data = apiRes.body;
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}/images?${params}`);
    }
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "error" });
  }
});

//POST endpoints
//set favorite //BROKEN
router.post("/favourites", async (req, res) => {
  try {
    console.log("query params ", url.parse(req.url, true).query);

    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
      },
    };

    //params not needed here
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query,
    });
    console.log("req.body ");

    const apiRes = await needle(
      "post",
      `${API_BASE_URL}/favourites`,
      req.body,
      requestHeaders
    );
    const data = apiRes.data;
    //log
    console.log("res data ", apiRes.body);

    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "post error" });
  }
});

module.exports = router;
