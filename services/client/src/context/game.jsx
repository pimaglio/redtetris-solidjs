import { createContext, createEffect, createSignal, onMount, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Manager } from "socket.io-client";
import { useLocation, useNavigate } from "@solidjs/router";
// helpers
import { createGrid, buildBlock, updateGrid, checkCollision, rotateBlock } from "../helpers/gameHelpers";
// hooks
import { useInterval } from "../hooks/useInterval";
// constants
import { TETRIMINO_LIST } from "../constants/tetriminos";
import { BLOCK_LIST_ALERT_THRESHOLD, DROP_TIME } from "../constants/game";

// ----------------------------------------------------------------------

const GameStateContext = createContext();
const GameDispatchContext = createContext();

export const useGameState = () => useContext(GameStateContext);
export const useGameDispatch = () => useContext(GameDispatchContext);

// ----------------------------------------------------------------------

const initialState = {
    isLoading: true,
    socket: null,
    manager: null,
    room: null,
    player: null,
    gameStatus: 'pending',
    grid: []
};

// ----------------------------------------------------------------------

export default function GameProvider( props ) {
    const [ store, setStore ] = createStore(initialState);
    const navigate = useNavigate();
    const location = useLocation();

    const [ block, setBlock ] = createSignal({
        pos: { x: 0, y: 0 },
        tetrimino: TETRIMINO_LIST[0].shape,
        collided: false,
    })
    const [ dropTime, setDropTime ] = createSignal(0)
    let dropInterval = null

    const initSocketManager = () => {
        const env = import.meta.env

        const manager = new Manager(`http://0.0.0.0:80`);
        const socket = manager.socket("/", {
            auth: {
                userId: 'test-id',
            },
        });

        socket.on("connect_error", ( err ) => {
            console.log("ERROR SOCKET CONNECT", err.message);
        });

        setStore("socket", socket);
        setStore("manager", manager);
    };

    onMount(async () => {
        initSocketManager();
    });

    createEffect(() => {
        const socket = store.socket
        if (socket) {
            socket.on('gameStarted', ( blockList ) => {
                let initialBlock = buildBlock(blockList[0])
                blockList.splice(0,1)
                setStore('room', produce(room => {
                    room.blockList = blockList
                }))
                setStore('gameStatus', 'active')
                setDropTime(DROP_TIME)
                setStore('grid', updateGrid(store.grid, [initialBlock]))
                setBlock(initialBlock)
                console.log('GAME STARTED', blockList.length)
            })
        }
    })

    const getNextBlock = () => {
        // convert tetrimino letter to corresponding shape and get object
        const nextBlock = buildBlock(store?.room?.blockList[0])
        // update grid if no block collision otherwise set game over
        let isCollided = checkCollision(nextBlock,store.grid, { x: 0, y: 0 })

        setStore('grid', updateGrid(store.grid, [
            {
                ...block(),
                collided: true
            },
            nextBlock
        ]))

        setBlock(nextBlock)

        // remove 1 tetrimino from blockList
        setStore('room', produce(room => {
            room.blockList.splice(0,1)
            // if low blockList get more block from server
            if (room.blockList.length < BLOCK_LIST_ALERT_THRESHOLD) {
                store.socket.emit('getMoreBlocks', {
                    storeName: store.room.name,
                    playerName: store.player.username
                }, (nextBlockList) => {
                    setStore('room', produce(room => {
                        room.blockList = [...room.blockList, ...nextBlockList]
                    }))
                })
            }
        }))
    }

    const updateBlockPosition = ( { block, x, y } ) => {
        if (store.gameStatus === 'active') {
            const isCollided = checkCollision(block, store.grid, { x, y })
            console.log('handleCheckCollision', isCollided, block)
            if (!isCollided) {
                let newBlockPosition = {
                    ...block,
                    pos: { x: (block.pos.x += x), y: (block.pos.y += y) }
                }
                setBlock(newBlockPosition)
                setStore('grid', updateGrid(store.grid, [newBlockPosition]))
            }
            else if (isCollided === 'end' || isCollided === 'tetrimino') {
                // check if starting collision -> game over
                if (block.pos.y < 3) stopGame()
                return getNextBlock()
            }
        }
    }

    const softDrop = () => {
        updateBlockPosition({ block: block(), x: 0, y: 1 })
    }

    const handleMoveBlock = ( x, y ) => {
        updateBlockPosition({block: block(), x, y })
    }

    const handleRotateBlock = () => {
        const blockRotated = rotateBlock(store.grid, block())
        updateBlockPosition({block: blockRotated, x: 0, y: 0})
    }

    useInterval(() => {
        softDrop()
    }, dropTime)

    const joinRoom = ( roomData ) => {
        return new Promise(( resolve, reject ) => {
            store.socket.emit('joinRoom', roomData, ( data ) => {
                if (data === 'userExist') reject(data)
                else {
                    setStore('room', data.room)
                    setStore('player', data.player)
                    setStore('isLoading', false)
                    setStore('grid', createGrid())
                    navigate(`/${roomData.room}[${roomData.username}]`, { replace: true });
                }
            });
        })
    };

    const handleKeyActions = ( key ) => {
        switch (key) {
            case 'ArrowLeft':
                handleMoveBlock( -1, 0 )
                break;
            case 'ArrowRight':
                handleMoveBlock( 1, 0 )
                break;
            case 'ArrowDown':
                handleMoveBlock( 0, 1)
                break;
            case ' ':
                break;
            case 'ArrowUp':
                handleRotateBlock()
                break;
            default:
                break;
        }
    }

    const startGame = () => {
        console.log('HANDLE START GAME')
        store.socket.emit('startGame', { room: store.room.name });
    }

    const stopGame = () => {
        setDropTime(0)
        store.socket.emit('gameOver', { room: store.room.name, playerName: store.player.username });
    }

    return (
        <GameStateContext.Provider value={store}>
            <GameDispatchContext.Provider
                value={{
                    joinRoom,
                    startGame,
                    handleKeyActions
                }}
            >
                {props.children}
            </GameDispatchContext.Provider>
        </GameStateContext.Provider>
    );
}


