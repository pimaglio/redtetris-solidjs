import { createContext, createEffect, createSignal, onMount, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Manager } from "socket.io-client";
import { useLocation, useNavigate } from "@solidjs/router";
// helpers
import { createGrid, buildBlock, updateGrid, checkCollision } from "../helpers/gameHelpers";
// hooks
import { useInterval } from "../hooks/useInterval";
// constants
import { TETRIMINO_LIST } from "../constants/tetriminos";
import { DROP_TIME } from "../constants/game";

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
    const [ dropTime, setDropTime ] = createSignal(null)

    const initSocketManager = () => {
        const manager = new Manager(`http://${import.meta.env.VITE_HOST_NAME}:5000`);
        const socket = manager.socket("/", {
            auth: {
                userId: 'test-id',
            },
        });

        socket.on("connect_error", ( err ) => {
            console.log(err.message);
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
            socket.on('gameStarted', ( data ) => {
                let newBlock = buildBlock(data[0])
                setStore('room', produce(room => {
                    room.listBlocks = data
                }))
                setDropTime(DROP_TIME)
                setStore('grid', updateGrid(store.grid, newBlock))
                setBlock(newBlock)
                console.log('GAME STARTED', data[0])
            })
        }
    })

    const updateBlockPosition = ({ x, y, collided }) => {
        let newBlockPosition = {
            ...block(),
            pos: {x: (block().pos.x += x), y: (block().pos.y += y) }
        }
        setBlock(newBlockPosition)
        setStore('grid', updateGrid(store.grid, newBlockPosition))
    }

    const softDrop = () => {
        updateBlockPosition({ x: 0, y: 1, collided: false })
    }

    const handleMoveBlock = (dir) => {
        if (!checkCollision(block(), store.grid, { x: dir, y: 0 })) {
            updateBlockPosition({ x: dir, y: 0 })
        }
    }

/*    useInterval(() => {
        softDrop()
    }, dropTime)*/

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
                handleMoveBlock(-1)
                break;
            case 'ArrowRight':
                handleMoveBlock(1)
                break;
            case 'ArrowDown':
                softDrop()
                break;
            case ' ':

                break;
            case 'ArrowUp':

                break;
            default:
                break;
        }
    }

    const startGame = () => {
        console.log('HANDLE START GAME')
        store.socket.emit('startGame', { room: store.room.name });
        setStore('isLoading', true)
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


