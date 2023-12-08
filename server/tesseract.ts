import Tesseract, { createWorker } from "tesseract.js"

export namespace TesseractAPI {
    export function read(link: string): Promise<string> {
        return new Promise(res => {
            createWorker("eng", 1);
            // createWorker("eng").then(worker => {
            //     // worker.recognize(link);
            // });
        });
    }
}