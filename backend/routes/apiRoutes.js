const bodyParser = require("body-parser");
const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");
const cors = require("cors");
const multer = require("multer");
const util = require("util");
const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  image: {
    type: Buffer,
  },
});

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//GET endpoints
//get images //WORKS
router.get("/images/search", async (req, res) => {
  try {
    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
        "Content-Type": "application/json",
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
    res.status(apiRes.statusCode).json(apiRes.body);
  } catch {
    console.log("at error");
    res.status(500).json({ error: "error get images" });
  }
});

//get favorites //WORKS
router.get("/favourites", async (req, res) => {
  try {
    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
        "Content-Type": "application/json",
      },
    };
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query,
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}/favourites?${params}`,
      requestHeaders
    );
    res.status(apiRes.statusCode).json(apiRes.body);
  } catch {
    console.log("at error");
    res.status(500).json({ error: "error get favs" });
  }
});

//get uploads //WORKS
router.get("/images", async (req, res) => {
  try {
    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
        "Content-Type": "application/json",
      },
    };
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query,
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}/images?${params}`,
      requestHeaders
    );
    res.status(apiRes.statusCode).json(apiRes.body);
  } catch {
    res.status(500).json({ error: "error" });
  }
});

//POST endpoints
//set favorite //WORKS
router.post("/favourites", async (req, res) => {
  try {
    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(req.body);

    const apiRes = await needle(
      "post",
      `${API_BASE_URL}/favourites`,
      body,
      requestHeaders
    );

    res.status(apiRes.statusCode).json(apiRes.body);
  } catch {
    res.status(500).json({ error: "error: add favourite" });
  }
});

//delete favorite //WORKS
router.delete("/favourites/:favouriteId", async (req, res) => {
  try {
    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(req.body);
    const apiRes = await needle(
      "delete",
      `${API_BASE_URL}/favourites/${req.params.favouriteId}`,
      body,
      requestHeaders
    );

    res.status(apiRes.statusCode).json(apiRes.body);
  } catch {
    res.status(500).json({ error: "error: delete favourite" });
  }
});

//upload image //BROKEN
router.post("/images/upload", upload.single("file"), async (req, res) => {
  try {
    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("req.file ", req.file);
    console.log("req.body.sub_id ", req.body.sub_id);

    let formFile = new FormData();
    formFile.append("sub_id", req.body.sub_id);
    formFile.append("file", req.file);

    console.log("formFile ", formFile);

    const apiRes = await needle(
      "post",
      `${API_BASE_URL}/images/upload`,
      formFile,
      requestHeaders,
      { multipart: true }
    );

    res.status(apiRes.statusCode).json(apiRes.body);
  } catch {
    res.status(500).json({ error: "error: upload image" });
  }
});

//delete uploaded image //WORKS ??
router.delete("/images/:id", async (req, res) => {
  try {
    const requestHeaders = {
      headers: {
        [API_KEY_NAME]: API_KEY_VALUE,
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(req.body);
    console.log("req.params ", req.params);
    const apiRes = await needle(
      "delete",
      `${API_BASE_URL}/images/${req.params.id}`,
      body,
      requestHeaders
    );

    res.status(apiRes.statusCode).json(apiRes.body);
  } catch {
    res.status(500).json({ error: "error: delete image" });
  }
});

module.exports = router;
