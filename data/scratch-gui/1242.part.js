/* 1242 */\n (function(module, exports) {\nfunction Grid(points, cellSize) {\n    this._cells = [];\n    this._cellSize = cellSize;\n    points.forEach(function(point) {\n        var cellXY = this.point2CellXY(point),\n            x = cellXY[0],\n            y = cellXY[1];\n        if (this._cells[x] === undefined) {\n            this._cells[x] = [];\n        }\n        if (this._cells[x][y] === undefined) {\n            this._cells[x][y] = [];\n        }\n        this._cells[x][y].push(point);\n    }, this);\n}\nGrid.prototype = {\n    cellPoints: function(x, y) { // (Number, Number) -> Array\n        return (this._cells[x] !== undefined && this._cells[x][y] !== undefined) ? this._cells[x][y] : [];\n    },\n    rangePoints: function(bbox) { // (Array) -> Array\n        var tlCellXY = this.point2CellXY([bbox[0], bbox[1]]),\n            brCellXY = this.point2CellXY([bbox[2], bbox[3]]),\n            points = [];\n        for (var x = tlCellXY[0]; x <= brCellXY[0]; x++) {\n            for (var y = tlCellXY[1]; y <= brCellXY[1]; y++) {\n                points = points.concat(this.cellPoints(x, y));\n            }\n        }\n        return points;\n    },\n    removePoint: function(point) { // (Array) -> Array\n        var cellXY = this.point2CellXY(point),\n            cell = this._cells[cellXY[0]][cellXY[1]],\n            pointIdxInCell;\n        \n        for (var i = 0; i < cell.length; i++) {\n            if (cell[i][0] === point[0] && cell[i][1] === point[1]) {\n                pointIdxInCell = i;\n                break;\n            }\n        }\n        cell.splice(pointIdxInCell, 1);\n        return cell;\n    },\n    point2CellXY: function(point) { // (Array) -> Array\n        var x = parseInt(point[0] / this._cellSize),\n            y = parseInt(point[1] / this._cellSize);\n        return [x, y];\n    },\n    extendBbox: function(bbox, scaleFactor) { // (Array, Number) -> Array\n        return [\n            bbox[0] - (scaleFactor * this._cellSize),\n            bbox[1] - (scaleFactor * this._cellSize),\n            bbox[2] + (scaleFactor * this._cellSize),\n            bbox[3] + (scaleFactor * this._cellSize)\n        ];\n    }\n};\nfunction grid(points, cellSize) {\n    return new Grid(points, cellSize);\n}\nmodule.exports = grid;\n })