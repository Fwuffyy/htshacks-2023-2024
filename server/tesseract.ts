import { createWorker } from "tesseract.js"

export namespace TesseractAPI {
    // Code here...

    export async function read(link:string) {
        const worker = await createWorker();
        const ret = await worker.recognize(link);
        return ret.data.text;
    }


    
}