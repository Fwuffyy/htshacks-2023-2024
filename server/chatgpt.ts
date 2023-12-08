import * as fs from "fs";
import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/index.mjs";
import { ThreadMessage } from "openai/resources/beta/threads/index.mjs";

import config from "./secret.json"

interface PersistentStorage {
    threads: Record<string, string>;
}

interface SimpleThreadMessage {
    role: "assistant" | "user";
    content: string[];
    timestamp: number;
}

namespace PersistentStorageManager {
    export const MAIN_ASSISTANT_ID: string = config.assistant_id;
    export let buffer: PersistentStorage;

    export function load() {
        buffer = JSON.parse(fs.readFileSync("./persistent.json", "utf-8"));

        if (!buffer.threads) buffer.threads = {};
    }

    export function save() {
        fs.writeFileSync("./persistent.json", JSON.stringify(buffer));
    }
    
    export function setUser(userID: string, threadID: string) {
        if (!buffer) {
            load();
        }
        
        if (buffer.threads[userID]) return;
        
        buffer.threads[userID] = threadID;

        save();
    }

    export function getUser(userID: string): string {
        if (!buffer) {
            load();
        }
        
        return buffer.threads[userID] || "";
    }
}

export namespace Jerri {
    const openai = new OpenAI({
        apiKey: config.token
    });

    export let assistant: Assistant;

    export function initializeAssistant(): Promise<Assistant> {
        return new Promise(res => {
            openai.beta.assistants.retrieve(PersistentStorageManager.MAIN_ASSISTANT_ID).then(a => {
                assistant = a;
                res(a);
            });
        });
    }

    export function getUserThreadID(userID: string): Promise<string> {
        return new Promise(async res => {
            let threadID = PersistentStorageManager.getUser(userID);

            if (!threadID)  {
                threadID = (await openai.beta.threads.create()).id;
                console.log(`Created new thread id: ${threadID}`);
            }
        
            PersistentStorageManager.setUser(userID, threadID);
            
            res(threadID);
        });
    }

    export function getThreadMessages(threadID: string): Promise<ThreadMessage[]> {
        return new Promise(async res => {
            const page = await openai.beta.threads.messages.list(threadID);
            res(page.getPaginatedItems());
        });
    }
    
    function promptPoll(threadID: string, runID: string): Promise<boolean> {
        return new Promise(async finalResolve => {
            const run = await openai.beta.threads.runs.retrieve(threadID, runID);
            if (run.status == "completed") {
                finalResolve(true);
            } else if (run.status == "in_progress" || run.status == "queued") {
                setTimeout(async () => {
                    finalResolve(await promptPoll(threadID, runID));
                }, 100);
            } else {
                finalResolve(false);
            }
        });
    }

    interface PromptedResult {
        threadMessages: SimpleThreadMessage[];
        success: boolean;
    }

    export function prompt(question: string, threadID: string): Promise<PromptedResult> {
        return new Promise(async res => {
            await openai.beta.threads.messages.create(threadID, {
                role: "user",
                content: question,
            });

            const run = await openai.beta.threads.runs.create( threadID, { assistant_id: assistant.id } );

            promptPoll(threadID, run.id).then(async success => {
                const simpleResult = [];
                const threadMessages = await getThreadMessages(threadID);

                for (const message of threadMessages) {
                    let simpleMsg: SimpleThreadMessage = {
                        "role": message.role,
                        "timestamp": message.created_at * 1000,
                        "content": []
                    };

                    for (const content of message.content) {
                        switch (content.type) {
                            case "text":
                                simpleMsg.content.push(content.text.value);
                                break;
                        }
                    }

                    simpleResult.push(simpleMsg);
                }

                res({
                    "threadMessages": simpleResult,
                    "success": success
                });
            });
        });
    }
}