import { FOLDView } from "../js/fold_view.js";

const canvas = document.getElementById('myCanvas');
const fold_view = new FOLDView(canvas, null);
fold_view.renderer.setSize(700, 700);
const fold = await fold_view.setFOLD("../cp_data/face01_90.fold");

const textarea = document.getElementById('txt');
textarea.textContent = JSON.stringify(fold.faceOrders)