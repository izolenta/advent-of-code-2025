const fs = require("fs");

const loadTestData = (isRealData) => {
    const data = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8");
    const lines = data.trim().split("\n");
    return lines.map(line => ({
        direction: line.charAt(0),
        steps: parseInt(line.substring(1))
    }));
}

const scrollSafe = (position, direction, steps) => {
    let crossings = 0;
    let newPos = position;

    if (direction === "L") {
        newPos -= steps;
        if (newPos < 0) {
            const wraps = Math.ceil(Math.abs(newPos) / 100);
            crossings = wraps;
            if (position === 0) {
                crossings -= 1;
            }
        }
    } else {
        newPos += steps;
        if (newPos >= 100) {
            crossings = Math.floor((newPos - 1) / 100);
        }
    }

    let finalPos = newPos % 100;
    if (finalPos < 0) finalPos += 100;
    
    return { position: finalPos, crossings };
}

const star = (countCrossings) => {
    const data = loadTestData(true);
    let pos = 50;
    let zeroPointings = 0;
    for (const step of data) {
        const { position: newpos, crossings } = scrollSafe(pos, step.direction, step.steps);
        if (countCrossings) {
            zeroPointings += crossings;
        }
        if (newpos === 0) {
            zeroPointings++;
        }
        pos = newpos;
    }
    return zeroPointings;
}

const star1 = () => star(false);
const star2 = () => star(true);

console.log("1⭐:", star1());
console.log("2⭐:", star2());
