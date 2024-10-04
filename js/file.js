import { CP } from "./cp.js";

export async function getFileText(path) {
    return await(await fetch(path)).text()
}

export async function loadCP(path) {
    const resp = await fetch(path);
    const text = await resp.text();
    return CP.parse(text);
}