require("dotenv").config();

const express = require("express");
const res = require("express/lib/response");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/home", (request, response, next) => {
  response.render("home");
});

app.get("/artists", (request, response, next) => {
  spotifyApi
    .searchArtists(request.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      response.render("artists", {
        artists: data.body,
        artist: request.query.artist,
      });
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
