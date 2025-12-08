const fs = require("fs");

const loadTestData = (isRealData) => {
    const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
    const blocks = raw.split("\n");
    const arr = [];
    for (let i = 0; i < blocks.length; i++) {
        const parts = blocks[i].split(",");
        arr.push([Number(parts[0]), Number(parts[1]), Number(parts[2])]);
    }
    return { data: arr, connections: isRealData ? 1000 : 10 };
}

const find = (parent, i) => {
    let root = i;
    while (root !== parent[root]) {
        root = parent[root];
    }
    let curr = i;
    while (curr !== root) {
        let next = parent[curr];
        parent[curr] = root;
        curr = next;
    }
    return root;
}

const union = (parent, size, i, j) => {
    const rootI = find(parent, i);
    const rootJ = find(parent, j);
    if (rootI !== rootJ) {
        if (size[rootI] < size[rootJ]) {
            parent[rootI] = rootJ;
            size[rootJ] += size[rootI];
        } else {
            parent[rootJ] = rootI;
            size[rootI] += size[rootJ];
        }
        return true;
    }
    return false;
}

const calculateSquaredDistance = (p1, p2) => {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    const dz = p1[2] - p2[2];
    return dx * dx + dy * dy + dz * dz;
}

const generateSortedEdges = (points) => {
    const edges = [];
    const n = points.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            edges.push({
                u: i,
                v: j,
                dist: calculateSquaredDistance(points[i], points[j])
            });
        }
    }
    return edges.sort((a, b) => a.dist - b.dist);
}

const calculateStar1 = () => {
    const { data: points, connections } = loadTestData(true);
    const n = points.length;
    const parent = [];
    const size = [];
    for (let i = 0; i < n; i++) {
        parent[i] = i;
        size[i] = 1;
    }
    const edges = generateSortedEdges(points);

    const limit = Math.min(connections, edges.length);
    for (let k = 0; k < limit; k++) {
        union(parent, size, edges[k].u, edges[k].v);
    }

    const componentSizes = [];
    for (let i = 0; i < n; i++) {
        if (parent[i] === i) {
            componentSizes.push(size[i]);
        }
    }
    componentSizes.sort((a, b) => b - a);
    const top3 = componentSizes.slice(0, 3);
    console.log(top3);
    return top3.reduce((a, b) => a * b, 1);
}

const calculateStar2 = () => {
    const { data: points } = loadTestData(true);
    const n = points.length;
    const parent = [];
    const size = [];
    let count = n;
    for (let i = 0; i < n; i++) {
        parent[i] = i;
        size[i] = 1;
    }
    const edges = generateSortedEdges(points);

    for (const edge of edges) {
        if (union(parent, size, edge.u, edge.v)) {
            count--;
        }
        if (count === 1) {
            const p1 = points[edge.u];
            const p2 = points[edge.v];
            return p1[0] * p2[0];
        }
    }
}

console.time("Star 1");
console.log("1⭐:", calculateStar1());
console.timeEnd("Star 1");

console.time("Star 2");
console.log("2⭐:", calculateStar2());
console.timeEnd("Star 2");

