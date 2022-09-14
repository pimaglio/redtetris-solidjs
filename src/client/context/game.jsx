import { createContext, onMount, Show, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Manager } from "socket.io-client";
import { useLocation, useNavigate } from "@solidjs/router";

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
    player: null
};

// ----------------------------------------------------------------------

export default function GameProvider(props) {
    const [store, setStore] = createStore(initialState);
    const navigate = useNavigate();
    const location = useLocation();

    const initSocketManager = () => {
        const manager = new Manager(`http://${import.meta.env.VITE_HOST_NAME}:5000`);
        const socket = manager.socket("/", {
            auth: {
                userId: 'test-id',
            },
        });

        socket.on("connect_error", (err) => {
            console.log(err.message);
        });

        setStore("socket", socket);
        setStore("manager", manager);
    };

    onMount(async () => {
        initSocketManager();
    });

    const joinRoom = (roomData) => {
        return new Promise((resolve, reject) => {
            store.socket.emit('joinRoom', roomData, (data) => {
                if (data === 'userExist') reject(data)
                else {
                    setStore('room', data.room)
                    setStore('player', data.player)
                    setStore('isLoading', false)
                    navigate(`/${roomData.room}[${roomData.username}]`, { replace: true });
                }
            });
        })
    };

    return (
        <GameStateContext.Provider value={store}>
            <GameDispatchContext.Provider
                value={{
                    joinRoom
                }}
            >
                {props.children}
            </GameDispatchContext.Provider>
        </GameStateContext.Provider>
    );
}


