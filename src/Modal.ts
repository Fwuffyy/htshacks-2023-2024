export namespace ModalSystem {
    export const DIMMER_ELEMENT = document.getElementById("modal-dim")!;

    export function toggleDimmer(toggle: boolean) {
        DIMMER_ELEMENT.style.opacity = toggle ? "1" : "0";
    }
}