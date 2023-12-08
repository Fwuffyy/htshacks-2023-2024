import OpenAI from "openai";

const fs = require("fs");
const path = "userIDThreads.json";
//const token = require("./secret.json");
// @ts-ignore
import token from "./secret.json" 

const openai = new OpenAI({
    apiKey: token["token"],
});

var userIDThreads = require("./userIDThreads.json");

function readJsonFile(filename:string) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (error:any) {
        console.error(`Error reading ${filename}: ${error.message}`);
        return null;
    }
}

function appendToJsonFile(filename:string, newKeyValuePairs:any) {
    try {
        // Read existing data from the file
        const existingData = readJsonFile(filename) || {};

        // Merge existing data with new key-value pairs
        const newData = { ...existingData, ...newKeyValuePairs };

        // Write the updated data back to the file
        fs.writeFileSync(filename, JSON.stringify(newData, null, 2));

        console.log(`Data appended to ${filename} successfully.`);
    } catch (error:any) {
        console.error(`Error appending data to ${filename}: ${error.message}`);
    }
}

let assistant:any;
(async () => {
    assistant = await openai.beta.assistants.create({
        name: "jerry",
        instructions: "You are an AI designed to assist with neurodiverse middle schoolers who need your help.",
        //tools: [{ type: "code_interpreter" }],
        model: "gpt-4-1106-preview"
    });
})()


export namespace chatgpt {
    export async function ask(query: string, userID: string) {
        let jsonData:Record<string,string> = readJsonFile(path);
        if (!jsonData.hasOwnProperty(userID)) {
            const thread = await openai.beta.threads.create();
            const newDataToAppend = {
                userID:thread.id,
            }
            appendToJsonFile(path, newDataToAppend);
        }

        const myThread = await openai.beta.threads.retrieve(jsonData[userID]);

        const message = await openai.beta.threads.messages.create(
            myThread.id,
            {
                role: "user",
                content: query,
            }
        )

        const run = await openai.beta.threads.runs.create(
            myThread.id,
            {
                assistant_id: assistant.id,
            }
        )

        const messages = await openai.beta.threads.messages.list(
            myThread.id,
        );
        return messages;
    }
}