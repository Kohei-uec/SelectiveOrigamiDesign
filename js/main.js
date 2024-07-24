import { CP } from "./cp.js";

console.log('main.js load');

const testFile = document.getElementById('test_file')
testFile.addEventListener('change', () => {
    loadFile(testFile.files[0]);
});
function loadFile(file) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const data = CP.parse(reader.result);
        console.log('file load', data);
    }
}




const cp = new CP();
console.log(cp);