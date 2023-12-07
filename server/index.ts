import express from "express"
import { TesseractAPI } from "./tesseract";

const app = express();

TesseractAPI.read(); // idk

app.listen(25565, () => {
    console.log("Listening on :25565");
});