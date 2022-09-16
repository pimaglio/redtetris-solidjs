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

export const checkCollision = (block, grid, { x: moveX, y: moveY }) => {
    for (let y = 0; y < block.tetrimino.length; y += 1) {
        for (let x = 0; x < block.tetrimino[y].length; x += 1) {
            // 1. Check that we're on an actual Tetromino cell
            if (block.tetrimino[y][x] !== 0) {
                if (
                    // 2. Check that our move is inside the game areas height (y)
                    // That we're not go through bottom of the play area
                    !grid[y + block.pos.y + moveY] ||
                    // 3. Check that our move is inside the game areas width (x)
                    !grid[y + block.pos.y + moveY][x + block.pos.x + moveX] ||
                    // 4. Check that the cell wer'e moving to isn't set to clear
                    grid[y + block.pos.y + moveY][x + block.pos.x + moveX][1] !== 'clear'
                ) {
                    return true
                }
            }
        }
    }
    return false
}

export const updateGrid = (grid, block) => {
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

    if (block.tetrimino) {
        for (let i = 0; i < block.tetrimino.length; i++) {
            for (let j = 0; j < block.tetrimino[i].length; j++) {
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

    return newGrid
};
