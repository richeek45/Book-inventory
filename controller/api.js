const router = require("express").Router();
const axios = require("axios");
const dotenv = require("dotenv").config();
const {
  getGoogleAuthURL,
  getGoogleUser,
  refreshToken,
} = require("../google-util");
const { access_token } = require("../token.json");

// Home Page
router.get("/", (req, res) => {
  res.render("books/search");
});

// Google oauth verification
router.get("/auth", (req, res) => {
  res.redirect(getGoogleAuthURL());
});

// oauth redirected url to get the google user
router.get("/auth/google", async (req, res) => {
  const code = req.query.code;
  console.log("google auth code: ", code);
  const user = await getGoogleUser(code);
  req.session.userId = user.id;
  console.log(req.session);
  console.log(user);
  res.redirect("/api/v1/books/");
});

// Get the new access token from refresh token
router.get("/refresh", (req, res) => {
  res.send(refreshToken());
});

// logout route
router.get("/logout", (req, res) => {});

// Search books from the google book API
router.get("/search", (req, res) => {
  console.log(req.query);
  axios
    .get("https://www.googleapis.com/books/v1/volumes", {
      params: {
        q: req.query.name,
        maxResults: 40,
        startIndex: parseInt(req.query.startIndex),
      },
    })
    .then(({ data }) => {
      // res.status(200).send({ data: data.items, total: data.totalItems });
      res.render("books/index", { data: data });
    })
    .catch((err) => res.status(err.response.status).send(err));
});

// Get all the bookshelves
router.get("/all", (_, res) => {
  axios
    .get(`https://www.googleapis.com/books/v1/mylibrary/bookshelves`, {
      params: {
        key: process.env.API_KEY,
        access_token,
      },
    })
    .then(({ data }) => res.render("books/bookshelves", { data: data }))
    .catch((err) => res.json(err.response.status).send(err));
});

// Add the volume of book to a bookshelf
router.get("/add/:volumeId/", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  axios
    .post(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${req.query.shelfId}/addVolume`,
      null,
      { params: { volumeId: req.params.volumeId, access_token } }
    )
    .then(() => res.send("Successfully added to the shelf!"))
    .catch((err) => res.send(err));
});

//  Get all the volumes in a bookshelf
router.get("/volumes/:shelfId/:volumeCount", (req, res) => {
  axios
    .get(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${req.params.shelfId}/volumes`,
      {
        params: {
          access_token,
        },
      }
    )
    .then(({ data }) => {
      // res.send(data);
      if (data.totalItems !== 0) {
        res.render("books/remove", { data: data, shelfId: req.params.shelfId });
      }
    })
    .catch((err) => res.json(err.response.status).send(err));
});

// remove an post from the bookshelf
router.get("/remove/:volumeId/:shelfId", (req, res) => {
  console.log(req.params);
  axios
    .post(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${req.params.shelfId}/removeVolume`,
      null,
      {
        params: {
          volumeId: req.params.volumeId,
          access_token,
        },
      }
    )
    .then(() => res.send("successfully removed from the bookshelf"))
    .catch((err) => res.json(err.response.status).send(err));
});

module.exports = router;
