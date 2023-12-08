import express from "express"
import { TesseractAPI} from "./tesseract";
import Tesseract, {createWorker} from "tesseract.js";


const app = express();

app.listen(25565, () => {
    console.log("Listening on :25565");
    /*TesseractAPI.read("https://tesseract.projectnaptha.com/img/eng_bw.png").then(s => {
        console.log(s);
    });*/
    (async () => {
        const worker = await createWorker();
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        /*const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
        console.log(ret.data.text);
        await worker.terminate();*/
      })();
});