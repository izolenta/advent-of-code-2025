const fs = require("fs");

const loadTestData = (isRealData) => {
    const data = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8");
    const lines = data.trim().split(",");
    return lines.map(line => {
        var range = line.split("-");
        return {
            start: parseInt(range[0]),
            end: parseInt(range[1])
        };
    });
}

const getFirstpart = (id) => id.substring(0, id.length / 2);

const checkAllNumbersWithSamePartsInRange = (rangeArray) => {
    var count = 0;
    rangeArray.forEach(range => {
        var startpart = getFirstpart(range.start.toString());
        if (startpart.length === 0) startpart = "0";
        var twopart = `${startpart}${startpart}`;
        while (Number.parseInt(twopart) <= range.end) {
            if (Number.parseInt(twopart) >= range.start) {
                count+=Number.parseInt(twopart);
            }
            startpart++
            twopart = `${startpart}${startpart}`;
        }
    });
    return count;
}

const findAllNumbersContainingSequenceInRange = (rangeArray) => {
    let count = 0;
    const foundNumbers = new Set();

    let maxEnd = 0;
    rangeArray.forEach(range => {
        if (range.end > maxEnd) maxEnd = range.end;
    });

    const maxDigits = maxEnd.toString().length;

    for (let len = 1; len <= maxDigits / 2; len++) {
        const startSeed = Math.pow(10, len - 1);
        const endSeed = Math.pow(10, len) - 1;
        
        for (let s = startSeed; s <= endSeed; s++) {
            let sStr = s.toString();
            let currentStr = sStr + sStr;
            
            while (currentStr.length <= maxDigits) {
                let val = parseInt(currentStr);
                
                if (val > maxEnd) break;
                
                let inRange = false;
                for (const range of rangeArray) {
                    if (val >= range.start && val <= range.end) {
                        inRange = true;
                        break;
                    }
                }
                
                if (inRange) {
                    foundNumbers.add(val);
                }
                
                currentStr += sStr;
            }
        }
    }
    
    foundNumbers.forEach(v => count += v);
    return count;
}

const star1 = () => checkAllNumbersWithSamePartsInRange(loadTestData(true));
const star2 = () => findAllNumbersContainingSequenceInRange(loadTestData(true));

console.log("1⭐:", star1());
console.log("2⭐:", star2());
