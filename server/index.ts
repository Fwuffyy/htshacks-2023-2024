import express from "express";

import { TesseractAPI } from "./tesseract";

const port = 25565;
const app = express();

console.log("Loading tesseract");

TesseractAPI.init().then(() => {
    app.listen(port, () => {
        console.log("Listening on :" + port);
    });

    (async () => {
        console.log(await TesseractAPI.read("https://i.ytimg.com/vi/3NxTbAxWxqA/maxresdefault.jpg"));
    })();
});