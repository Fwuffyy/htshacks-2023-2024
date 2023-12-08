import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import sharp from "sharp";
import { Transform } from "stream";
import tesseract from "tesseract.js";

export namespace DataScraper {
    export type CardSet = [ImageCard, ImageCard, ImageCard];

    export function readCards(url: URL | string): Promise<CardSet> {
        return new Promise(resolve => {
            if (url instanceof URL)
                url = url.href;
            
            const filename = `./dist/tesseract/drop-${Date.now()}.png`;

            downloadImage(url, filename, async stream => {
                let card = sharp(stream.read() as Buffer);
                await card.greyscale(true)
                    .toFile(filename);

                card = sharp(filename);

                const { card1, card2, card3 } = seperateIntoThreeCards(card);

                const { c1, c2, c3 } = {
                    c1: new ImageCard("a-" + Date.now(), card1),
                    c2: new ImageCard("b-" + Date.now(), card2),
                    c3: new ImageCard("c-" + Date.now(), card3)
                };

                resolve([c1, c2, c3]);
            }, false);
        });
    }

    export function downloadImage(url: string | URL, filename: string, cb: (result: Transform) => void, saveFile = true) {
        if (url instanceof URL) {
            url = url.href;
        }
        
        let client = url.startsWith("https://") ? https : http;

        client.request(url, res => {
            const stream = new Transform();

            res.on("data", chunk => {
                stream.push(chunk);
            });

            res.on("end", () => {
                if (saveFile)
                    fs.writeFileSync(filename, stream.read());
                cb(stream);
            });
        }).end();
    }

    const toRegion = (left: number, top: number, w: number, h: number) => { return { left, top, width: w, height: h } };
    
    function seperateIntoThreeCards(image: sharp.Sharp) {
        const card1 = image.clone();
        const card2 = image.clone();
        const card3 = image.clone();

        card1.extract(toRegion(0, 0, 284, 419));
        card2.extract(toRegion(276, 0, 284, 419));
        card3.extract(toRegion(550, 0, 284, 419));

        return { card1, card2, card3 };
    }

    export class ImageCard {
        readonly serialName: string;

        public path: string = "";
        public name?: string;
        public series?: string;

        private image: sharp.Sharp;
        private tesseractWorker = tesseract.createWorker();
        
        constructor(serialName: string, image: sharp.Sharp) {
            this.serialName = serialName;
            this.image = image;
            this.path = `./dist/tesseract/${this.serialName}-card.png`;
            this.image.clone().toFile(`./dist/tesseract/${this.serialName}-card.png`);
        }

        public async read() {
            const nameImage = sharp(this.path).extract(toRegion(52, 62, 182, 40));
            const seriesImage = sharp(this.path).extract(toRegion(50, 315, 182, 46));

            // await nameImage.toFile(`./dist/tesseract/${this.serialName}-1.png`);
            // await seriesImage.toFile(`./dist/tesseract/${this.serialName}-2.png`);

            await this.tesseractWorker.load();
            await this.tesseractWorker.loadLanguage("eng");
            await this.tesseractWorker.initialize("eng");

            const nameplateData = await this.tesseractWorker.recognize(await nameImage.toBuffer());
            const seriesplateData = await this.tesseractWorker.recognize(await seriesImage.toBuffer());
            this.name = nameplateData.data.text;
            this.series = seriesplateData.data.text;
            
            await this.tesseractWorker.terminate();

            // this.destroy();

            return {
                name: this.name,
                series: this.series
            };
        }

        public destroy() {
            fs.unlinkSync(this.path);
        }
    }
}