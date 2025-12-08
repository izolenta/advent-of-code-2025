const fs = require("fs");

const loadTestData = (isRealData) => {
    const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
    const blocks = raw.split("\n");
    const arr = [];
    for (let i = 0; i < blocks.length; i++) {
        arr.push({point: blocks[i].split(",").map(Number), junctionId: i+1});
    }
    return {data: arr, connections: isRealData ? 1000 : 10};
}

const calculate3DDistance = (point1, point2) => {
    return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2 + (point1[2] - point2[2]) ** 2);
}

const pointsToString = (point1, point2) => {
    return `${point1.point.join(",")}-${point2.point.join(",")}`;
}

const findNextConnection = (data, links) => {
    let minDistance = Infinity;
    let index1 = -1;
    let index2 = -1;
    for (let i = 0; i < data.length; i++) {
        const point = data[i];
        for (let j = i + 1; j < data.length; j++) {
            const otherPoint = data[j];
            const distance = calculate3DDistance(point.point, otherPoint.point);
            if (distance < minDistance && !links.has(pointsToString(point, otherPoint))) {
                minDistance = distance;
                index1 = i;
                index2 = j;
            }
        }
    }
    return { index1, index2 };
};

const mergeClusters = (data, index1, index2) => {
    const targetId = data[index1].junctionId;
    const sourceId = data[index2].junctionId;
    if (targetId !== sourceId) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].junctionId === sourceId) {
                data[i].junctionId = targetId;
            }
        }
    }
};

const performStep = (data, links) => {
    const { index1, index2 } = findNextConnection(data, links);
    mergeClusters(data, index1, index2);
    links.add(pointsToString(data[index1], data[index2]));
    return { index1, index2 };
};

const calculateStar1 = () => {
    const {data, connections} = loadTestData(true);
    const links = new Set();
    let tempData = [...data];
    for (let k=0; k<connections; k++) {
        performStep(tempData, links);
    }
    const map = new Map();
    for (let i = 0; i < tempData.length; i++) {
        const point = tempData[i];
        if (!map.has(point.junctionId)) {
            map.set(point.junctionId, 1);
        } else {
            map.set(point.junctionId, map.get(point.junctionId) + 1);
        }
    }
    const values = [...map.values()].sort((a, b) => b - a).slice(0, 3);
    console.log(values);
    return values.reduce((a, b) => a * b, 1);
}

const calculateStar2 = () => {
    const {data} = loadTestData(true);
    const links = new Set();
    let tempData = [...data];
    while (true) {
        const { index1, index2 } = performStep(tempData, links);
        if (tempData.every(point => point.junctionId === tempData[0].junctionId)) {
            return tempData[index1].point[0] * tempData[index2].point[0];
        }
    }
}

console.time("Star 1");
console.log("1⭐:", calculateStar1());
console.timeEnd("Star 1");

console.time("Star 2");
console.log("2⭐:", calculateStar2());
console.timeEnd("Star 2");
