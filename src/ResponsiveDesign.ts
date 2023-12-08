import { ModalSystem } from "./Modal";

export namespace ResponsiveElements {
    const header = {
        "nav": <HTMLDivElement>document.querySelector("nav"),
        "brand": <HTMLDivElement>document.querySelector("nav .brand"),
        "links": <HTMLDivElement>document.querySelector("nav .links"),
        "action-nav": <HTMLDivElement>document.querySelector("nav .action-nav"),
        "responsive-menu": <HTMLDivElement>document.querySelector("nav .responsive-menu"),
        "big-title": <HTMLDivElement>document.querySelector(".big-title"),
        "big-colorful-text": <HTMLDivElement>document.querySelector(".big-title .big-colorful-text")
    }

    const footer = {
        "main-content": <HTMLDivElement>document.querySelector(".main-content")
    }

    let navOpen = false;

    export function init() {
        tick();
        window.addEventListener("resize", tick);
        window.addEventListener("mousemove", tickDropdownNav);

        const mainSlideshow = <HTMLIFrameElement>document.getElementById("main-slideshow");
        mainSlideshow.src = "https://docs.google.com/presentation/d/e/2PACX-1vTseQFFzxuE8YVJVj5xKX-DMbW49n_E8K1BAfl3sG9pVMNENLGWMRs1YWFNXyrVEiuJ1ZXYMw_lxxMo/embed?start=true&loop=true&delayms=10000";

        mainSlideshow.addEventListener("load", () => {
            tick();
        });
    }

    function tickDropdownNav(event?: MouseEvent) {
        if (event) {
            const el = <HTMLElement>event.target;
            const parents = [ el ];
    
            let p = el.parentElement;
    
            while (p) {
                parents.push(p);
                p = p.parentElement;
            }
    
            if (navOpen) {
                navOpen = parents.findIndex(e => e.tagName.toLowerCase() == "nav") != -1;
            } else {
                navOpen = parents.findIndex(e => e.id == "toggle-nav") != -1;
            }
        } else {
            navOpen = false;
        }

        ModalSystem.toggleDimmer(navOpen);

        if (navOpen) {
            header["nav"].style.height = "50%";
        } else {
            header["nav"].style.height = "50px";
        }
    }

    function mainSlideshow(responsive: boolean) {
        const mainSlideshow = <HTMLIFrameElement>document.getElementById("main-slideshow");
        const ASPECT_R = 1440 / 839;
        const width = window.innerWidth - 200;
        const height = width / ASPECT_R;
        mainSlideshow.setAttribute("width", width.toString());
        mainSlideshow.setAttribute("height", height.toString());

    }

    export function tick() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const r = w / h < 1;
        headerSection(r);
        mainSlideshow(r);
    }

    function headerSection(responsive: boolean) {
        if (responsive) {
            header["nav"].style.marginTop = "0px";
            header["nav"].style.flexDirection = "column";
            header["nav"].style.width = "100%";
            header["nav"].style.left = "0px";
            header["nav"].style.padding = "20px 0px 20px 0px";
            header["nav"].style.justifyContent = "flex-start";
            header["brand"].style.fontSize = "40px";
            header["responsive-menu"].style.display = "flex";
            header["big-title"].style.margin = "230px 0px 0px 0px";
            header["big-title"].style.textAlign = "center";
            header["big-colorful-text"].style.margin = "auto";
            header["links"].style.flexDirection = "column";
            header["links"].style.flex = "unset";
            header["links"].style.gap = "20px";
            header["links"].style.alignItems = "center";
            header["links"].style.marginTop = "20px";
            header["action-nav"].style.transform = "scale(1.5)";
            header["action-nav"].style.marginTop = "20px";
            footer["main-content"].style.flexDirection = "column";
            tickDropdownNav();
        } else {
            header["nav"].style.marginTop = "40px";
            header["nav"].style.flexDirection = "row";
            header["nav"].style.width = "calc(100% - 16px - 45px)";
            header["nav"].style.left = "20px";
            header["nav"].style.padding = "0px 10px 0px 10px";
            header["nav"].style.justifyContent = "space-between";
            header["brand"].style.fontSize = "20px";
            header["responsive-menu"].style.display = "none";
            header["big-title"].style.margin = "230px 0px 0px 150px";
            header["big-title"].style.textAlign = "left";
            header["big-colorful-text"].style.margin = "unset";
            header["links"].style.flexDirection = "row";
            header["links"].style.flex = "1";
            header["links"].style.gap = "10%";
            header["links"].style.alignItems = "unset";
            header["links"].style.marginTop = "0px";
            header["action-nav"].style.transform = "scale(1)";
            header["action-nav"].style.marginTop = "0px";
            footer["main-content"].style.flexDirection = "row";
        }
    }
}