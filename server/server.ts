import express from "express"
import cookieparser from "cookie-parser";
import { Jerri } from "./chatgpt";

export namespace APIServer {
    export function init(app: express.Express) {
        app.use(express.json());
        app.use(cookieparser());

        app.post("/assistantexplain", (req, res) => {
            const demoUser = `demo-${req.cookies["xdemoid"]}`;
            let prompt = "";
            
            if (req.body.encoded) {
                prompt = Buffer.from(req.body.prompt, "base64").toString("binary");
            } else {
                prompt = req.body.prompt;
            }
            
            Jerri.getUserThreadID(demoUser).then(async threadID => {
                const response = await Jerri.prompt(prompt, threadID);
                
                res.status(200).json({
                    "data": Buffer.from(JSON.stringify(response), "binary").toString("base64")
                });
            });
        });

        app.post("/imageexplain", (req, res) => {
        });
    }
}