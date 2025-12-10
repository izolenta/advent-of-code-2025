const fs = require("fs");

const loadTestData = (isRealData) => {
    const raw = fs.readFileSync(isRealData ? "real.data" : "test.data", "utf8").trim();
    const blocks = raw.split("\n");
    const arr = [];
    for (let i = 0; i < blocks.length; i++) {
        arr.push({point: blocks[i].split(",").map(Number)});
    }
    return arr;
}

const calculateSquare = (point1, point2) => {
    return Math.abs(point1[0] - point2[0] + 1) * Math.abs(point1[1] - point2[1] + 1);
};

const calculateStar1 = () => {
    const data = loadTestData(true);
    let minSquare = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
            const square = calculateSquare(data[i].point, data[j].point);
            if (square > minSquare) {
                minSquare = square;
            }
        }
    }
    return minSquare;
}

const checkInsideRayCasting = (point, data) => {
    const [x, y] = point;
    let inside = false;
    
    const isOnSegment = (px, py, ax, ay, bx, by) => {
        const cross = (py - ay) * (bx - ax) - (px - ax) * (by - ay);
        if (Math.abs(cross) > 1e-9) return false;
        
        const dot = (px - ax) * (bx - ax) + (py - ay) * (by - ay);
        if (dot < 0) return false;
        
        const squaredLength = (bx - ax) ** 2 + (by - ay) ** 2;
        if (dot > squaredLength) return false;
        
        return true;
    };

    for (let i = 0; i < data.length; i++) {
        const p1 = data[i].point;
        const p2 = data[i < data.length - 1 ? i + 1 : 0].point;
        
        if (isOnSegment(x, y, p1[0], p1[1], p2[0], p2[1])) return true;

        const [x1, y1] = p1;
        const [x2, y2] = p2;

        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        
        if (y >= minY && y < maxY) {
             const xInter = x1 + (y - y1) * (x2 - x1) / (y2 - y1);
             if (xInter >= x) {
                 inside = !inside;
             }
        }
    }
    return inside;
}

const largestRectangleArea = (heights) => {
    return heights.reduce((max, height) => Math.max(max, height), 0);
}

const calculateStar2 = () => {
    const data = loadTestData(true);
    
    const xCoords = [...new Set(data.map(point => point.point[0]))].sort((a, b) => a - b);
    const yCoords = [...new Set(data.map(point => point.point[1]))].sort((a, b) => a - b);
    
    const buildGrid = (coords) => {
        const grid = [];
        for (let i = 0; i < coords.length; i++) {
            grid.push({ center: coords[i], width: 1 });
            
            if (i < coords.length - 1) {
                const gap = coords[i+1] - coords[i] - 1;
                if (gap > 0) {
                    grid.push({ center: (coords[i] + coords[i+1]) / 2, width: gap });
                }
            }
        }
        return grid;
    };
    
    const gridX = buildGrid(xCoords);
    const gridY = buildGrid(yCoords);
    
    const matrix = [];
    for (let r = 0; r < gridY.length; r++) {
        const row = [];
        for (let c = 0; c < gridX.length; c++) {
            const point = [gridX[c].center, gridY[r].center];
            row.push(checkInsideRayCasting(point, data) ? 1 : 0);
        }
        matrix.push(row);
    }

    const mWidth = matrix.length;
    const mHeight = matrix[0].length;
    const prefix = Array(mWidth + 1).fill(0).map(() => Array(mHeight + 1).fill(0));

    for (let r = 0; r < mWidth; r++) {
        for (let c = 0; c < mHeight; c++) {
            prefix[r + 1][c + 1] = prefix[r][c + 1] + prefix[r + 1][c] - prefix[r][c] + matrix[r][c];
        }
    }

    const isFullRect = (r1, c1, r2, c2) => {
        const totalCells = (r2 - r1 + 1) * (c2 - c1 + 1);
        const sum = prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1];
        return sum === totalCells;
    };
    
    const xToIdx = new Map();
    gridX.forEach((g, i) => { if (g.width === 1) xToIdx.set(g.center, i); });
    
    const yToIdx = new Map();
    gridY.forEach((g, i) => { if (g.width === 1) yToIdx.set(g.center, i); });

    let maxArea = 0;
    
    for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
            const p1 = data[i].point;
            const p2 = data[j].point;
            
            const x1 = Math.min(p1[0], p2[0]);
            const x2 = Math.max(p1[0], p2[0]);
            const y1 = Math.min(p1[1], p2[1]);
            const y2 = Math.max(p1[1], p2[1]);
            
            const c1 = xToIdx.get(x1);
            const c2 = xToIdx.get(x2);
            const r1 = yToIdx.get(y1);
            const r2 = yToIdx.get(y2);
            
            if (isFullRect(r1, c1, r2, c2)) {
                const area = (x2 - x1 + 1) * (y2 - y1 + 1);
                maxArea = Math.max(maxArea, area);
            }
        }
    }
    
    return maxArea;
}

console.time("Star 1");
console.log("1⭐:", calculateStar1());
console.timeEnd("Star 1");

console.time("Star 2");
console.log("2⭐:", calculateStar2());
console.timeEnd("Star 2");
