const fs = require("fs");

const loadTestData = (isRealData) => {
    const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
    const lines = raw.split(/\r?\n/);
    const width = lines[0].length;
    const height = lines.length;
    const totalSize = width * height;
    
    const data = new Uint8Array(totalSize);
    
    for (let i = 0; i < height; i++) {
        const line = lines[i];
        for (let j = 0; j < width; j++) {
            if (line[j] === '@') {
                data[i * width + j] = 1;
            }
        }
    }
    
    return {
        data,
        width,
        height,
        totalSize
    };
}

const getNeighborsCount = (data, idx, width, totalSize) => {
    let count = 0;
    const x = idx % width;
        
    if (idx >= width) {
        if (x > 0 && data[idx - width - 1]) count++;
        if (data[idx - width]) count++;
        if (x < width - 1 && data[idx - width + 1]) count++;
    }
    
    if (x > 0 && data[idx - 1]) count++;
    if (x < width - 1 && data[idx + 1]) count++;
    
    if (idx < totalSize - width) {
        if (x > 0 && data[idx + width - 1]) count++;
        if (data[idx + width]) count++;
        if (x < width - 1 && data[idx + width + 1]) count++;
    }
    
    return count;
}

const calculateStar1 = () => {
    const {data, width, totalSize} = loadTestData(true);
    let acc = 0;
    for (let i = 0; i < totalSize; i++) {
        if (data[i] === 1) {
            if (getNeighborsCount(data, i, width, totalSize) < 4) {
                acc++;
            }
        }
    }
    return acc;
}

const calculateStar2 = () => {
    const {data, width, totalSize} = loadTestData(true);
    let sum = 0;
    let i = 0;
    
    while (i < totalSize) {
        if (data[i] === 1) {
            if (getNeighborsCount(data, i, width, totalSize) < 4) {
                data[i] = 0;
                sum++;
                
                const backtrack = i - width - 1;
                i = backtrack < 0 ? 0 : backtrack;
                continue;
            }
        }
        i++;
    }

    return sum;
}

console.time("Star 1");
console.log("1⭐:", calculateStar1());
console.timeEnd("Star 1");

console.time("Star 2");
console.log("2⭐:", calculateStar2());
console.timeEnd("Star 2");
