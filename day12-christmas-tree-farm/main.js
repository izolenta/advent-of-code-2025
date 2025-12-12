const fs = require("fs");

const loadTestData = (isRealData) => {
    const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
    const blocks = raw.split("\n\n");
    const arr = [];
    const lastBlock = blocks[blocks.length - 1].split("\n");
    for (let i = 0; i < lastBlock.length; i++) {
        const parts = lastBlock[i].split(": ");
        const x = parseInt(parts[0].split("x")[0].trim());
        const y = parseInt(parts[0].split("x")[1].trim());
        console.log(parts[1]);
        const values = parts[1].split(" ").map(Number);
        arr.push({sides: [x, y], values});
    }   
    return arr;
}


const calculateStar1 = () => {
    const data = loadTestData(true);
    const cells = [7,7,6,7,7,5];
    let fits = 0;
    for (let i = 0; i < data.length; i++) {
        const square = data[i].sides.reduce((a, b) => a * b);
        let requiredSquare = 0;
        for (let j = 0; j < cells.length; j++) {
            requiredSquare += cells[j]*data[i].values[j];
        }
        if (square < requiredSquare) {
            console.error(`Square ${square} is less than required ${requiredSquare}`);
        }
        else {
            fits++;
        }
    }
    return fits;   
}



console.time("Star 1");
console.log("1⭐:", calculateStar1());
console.timeEnd("Star 1");

// console.time("Star 2");
// console.log("2⭐:", calculateStar2());
// console.timeEnd("Star 2");
