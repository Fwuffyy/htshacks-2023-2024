import { ResponsiveElements } from "./ResponsiveDesign";

window.addEventListener("load", () => {
    ResponsiveElements.init();
    document.cookie = "xdemoid=" + (Math.floor(Math.random() * 100000));
});

document.getElementById("go")?.addEventListener("click", () => {
    const URL = "http://localhost:25565/assistantexplain";

    const xhr = new XMLHttpRequest();
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.open("POST", URL);
    xhr.send(JSON.stringify({
        "prompt": (<HTMLInputElement>document.getElementById("prompt")).value
    }));

    xhr.addEventListener("readystatechange", () => {
        if (xhr.status == 200 && xhr.readyState == 4) {
            const J = JSON.parse(atob(xhr.responseText));
            document.getElementById("thread")!.innerHTML = J["threadMessages"][0].content.replace("\\n", "<br>");
        }
    });
});
