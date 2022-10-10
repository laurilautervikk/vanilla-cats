const bodyParser = require("body-parser");
const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const FormData = require("form-data");

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

router.use(cors());
router.use(
  fileUpload({
    createParentPath: true,
  })
);
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

//proxy image upload //WORKS
router.post("/images/upload", async (req, res) => {
  try {
    //local file upload
    let file = req.files.file;
    let filePath = path.join(__dirname, "..", "uploads", file.name); //a unique id should be added

    file.mv(filePath, function (err) {
      if (err) {
        console.log("save error");
      }
      console.log("file saved");
    });

    //compile formData for API request
    let form = new FormData();
    form.append("sub_id", req.body.sub_id);
    form.append("file", fs.createReadStream(filePath));

    const headers = Object.assign(
      { [API_KEY_NAME]: API_KEY_VALUE },
      form.getHeaders()
    );

    const requestHeaders = {
      headers: headers,
    };

    const apiRes = await needle(
      "post",
      `${API_BASE_URL}/images/upload`,
      form,
      requestHeaders,
      {
        multipart: true,
      }
    );

    //console.log("headers ", headers);
    //console.log("form ", form);

    res.status(apiRes.statusCode).json(apiRes.body);
  } catch {
    res.status(500).json({ error: "image upload from Express to API FAILED" });
  }
});

//delete uploaded image //WORKS
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
