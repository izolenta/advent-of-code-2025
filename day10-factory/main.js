const fs = require("fs");
const highsFactory = require("highs");
const loadTestData = (isRealData) => {
    const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
    const blocks = raw.split("\n");
    const data = [];
    for (let i = 0; i < blocks.length; i++) {
        const parts = blocks[i].split(" ");
        const rawPos = parts[0].replaceAll("[", "").replaceAll("]", "");
        const required = parsePosition(rawPos);
        const joltage = parseJoltage(parts[parts.length - 1]);
        const buttons = [];
        const length = rawPos.length;
        for (let j = 1; j < parts.length - 1; j++) {
            buttons.push(parseButtons(parts[j], length));
        }
        data.push({required, joltage, buttons});
    }
    return data;
}

const parsePosition = (str) => {
    const bin = '0b' + str.replaceAll(".", "0").replaceAll("#", "1");
    return Number(bin, 2);
}

const parseJoltage = (str) => {
    const jolts = str.replaceAll("{", "").replaceAll("}", "").split(",").map(Number);
    return jolts;
}

const parseButtons = (str, length) => {
    let res = 0;
    const positions = str.replaceAll("(", "").replaceAll(")", "").split(",").map(Number);
    for (const pos of positions) {
        res |= 1 << (length - 1 - pos);
    }
    return res;
}

const leastNumberOfPressRequired = (current, required, buttons, steps, min, startIndex = 0) => {
    if (current === required) {
        return steps;
    }
    if (steps >= min) {
        return min;
    }
    
    let newMin = min;
    for (let i = startIndex; i < buttons.length; i++) {
        let next = current ^ buttons[i];        
        newMin = Math.min(newMin, leastNumberOfPressRequired(next, required, buttons, steps + 1, newMin, i + 1));
    }
    return newMin;
}

const getSetBitPositions = (num) => {
  const positions = [];
  let i = 0;

  while (num !== 0) {
    if (num & 1) positions.push(i);
    num >>= 1;
    i++;
  }

  return positions;
}

const calculateStar1 = () => {
    const data = loadTestData(true);
    let sum = 0;
    for (let next of data) {
        sum += leastNumberOfPressRequired(0, next.required, next.buttons, 0, Infinity, 0);
    }
    return sum;
}

const calculateStar2 = (highs) => {
    const data = loadTestData(true);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        const next = data[i];
        const required = [...next.joltage].reverse();
        const variableNames = next.buttons.map((_, idx) => `x${idx}`);
        
        let problem = `Minimize\n obj: ${variableNames.join(" + ")}\nSubject To\n`;
        
        for (let j = 0; j < required.length; j++) {
            const terms = [];
            for (let k = 0; k < next.buttons.length; k++) {
                if (getSetBitPositions(next.buttons[k]).includes(j)) {
                    terms.push(variableNames[k]);
                }
            }
            if (terms.length > 0) {
                problem += ` c${j}: ${terms.join(" + ")} = ${required[j]}\n`;
            } else if (required[j] !== 0) {
                problem += ` c${j}: 0 = ${required[j]}\n`;
            }
        }
        
        problem += "Bounds\n";
        variableNames.forEach(v => {
            problem += ` ${v} >= 0\n`;
        });
        
        problem += "General\n";
        variableNames.forEach(v => {
             problem += ` ${v}\n`;
        });
        
        problem += "End";
        //console.log(problem);
        const sol = highs.solve(problem);
        // console.log(sol);
        if (sol.Status === "Optimal") {
            sum += sol.ObjectiveValue;
        } else {
            console.error(`No solution ${i}: ${sol.Status}`);
        }
    }
    return sum;
}

const main = async () => {
    console.time("Star 1");
    console.log("1⭐:", calculateStar1());
    console.timeEnd("Star 1");

    const highs = await highsFactory();
    console.time("Star 2");
    console.log("2⭐:", calculateStar2(highs));
    console.timeEnd("Star 2");
}

main();
