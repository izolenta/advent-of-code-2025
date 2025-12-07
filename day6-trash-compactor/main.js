const fs = require("fs");

class DataParser {
    static load(isRealData) {
        const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
        const lines = raw.split("\n");
        return lines;
    }

    static parseStar1(lines) {
        const opsLine = lines[lines.length - 1];
        const ops = opsLine.trim().split(/\s+/);
        const numRows = lines.length - 1;
        const columns = []; 
        for (let i = 0; i < numRows; i++) {
            const rowNums = lines[i].trim().split(/\s+/);
            for (let j = 0; j < rowNums.length; j++) {
                if (!columns[j]) columns[j] = [];
                columns[j].push(Number(rowNums[j]));
            }
        }
        
        return { columns, ops };
    }
}

const calculateStar1 = (lines) => {
    const { columns, ops } = DataParser.parseStar1(lines);
    let total = 0;

    for (let c = 0; c < columns.length; c++) {
        const nums = columns[c];
        const op = ops[c];
        
        if (nums.length === 0) continue;
        let result = nums[0];
        if (op === '+') {
            for (let i = 1; i < nums.length; i++) {
                result += nums[i];
            }
        } else if (op === '*') {
             for (let i = 1; i < nums.length; i++) {
                result *= nums[i];
            }
        }
        
        total += result;
    }
    return total;
};

const calculateStar2 = (lines) => {
    let res = 0;
    let currentGroup = [];

    const width = lines[0].length;
    const height = lines.length;
    
    for (let i = width - 1; i >= 0; i--) {
        let colDigits = "";
        let foundOp = null;
        
        for (let j = 0; j < height; j++) {
            const char = lines[j][i];
            if (char >= '0' && char <= '9') {
                colDigits += char;
            } else if (char === '+' || char === '*') {
                foundOp = char;
            }
        }
        
        if (foundOp) {
            if (colDigits.length > 0) {
                 currentGroup.push(BigInt(colDigits));
            }
            if (currentGroup.length > 0) {
                let groupRes = currentGroup[0];
                for (let k = 1; k < currentGroup.length; k++) {
                    if (foundOp === '+') groupRes += currentGroup[k];
                    else groupRes *= currentGroup[k];
                }
                res += Number(groupRes);
            }
            currentGroup = [];
            i--;
        } else {
            if (colDigits.length > 0) {
                currentGroup.push(BigInt(colDigits));
            }
        }
    }
    
    return res;
};

const main = () => {
    const lines = DataParser.load(true);

    console.time("Star 1");
    console.log("1⭐:", calculateStar1(lines));
    console.timeEnd("Star 1");

    console.time("Star 2");
    console.log("2⭐:", calculateStar2(lines));
    console.timeEnd("Star 2");
};

main();
