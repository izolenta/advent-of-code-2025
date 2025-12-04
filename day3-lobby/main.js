const fs = require("fs");

const loadTestData = (isRealData) => {
    const data = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8");
    return data.trim().split("\n");
}

const findMax = (str, start, end) => {
    let max = -1;
    let pos = -1;
    for (let i = start; i < end; i++) {
        const digit = parseInt(str[i]);
        if (digit > max) {
            max = digit;
            pos = i;
        }
    }
    return { max, pos };
}

const calculateStar1 = () => {
    const data = loadTestData(true);
    let sum = 0;
    for (const line of data) {
        let numStr = "";
        const { max, pos } = findMax(line, 0, line.length);
        
        if (pos < line.length - 1) {
            const { max: newMax } = findMax(line, pos + 1, line.length);
            numStr = `${max}${newMax}`;
        } else {
            const { max: newMax } = findMax(line, 0, pos);
            numStr = `${newMax}${max}`;
        }
        sum += parseInt(numStr);
    }
    return sum;
}

const calculateStar2 = () => {
    const data = loadTestData(true);
    let sum = 0;
    for (const line of data) {
        let numStr = "";
        let position = 0;
        for (let j = 0; j < 12; j++) {
            const end = line.length - 11 + j;
            const { max, pos } = findMax(line, position, end);
            numStr += max;
            position = pos + 1;
        }
        sum += parseInt(numStr);
    }
    return sum;
}

console.log("1⭐:", calculateStar1());
console.log("2⭐:", calculateStar2());
