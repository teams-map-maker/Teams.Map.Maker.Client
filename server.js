require('dotenv').config();
const express = require("express");
const REACT_APP_API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const port = process.env.PORT || 8080;

const app = express();

app.listen(port, function() {
    console.log("Express server listening on port " + port);
});