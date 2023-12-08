import Tesseract, { createWorker } from "tesseract.js";

export namespace TesseractAPI {
    export async function read(link: string): Promise<string> {
        console.log("Link:", link);
        try {
            const worker = await createWorker();
            const ret = await worker.recognize(link);

            // Cleanup
            await worker.terminate();

            return ret.data.text;
        } catch (error) {
            console.error("Error in Tesseract read:", error);
            throw error; // rethrow the error
        }
    }
}


