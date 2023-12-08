import express from "express"

import { Jerri } from "./chatgpt";
import { APIServer } from "./server";

const app = express();

Jerri.initializeAssistant().then(async () => {
    app.listen(25565, async() => {
        console.log("Listening on :25565");
    });

    APIServer.init(app);
});
