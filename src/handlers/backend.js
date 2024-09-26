const express = require('express');
const VideoRoute = require("../routes/video.route.js");
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/', VideoRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})