import express from "express"
import {chatgpt} from "./chatgpt";

const app = express();


app.listen(25565, async() => {
    console.log("Listening on :25565");
    
    const testUserID = "dev";
    let ans = await chatgpt.ask("what does completing the square mean?",testUserID);
    console.log(ans);
});
