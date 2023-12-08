import axios from "axios"
import sharp from "sharp"
import tesseract from "tesseract.js"

export namespace TesseractAPI {
    export const worker = tesseract.createWorker();

    export async function init() {
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
    }

    export async function read(link: string): Promise<tesseract.Block[]> {
        return new Promise(resultingText => {
            axios.get(link, { "responseType": "arraybuffer" }).then(async (res) => {
                const image = sharp(res.data).grayscale();
                const data = await worker.recognize(await image.toBuffer());
                resultingText(data.data.blocks);
            });
        });
    }
}


