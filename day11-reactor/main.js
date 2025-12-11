const fs = require("fs");

const loadTestData = (isRealData) => {
    const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
    const blocks = raw.split("\n");
    let start = 0;
    let graph = new Map();
    for (let i = 0; i < blocks.length; i++) {
        const parts = blocks[i].split(": ");
        const node = parts[0];
        const outs = parts[1].split(" ");
        graph.set(node, outs);
    }
    return graph;
}

const findNumberOfPathsBetween = (graph, startNode, endNode, midnodes = []) => {
    const memo = new Map();
    const finalMask = (1 << midnodes.length) - 1;
    const midnodeMap = new Map(midnodes.map((node, i) => [node, i]));

    const dfs = (node, mask) => {
        if (midnodeMap.has(node)) {
            mask |= (1 << midnodeMap.get(node));
        }

        if (node === endNode) {
            return mask === finalMask ? 1 : 0;
        }

        const state = `${node}|${mask}`;
        if (memo.has(state)) {
            return memo.get(state);
        }

        let pathsCnt = 0;
        const neighbors = graph.get(node) || [];
        for (let next of neighbors) {
            pathsCnt += dfs(next, mask);
        }

        memo.set(state, pathsCnt);
        return pathsCnt;
    }

    return dfs(startNode, 0);
}

const calculateStar1 = () => {
    const data = loadTestData(true);
    return findNumberOfPathsBetween(data, "you", "out");
}

const calculateStar2 = () => {
    const data = loadTestData(true);
    return findNumberOfPathsBetween(data, "svr", "out", ["dac", "fft"]); 
}

const main = async () => {
    console.time("Star 1");
    console.log("1⭐:", calculateStar1());
    console.timeEnd("Star 1");

    console.time("Star 2");
    console.log("2⭐:", calculateStar2());
    console.timeEnd("Star 2");
}

main();
