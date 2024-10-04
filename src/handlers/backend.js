const express = require('express');
const VideoRoute = require("../routes/video.route.js");
const GameRoute = require("../routes/game.route.js");
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/', VideoRoute);
app.use('/', GameRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})