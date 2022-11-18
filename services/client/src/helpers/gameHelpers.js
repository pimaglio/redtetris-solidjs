import { TETRIMINO_LIST } from "../constants/tetriminos";

export const GRID_WIDTH = 10
export const GRID_HEIGHT = 20

export const buildBlock = (blockShape) => (
    {
        pos: { x: 4, y: 0 },
        tetrimino: TETRIMINO_LIST[blockShape].shape,
        collided: false,
    }
)

export const createGrid = () =>
    Array.from(Array(GRID_HEIGHT), () => Array(GRID_WIDTH).fill([0, 'clear']))

const sweepRows = (newRow) =>
    newRow.reduce((ack, row) => {
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
            // TO DO ADD LINE DONE COUNTER
            ack.unshift(new Array(newRow[0].length).fill([0, 'clear']));
            return ack;
        }
        ack.push(row);
        return ack;
    }, []);

export const checkCollision = (block, grid, { x: moveX, y: moveY }) => {
    for (let y = 0; y < block.tetrimino.length; y += 1) {
        for (let x = 0; x < block.tetrimino[y].length; x += 1) {
            if (block.tetrimino[y][x] !== 0) {
                if (!grid[y + block.pos.y + moveY]) return 'end'
                else if (!grid[y + block.pos.y + moveY][x + block.pos.x + moveX]) return 'out'
                else if (grid[y + block.pos.y + moveY][x + block.pos.x + moveX][1] !== 'clear') return 'tetrimino'
            }
        }
    }
    return false
}

export const updateGrid = (grid, blockList) => {
    // First flush the stage
    const newGrid = grid.map((row) => row.map((cell) => (cell[1] !== 'merged' ? [0, 'clear'] : cell)));


    // const getPrediction = () => {
    //   let newBlock = JSON.parse(JSON.stringify(block))
    //   if (newBlock.tetrimino[0][1]) {
    //     let pos = 0
    //     while (!checkCollision(newBlock, grid, { x: 0, y: 1 })) {
    //       newBlock.pos.y += 1
    //       pos++
    //     }
    //     return { x: 0, y: pos }
    //   } else return false
    // }
    //
    // const predict = getPrediction()

    let needCheckCompleteLine = false

    for (let block of blockList) {
        if (block.tetrimino) {
            for (let i = 0; i < block.tetrimino.length; i++) {
                for (let j = 0; j < block.tetrimino[i].length; j++) {
                    if (block.collided) needCheckCompleteLine = true
                    if (block.tetrimino[i][j] !== 0) {
                        newGrid[i + block.pos.y][j + block.pos.x] = [
                            block.tetrimino[i][j],
                            `${block.collided ? 'merged' : 'clear'}`
                        ];
                        // if (predict && !block.collided && predict.y > 1) {
                        //   newGrid[i + predict.y + block.pos.y][j + block.pos.x] = [
                        //     block.tetrimino[i][j],
                        //     'clear',
                        //   ]
                        // }
                    }
                }
            }
        }
    }

    if (needCheckCompleteLine) return sweepRows(newGrid)

    return newGrid
};

function rotate(matrix, dir) {
    // Make the rows to become cols (transpose)
    const mtrx = matrix.map((_, index) => matrix.map(column => column[index]))
    // Reverse each row to get a rotaded matrix
    if (dir > 0) return mtrx.map(row => row.reverse())
    return mtrx.reverse()
}

export const rotateBlock = (grid, block) => {
    const dir = 1
    const newBlock = JSON.parse(JSON.stringify(block))
    newBlock.tetrimino = rotate(newBlock.tetrimino, dir)

    const pos = newBlock.pos.x
    let offset = 1
    while (checkCollision(newBlock, grid, { x: 0, y: 0 })) {
        newBlock.pos.x += offset
        offset = -(offset + (offset > 0 ? 1 : -1))
        if (offset > newBlock.tetrimino[0].length) {
            rotate(newBlock.tetrimino, -dir)
            newBlock.pos.x = pos
            return
        }
    }

    return newBlock
}
