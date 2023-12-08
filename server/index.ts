import express from "express"
import { TesseractAPI } from "./tesseract";
import Tesseract from "tesseract.js";

const app = express();

//TesseractAPI.read(); // idk

(async () => {
    const worker = await Tesseract.createWorker("eng");
    const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    console.log(ret.data.text);
    await worker.terminate();
  })();

// app.listen(25565, () => {
//     console.log("Listening on :25565");
//     console.log("obamna");
//     TesseractAPI.read("https://tesseract.projectnaptha.com/img/eng_bw.png").then(s => {
//         console.log(s);
//     });
// });