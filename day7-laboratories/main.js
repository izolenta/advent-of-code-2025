const fs = require("fs");

const loadTestData = (isRealData) => {
    const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
    const blocks = raw.split("\n");
    const start = blocks[0].indexOf("S");
    return {blocks, start};
}

const calculateStar1 = () => {
    const {blocks, start} = loadTestData(true);
    let beams = new Set([start]);
    let splits = 0;
    for (let i = 1; i < blocks.length; i++) {
        const line = blocks[i];
        const nextBeams = new Set();
        for (const beam of beams) {
            if (line[beam] === "^") {
                splits++;
                nextBeams.add(beam - 1);
                nextBeams.add(beam + 1);
            } else {
                nextBeams.add(beam);
            }
        }
        beams = nextBeams;
    }
    return splits;
}

const calculateStar2 = () => {
    const {blocks, start} = loadTestData(true);
    let beams = new Map();
    beams.set(start, 1);
    for (let i = 1; i < blocks.length; i++) {
        const line = blocks[i];
        const nextBeams = new Map();
        for (const [pos, count] of beams) {
            if (line[pos] === "^") {
                nextBeams.set(pos - 1, (nextBeams.get(pos - 1) || 0) + count);
                nextBeams.set(pos + 1, (nextBeams.get(pos + 1) || 0) + count);
            } else {
                nextBeams.set(pos, (nextBeams.get(pos) || 0) + count);
            }
        }
        beams = nextBeams;
    }
    return [...beams.values()].reduce((a, b) => a + b, 0);
}

console.time("Star 1");
console.log("1⭐:", calculateStar1());
console.timeEnd("Star 1");

console.time("Star 2");
console.log("2⭐:", calculateStar2());
console.timeEnd("Star 2");
