import ear from "rabbit-ear"

const svg = ear.svg();
document.getElementById('svg-wrap').appendChild(svg)

// kabuto cp
const kabuto = {"frame_classes":["creasePattern"],"vertices_coords": [[0.5,0],[0.5,0.5],[1,0.5],[0.25,0.25],[0,0.5],[0.5,1],[0.75,0.75],[0.14644660940672669,0],[1,0.8535533905932734],[0.625,0],[1,0.375],[0,0],[1,1],[0.75,0],[1,0.25],[0,0.14644660940672669],[0.8535533905932734,1],[0,1],[1,0]],"edges_vertices": [[0,1],[1,2],[3,4],[0,2],[5,6],[5,4],[3,7],[6,8],[9,10],[1,5],[4,1],[0,3],[11,3],[3,1],[6,2],[1,6],[6,12],[13,14],[3,15],[6,16],[5,17],[17,4],[13,18],[18,14],[11,7],[7,0],[2,8],[8,12],[4,15],[15,11],[0,9],[9,13],[14,10],[10,2],[12,16],[16,5]],"edges_assignment": ["M","M","M","M","M","M","M","M","M","V","V","V","V","V","V","V","V","V","V","V","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B"],"faces_vertices": [[5,4,1],[1,0,2],[4,5,17],[2,0,9,10],[10,9,13,14],[14,13,18],[3,7,0],[8,6,2],[0,1,3],[1,2,6],[4,3,1],[6,5,1],[3,4,15],[5,6,16],[11,3,15],[6,12,16],[7,3,11],[6,8,12]]};

svg.size(0.75, 0.4)
	.padding(0.05)
	.strokeWidth(0.005);

const folded = ear.graph(kabuto).flatFolded();
const result = ear.layer(folded);
console.log(result.count());
folded.faces_layer = result.compile(1,1);
console.log(result.compile(1,1));

svg.origami(folded).translate(-0.333, 0.025).rotate(-45);