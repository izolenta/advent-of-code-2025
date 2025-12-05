const fs = require("fs");

const loadTestData = (isRealData) => {
    const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
    const blocks = raw.split("\n\n");
    const ranges = blocks[0].split("\n").map(line => line.split("-").map(Number));
    const ingredients = blocks[1].split("\n").map(Number);
    return {ranges, ingredients};
}

const calculateStar1 = () => {
    const {ranges, ingredients} = loadTestData(false);
    let fresh = 0;
    for (let next of ingredients) {
        if (ranges.some(([min, max]) => next >= min && next <= max)) {
            fresh++;
        }
    }
    return fresh;
}

const optimizeRanges = () => {
    const {ranges} = loadTestData(true);
    ranges.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < ranges.length-1; i++) {
        if (ranges[i][1] + 1 >= ranges[i + 1][0]) {
            ranges[i][1] = Math.max(ranges[i][1], ranges[i + 1][1]);
            ranges.splice(i + 1, 1);
            i--;
        }
    }
    return ranges;
}

const calculateStar2 = () => {
    const ranges = optimizeRanges();
    let count = 0;
    for (let [min, max] of ranges) {
        count += max - min + 1;
    }
    return count;
}

console.time("Star 1");
console.log("1⭐:", calculateStar1());
console.timeEnd("Star 1");

console.time("Star 2");
console.log("2⭐:", calculateStar2());
console.timeEnd("Star 2");
